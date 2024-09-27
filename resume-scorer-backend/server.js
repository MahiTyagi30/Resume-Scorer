const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 
// Set up multer to handle file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
});

// Define job profiles and their respective keywords
const jobProfiles = {
  'ReactJS Developer': {
    hardSkills: ['react', 'javascript', 'redux', 'html', 'css', 'git', 'webpack'],
    softSkills: ['problem-solving', 'attention to detail', 'teamwork'],
    certifications: ['react developer certification', 'javascript certification', 'full stack web developer certification']
  },
  'Full Stack Developer': {
    hardSkills: ['javascript', 'node.js', 'react', 'mongodb', 'sql', 'html', 'css', 'git', 'docker'],
    softSkills: ['problem-solving', 'communication', 'time management'],
    certifications: ['full stack web developer certification', 'aws certified developer', 'google cloud certification']
  },
  'Frontend Developer': {
    hardSkills: ['html', 'css', 'javascript', 'react', 'vue.js', 'angular', 'responsive design'],
    softSkills: ['attention to detail', 'creativity', 'problem-solving'],
    certifications: ['frontend web developer certification', 'javascript certification', 'react developer certification']
  },
  'Web Developer': {
    hardSkills: ['html', 'css', 'javascript', 'php', 'wordpress', 'seo', 'responsive design'],
    softSkills: ['creativity', 'communication', 'attention to detail'],
    certifications: ['web developer certification', 'wordpress developer certification', 'seo certification']
  },
  'Software Engineer': {
    hardSkills: ['java', 'react', 'python', 'sql', 'node', 'javascript'],
    softSkills: ['teamwork', 'communication', 'problem-solving'],
    certifications: ['aws certification', 'scrum master', 'oracle certified', 'google cloud certification']
  },
  'Data Scientist': {
    hardSkills: ['python', 'r', 'sql', 'data analysis', 'machine learning', 'statistics'],
    softSkills: ['analytical thinking', 'attention to detail', 'communication'],
    certifications: ['aws certified data analytics', 'google professional data engineer', 'tensorflow certification']
  },
  'Product Manager': {
    hardSkills: ['product lifecycle', 'roadmap', 'agile', 'jira', 'market research'],
    softSkills: ['leadership', 'communication', 'decision-making', 'strategy'],
    certifications: ['pmp', 'scrum master', 'product management certification']
  }
  
};


// Function to calculate score based on resume content and job profile
const calculateResumeDetails = (resumeText, jobProfile) => {
  const profileKeywords = jobProfiles[jobProfile];
  if (!profileKeywords) {
    throw new Error('Invalid job profile selected.');
  }

  const { hardSkills, softSkills, certifications } = profileKeywords;
  let score = 0;
  let matchedCharacters = 0;
  let suggestions = [];

  const totalCharacters = resumeText.length;

  // Hard Skills (15%)
  hardSkills.forEach((skill) => {
    const regex = new RegExp(skill, 'gi');
    const matches = resumeText.match(regex);
    if (matches) {
      matches.forEach(match => {
        matchedCharacters += match.length;
      });
      score += 5;
    }
  });

  // Soft Skills (5%)
  softSkills.forEach((skill) => {
    const regex = new RegExp(skill, 'gi');
    const matches = resumeText.match(regex);
    if (matches) {
      matches.forEach(match => {
        matchedCharacters += match.length;
      });
      score += 2;
    }
  });

  // Certifications (5%)
  certifications.forEach((cert) => {
    const regex = new RegExp(cert, 'gi');
    const matches = resumeText.match(regex);
    if (matches) {
      matches.forEach(match => {
        matchedCharacters += match.length;
      });
      score += 3;
    }
  });

  // Experience Section (20-30%)
  if (resumeText.toLowerCase().includes('experience')) {
    score += 10;
    const yearsOfExperience = (resumeText.match(/(\d+)\s+years?\s+of\s+experience/g) || []).length;
    score += Math.min(20, yearsOfExperience * 5); // Add score based on experience, cap at 20%
  } else {
    suggestions.push('Add a work experience section to showcase your professional history.');
  }

  // Education Section (10-15%)
  if (resumeText.toLowerCase().includes('education')) {
    score += 10;
    if (resumeText.toLowerCase().includes('b.tech') || resumeText.toLowerCase().includes('b.sc')) {
      score += 5; // Extra points for relevant education
    }
  } else {
    suggestions.push('Include your education history, as it helps show your qualifications.');
  }

  // Projects Section (10-15%)
  if (resumeText.toLowerCase().includes('projects')) {
    score += 10;
    const relevantProjects = resumeText.match(/full stack|open source|react/g) || [];
    relevantProjects.forEach(project => {
      matchedCharacters += project.length;
    });
    score += relevantProjects.length * 2;
  } else {
    suggestions.push('Include a projects section to showcase your achievements.');
  }

  // Additional Sections
  if (resumeText.toLowerCase().includes('award') || resumeText.toLowerCase().includes('honor')) {
    score += 5; // Add points for achievements and awards
  }

  // Character Match Percentage as Integer
  const characterMatch = Math.floor((matchedCharacters / totalCharacters) * 100);

  if (resumeText.length < 300) {
    suggestions.push('Your resume seems too short. Try to include more detailed information about your experience and skills.');
  } else if (resumeText.length > 3000) {
    suggestions.push('Your resume is too long. Try to keep it concise and focused on key achievements.');
  }

  return {
    score: Math.min(100, score), // Cap the total score at 100
    characterMatch,
    suggestions
  };
};



// Route to handle resume upload
app.post('/upload-resume', upload.single('resume'), async (req, res) => {
  const { jobProfile } = req.body; // Get job profile from request body
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const fileType = req.file.mimetype;
  if (fileType !== 'application/pdf') {
    return res.status(400).json({ error: 'Only PDF resumes are allowed.' });
  }

  try {
    const resumeData = await pdfParse(req.file.buffer);
    const resumeText = resumeData.text;

    // Calculate score, characterMatch, and suggestions based on resume content and job profile
    const { score, characterMatch, suggestions } = calculateResumeDetails(resumeText, jobProfile);
    console.log('Calculated score:', score);
    console.log('Character match:', characterMatch);
    console.log('Suggestions:', suggestions);

    // Send the score, characterMatch, and suggestions back to the frontend
    res.json({ score, characterMatch, suggestions });
  } catch (error) {
    console.error('Error parsing the resume:', error);
    res.status(500).json({ error: 'Error parsing resume.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
