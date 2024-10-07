const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
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

// Sample jobProfiles data (you can define your job profiles here or load from a database)
const jobProfiles = {
  "softwareEngineer": { /* job profiles data */ },
  "dataAnalyst": { /* job profiles data */ }
};

// Function to calculate resume details (remains unchanged)
// ...

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
