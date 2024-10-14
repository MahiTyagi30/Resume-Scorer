const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Ensure 'uploads' directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Job profiles and their associated keywords
const jobProfiles = {
  'ReactJS Developer': ["React", "JavaScript", "Redux", "CSS", "HTML", "Node.js"],
  'Full Stack Developer': ["JavaScript", "Node.js", "React", "Express", "MongoDB", "REST APIs"],
  'Frontend Developer': ["HTML", "CSS", "JavaScript", "React", "Vue", "Angular"],
  'Web Developer': ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
  'Software Engineer': ["Java", "C++", "Python", "Algorithms", "Data Structures"],
  'Data Scientist': ["Python", "R", "Machine Learning", "Statistics", "SQL", "Pandas"],
  'Product Manager': ["Agile", "Scrum", "Roadmap", "User Experience", "Stakeholder Management"]
};

// Function to calculate resume details
const calculateResumeDetails = (resumeText, jobProfile) => {
  if (!resumeText || !jobProfile || !jobProfiles[jobProfile]) {
    throw new Error('Invalid input data');
  }

  const keywords = jobProfiles[jobProfile];
  
  // Scoring criteria
  const scoringCriteria = {
    contactInfo: { weight: 3, keywords: ["name", "phone", "email", "LinkedIn"] },
    professionalSummary: { weight: 3, keywords: ["summary", "achievements", "goals"] },
    workExperience: { weight: 3, keywords: ["experience", "job title", "company", "dates", "action verbs"] },
    education: { weight: 3, keywords: ["degree", "certification", "institution"] },
    skills: { 
      weight: 3, 
      keywords: [
        "skills", 
        "expertise", 
        "proficient", 
        "soft skills", 
        "communication", 
        "leadership", 
        "teamwork", 
        "problem solving"
      ] 
    },
    customTailoring: { weight: 3, keywords: ["keywords", "job description"] },
    additionalSections: { weight: 3, keywords: ["volunteer", "certifications", "languages"] }
  };

  let totalScore = 0;

  // Calculate score based on each criterion
  for (const criterion in scoringCriteria) {
    const { weight, keywords } = scoringCriteria[criterion];
    let criterionScore = 0;

    // Add score for the presence of the section
    criterionScore += weight;

    // Keyword scoring for skills
    if (criterion === 'skills') {
      keywords.forEach(keyword => {
        if (resumeText.toLowerCase().includes(keyword.toLowerCase())) {
          criterionScore += 5; // 5 points for each skill keyword
        }
      });
    }

    totalScore += criterionScore;
  }

  // Score based on resume length
  const lengthScore = Math.min(Math.floor(resumeText.length / 100), 5); // 5 points for sufficient length
  totalScore += lengthScore;

  // Ensure totalScore is capped at 100
  totalScore = Math.min(totalScore, 100);

  // Determine feedback based on score range
  let feedback;
  if (totalScore >= 90) {
    feedback = "Excellent";
  } else if (totalScore >= 75) {
    feedback = "Good";
  } else if (totalScore >= 50) {
    feedback = "Fair";
  } else {
    feedback = "Needs Improvement";
  }

  return { score: Math.round(totalScore), feedback, details: `Profile matched: ${jobProfile}` };
};

// API endpoint to process resume text directly
app.post('/score-resume', (req, res) => {
  const { resumeText, jobProfile } = req.body;

  try {
    const result = calculateResumeDetails(resumeText, jobProfile);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// New API endpoint to handle file uploads
app.post('/upload-resume', upload.single('resume'), (req, res) => {
  const jobProfile = req.body.jobProfile; // Job profile from request

  // Read the uploaded file
  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }
    
    // Once file is read, pass the text content to calculateResumeDetails
    try {
      const result = calculateResumeDetails(data, jobProfile);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    } finally {
      // Optionally delete the uploaded file after processing
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
        }
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
