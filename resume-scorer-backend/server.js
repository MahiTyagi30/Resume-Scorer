const express = require('express');
const multer = require('multer'); // For handling file uploads
const natural = require('natural'); // For natural language processing
const cors = require('cors'); // For handling CORS
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse'); // For parsing PDF files
const { Document, Packer } = require('docx'); // For handling DOCX files

const app = express();
app.use(express.json());
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/upload-resume', upload.single('resume'), async (req, res) => {
    const jobProfile = req.body.jobProfile;

    if (!req.file || !jobProfile) {
        return res.status(400).json({ message: 'File or Job Profile missing' });
    }

    try {
        const resumeText = await extractTextFromResume(req.file);
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(resumeText);

        // Example: scoring based on keyword match (simple placeholder logic)
        const keywords = getKeywordsForJobProfile(jobProfile);
        const matchedKeywords = tokens.filter(token => keywords.includes(token.toLowerCase()));

        const score = (matchedKeywords.length / keywords.length) * 100; // Calculate score based on matches
        const characterMatch = matchedKeywords.length;

        res.json({
            score: Math.round(score),
            characterMatch,
            matchDetails: matchedKeywords,
            suggestions: generateSuggestions(tokens, keywords), // Generate suggestions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing the resume' });
    }
});

// Function to extract text from resume
async function extractTextFromResume(file) {
    const filePath = path.join(__dirname, file.path);
    const fileExt = path.extname(file.originalname).toLowerCase();

    let text = '';

    if (fileExt === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        text = data.text; // Extracted text from PDF
    } else if (fileExt === '.docx') {
        const doc = await Document.load(filePath);
        text = doc.getText(); // Extracted text from DOCX (may require additional logic)
    } else {
        throw new Error('Unsupported file type');
    }

    // Clean up the uploaded file after extraction
    fs.unlinkSync(filePath); // Remove the file after processing
    return text;
}

// Rest of your code remains the same...

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
