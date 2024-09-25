import React, { useState } from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faApple, faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'; 
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [score, setScore] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setScore(null); // Reset the score when a new file is selected
    setUploadError(''); // Clear any previous error
    setUploadSuccess(''); // Clear success message
  };

  // Handle file upload
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
  
    const formData = new FormData();
    formData.append('resume', selectedFile);
  
    try {
      const response = await fetch('http://localhost:5000/upload-resume', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Full Response data:', data); // Log full response
  
      if (data.score !== undefined) {
        setUploadSuccess(`Uploaded: ${selectedFile.name}`);
        setScore(data.score); // Update score state
  
        // Ensure all fields are available
        navigate('/score', {
          state: {
            score: data.score,
            characterMatch: data.characterMatch || 0,
            matchDetails: data.matchDetails || [], // Assuming matchDetails if you add that
            suggestions: data.suggestions || []
          },
        });
      } else {
        setUploadError('Score data not found in the response.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Error connecting to the server. Please try again.');
    }
  };
  

  return (
    <div className="home-page">
      <header>
        <div className="container">
          <h1>RESUME SCORER</h1>
          <div className='sub1'>
          <div className="sub-header">Login/Signup</div>
          <div className="sub-header">Get Free Resume Score</div>
          </div>
          
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="content-wrapper">
            <div className="main">
              <h2>Welcome to Resume Scorer</h2>
              <h2>GET EXPERT FEEDBACK ON YOUR RESUME INSTANTLY</h2>
              <p>
                Our free AI-powered resume checker scores your resume on key criteria recruiters and hiring managers look for. Get actionable steps to revamp your resume and land more interviews.
              </p>

              {/* Resume upload box */}
              <div className="dropbox">
                <form onSubmit={handleUpload}>
                  <input
                    type="file"
                    id="file-upload"
                    className="file-input"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="file-label">
                    <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                    <div className="upload-text">
                      <strong>Drop your resume here or choose a file.</strong>
                      <p>English resumes in PDF format only. Max 5MB file size.</p>
                    </div>
                    <div className="privacy-badge">100% privacy</div>
                  </label>
                  <button type="submit" className="upload-btn">
                    Upload Resume
                  </button>
                </form>
              </div>

              {/* Error message */}
              {uploadError && <p className="error-message">{uploadError}</p>}

              {/* Success message */}
              {uploadSuccess && <p className="success-message">{uploadSuccess}</p>}

              {/* Display score */}
              {score !== null && (
                <div className="score-display" style={{ color: 'black', fontSize: '20px' }}>
                  <h3>Your Resume Score: {score}</h3>
                </div>
              )}
            </div>

            <div className="image-content">
              <img
                src="https://www.resumego.net/wp-content/uploads/resumechecker4.png"
                alt="Resume Preview"
              />
            </div>
          </div>
        </section>

        <section className="main-2">
          <h1>AI RESUME REVIEW TOOL DESIGNED BY RECRUITERS</h1>

          <div className="d1">
            <div>
              <h2>Find out your resume score, see how you compare.</h2>
              <p>
                Our resume checker compares your resume against other successful resumes. 
                Improve your CV with personalized tips and a detailed report.
              </p>
            </div>
            <div className="image-container">
              <img src="https://www.livecareer.com/lcapp/uploads/2023/01/resume-strength.png" alt="Resume Example" />
            </div>
          </div>

          <div className="d1">
            <div>
              <h2>How do we calculate your resume score?</h2>
              <p>
                We grade your resume based on key criteria such as structure, content, and keywords that recruiters look for.
              </p>
            </div>
            <div className="image-container">
              <img src="https://cdn.prod.website-files.com/627c8700df0be67c4b1d533c/65319680bcee14a021a3dc7f_Show_Me_Checker.png" alt="Resume Example" />
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-column">
              <h3>About Us</h3>
              <p>
                Resume Scorer is an AI-powered tool to help job seekers improve their resumes and increase their chances of landing interviews.
              </p>
            </div>

            <div className="footer-column">
              <h3>Contact Us</h3>
              <ul>
                <li>Email: support@resumescorer.com</li>
                <li>Phone: +123-456-7890</li>
                <li>Address: 123 Resume St, Jobtown, USA</li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Useful Links</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
                <a href="https://www.apple.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faApple} />
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Resume Scorer. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
