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
  
    // Function to add suggestions for missing skills
    const addMissingSuggestions = (keywords, type) => {
      const missingKeywords = keywords.filter((keyword) => {
        const regex = new RegExp(keyword, 'gi');
        return !resumeText.match(regex);
      });
  
      if (missingKeywords.length > 0) {
        suggestions.push(`Consider adding the following missing ${type}: ${missingKeywords.join(', ')}.`);
      }
    };
  
    // Hard Skills (15%)
    hardSkills.forEach((skill) => {
      const regex = new RegExp(skill, 'gi');
      const matches = resumeText.match(regex);
      if (matches) {
        matches.forEach((match) => {
          matchedCharacters += match.length;
        });
        score += 5;
      }
    });
  
    // Suggest missing hard skills
    addMissingSuggestions(hardSkills, 'hard skills');
  
    // Soft Skills (5%)
    softSkills.forEach((skill) => {
      const regex = new RegExp(skill, 'gi');
      const matches = resumeText.match(regex);
      if (matches) {
        matches.forEach((match) => {
          matchedCharacters += match.length;
        });
        score += 2;
      }
    });
  
    // Suggest missing soft skills
    addMissingSuggestions(softSkills, 'soft skills');
  
    // Certifications (5%)
    certifications.forEach((cert) => {
      const regex = new RegExp(cert, 'gi');
      const matches = resumeText.match(regex);
      if (matches) {
        matches.forEach((match) => {
          matchedCharacters += match.length;
        });
        score += 3;
      }
    });
  
    // Suggest missing certifications
    addMissingSuggestions(certifications, 'certifications');
  
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
      relevantProjects.forEach((project) => {
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
    } else if (resumeText.length > 7000) {
      suggestions.push('Your resume is too long. Try to keep it concise and focused on key achievements.');
    }
  
    return {
      score: Math.min(100, score), // Cap the total score at 100
      characterMatch,
      suggestions,
    };
  };
  