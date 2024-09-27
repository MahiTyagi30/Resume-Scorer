import React, { useState,useEffect } from 'react';
import './Homepage2.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import atsImage from '../images/resume-apply-work-form-concept.jpg';
import img2 from '../images/4115334.jpg';
import img3 from '../images/5052521.jpg';
import Reviews from './Reviews';
import {Link, useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup, signOut,onAuthStateChanged } from './firebase'; // Import Firebase auth functions
import { setPersistence, browserSessionPersistence, signInWithRedirect } from 'firebase/auth';


function Homepage2() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [score, setScore] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [user, setUser] = useState(null); // State for user login
  const navigate = useNavigate();
  const [jobProfile, setJobProfile] = useState(''); // State for job profile
  const [showDropdown, setShowDropdown] = useState(false); // Control dropdown visibility
  // const navigate = useNavigate();

  // Job profiles (You can customize this list)
  const jobProfiles = ['ReactJS Developer','Full Stack Developer','Frontend Developer','Web Developer','Software Engineer', 'Data Scientist', 'Product Manager'];



  //handle login functionality
  

  const handleLogin = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence); // Persist for session only
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);  // Update the state with the logged-in user
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  
  

  // Handle Google logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is already logged in:', user);
        setUser(user);
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);
  

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setScore(null); // Reset the score when a new file is selected
    setUploadError(''); // Clear any previous error
    setUploadSuccess(''); // Clear success message
  
    // Set showDropdown to true when a file is selected
    if (event.target.files[0]) {
      setShowDropdown(true); // Show the dropdown after file selection
    } else {
      setShowDropdown(false); // Hide the dropdown if no file is selected
    }
  };
  
  // Handle file upload
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    if (!jobProfile) {
      setUploadError('Please select a job profile.');
      return;
    }
  
    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('jobProfile', jobProfile); // Add job profile to the request
  
    try {
      const response = await fetch('http://localhost:5000/upload-resume', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.score !== undefined) {
        setUploadSuccess(`Uploaded: ${selectedFile.name}`);
        setScore(data.score);
        navigate('/score', {
          state: {
            score: data.score,
            characterMatch: data.characterMatch || 0,
            matchDetails: data.matchDetails || [],
            suggestions: data.suggestions || [],
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
  

  const handleUploadClick = () => {
    document.getElementById('file-upload-input').click();
    console.log('Upload button clicked');
  };
  const handleProfileChange = (event) => {
    setJobProfile(event.target.value); // Set the selected job profile
  };

  return (
    <>
      <header>
        <div className="head">
          <h1>ResumeScan</h1>
          <div className="right-section">
          <ul className="nav">
  <li>Products</li>
  <li onClick={() => navigate('/templates')}>Build Resume</li>
  <li>Contact</li>
</ul>
            {user ? (
              <div className="user-section">
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="user-avatar"
                />
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <button onClick={handleLogin}>Login with Google</button>
            )}
          </div>
        </div>
      </header>
      <main>
        <section>
          <div className="main-content">
            <div className="left-content">
              <h1>Is Your Resume Good Enough? Get Your Free Resume Score Instantly</h1>
              <p>
                Our AI-powered resume score checker helps you write the perfect resume by comparing your resume to the job listing you're interested in.
                Get expert feedback on how to improve your resume and show the recruiter why you're the perfect match.
              </p>
              <div className="upload-container" onClick={handleUploadClick}>
                <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                <p>Upload your resume for a quick review!</p>
              </div>
            </div>
            <div className="right-image">
              <img
                src="https://cdn.prod.website-files.com/65dcdc8067ad38483fe3b6b4/664554a08279f9d8d88bee24_01.png"
                alt="Sample"
              />
            </div>
          </div>
        </section>

        {/* Companies section: Logos for which this resume is useful */}
        <section className="companies-logo-section">
          <h2>Resumes that Work for Top Companies</h2>
          <div className="companies-logo-container">
            <img src="https://logo.clearbit.com/linkedin.com" alt="LinkedIn" className="company-logo" />
            <img src="https://logo.clearbit.com/microsoft.com" alt="Microsoft" className="company-logo" />
            <img src="https://logo.clearbit.com/google.com" alt="Google" className="company-logo" />
            <img src="https://logo.clearbit.com/amazon.com" alt="Amazon" className="company-logo" />
            <img src="https://logo.clearbit.com/facebook.com" alt="Facebook" className="company-logo" />
          </div>
        </section>

        {/* New Upload Resume Section */}
        <section className="upload-resume-section">
          <div className="upload-box">
            <h3>Upload your resume to get started</h3>
            <input
              type="file"
              id="file-upload-input"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide input
            />
            <button className="upload-btn" onClick={handleUploadClick}>
              Upload your resume
            </button>

            {uploadError && <p className="error">{uploadError}</p>}
            {uploadSuccess && <p className="success">{uploadSuccess}</p>}

            {/* Show dropdown after file upload */}
            {showDropdown && (
              <>
                <select className="job-profile-dropdown" value={jobProfile} onChange={handleProfileChange}>
                  <option value="">Select Job Profile</option>
                  {jobProfiles.map((profile) => (
                    <option key={profile} value={profile}>
                      {profile}
                    </option>
                  ))}
                </select>
                {selectedFile && jobProfile && (
                  <button className="submit-btn" onClick={handleUpload}>
                    Submit
                  </button>
                )}
              </>
            )}

            <p>as .pdf or .docx file</p>
          </div>
        </section>


    

        {/* New Extra Info Section for Optimization Tips */}
        <section className="extra-info-section">
          <div className="info-content">
            <h2>Get Resume Optimization Tips</h2>
            <p>
              Struggling to get past ATS systems? We've got you covered! Here are some expert tips to help
              your resume stand out and make it through to the hiring manager:
            </p>
            <ul>
              <li>Use job-specific keywords that match the job description.</li>
              <li>Stick to standard resume formats like .pdf or .docx.</li>
              <li>Avoid using tables, images, or complex formatting.</li>
              <li>Make your contact details easily accessible.</li>
              <li>Keep it concise: one page for most jobs.</li>
            </ul>
          </div>
          <div className="info-image">
            <img
              src={img3}
            />
          </div>
        </section>

        <section className="skills-highlight-section">
  <div className="skills-content">
    <div className="skills-text">
      <h2>Highlight the Right Skills</h2>
      <p>
        Our resume scanner uses AI technology to analyze your resume and compare it to the job listing you want to apply for. You'll see the specific skills and experience the recruiter and hiring manager will be looking for in candidates and are searching for when they screen out candidates.
      </p>
      <p>
        Different companies have different needs and requirements for similar jobs. Our scanner helps you make sure your resume highlights the most relevant skills and work experience for each job you apply for.
      </p>
      <h3>What our keyword scanner checks</h3>
      <ul className="scanner-checks">
        <li><span className="check-number">1</span> Hard skills</li>
        <li><span className="check-number">2</span> Soft skills</li>
        <li><span className="check-number">3</span> Recommended skills</li>
        <li><span className="check-number">4</span> Keywords</li>
      </ul>
    </div>
    <div className="skills-image">
      <img src={img2} alt="Skills Scanner Example" />
    </div>
  </div>
</section>

<section className="ats-checker-section">
  <div className="ats-content">
    <div className="ats-image">
    <img src={atsImage} alt="ATS Resume Checker" />

    </div>
    <div className="ats-text">
      <h2>What our ATS resume checker scans:</h2>
      <ul className="ats-checks">
        <li><span className="check-number">1</span> File type <br />ATS read certain file types (.doc, .pdf, etc.) differently. Find out if your document file type is ATS-friendly.</li>
        <li><span className="check-number">2</span> Fonts & font size <br />Can the ATS read your font? If it can’t, it won’t parse the text correctly and your resume might not show in keyword searches.</li>
        <li><span className="check-number">3</span> Section headings <br />ATS parse information by the section headings. Using unconventional section names can cause parsing errors.</li>
        <li><span className="check-number">4</span> Date formatting <br />Date formatting helps the ATS correctly calculate your years of experience—a crucial part of many hiring decisions.</li>
        <li><span className="check-number">5</span> Header and footer <br />An ATS can’t read every part of a document. We’ll check your header and footer for information that might be missed.</li>
      </ul>
    </div>
  </div>
</section>




<section className="faq-section">
  <h2>Frequently Asked Questions</h2>
  <div className="faq-container">
    <div className="faq-item">
      <input type="checkbox" id="faq1" />
      <label htmlFor="faq1" className="faq-question">
        What is a resume scanner?
        <span className="arrow"></span>
      </label>
      <div className="faq-answer">
        <p>
          A resume scanner is a tool that analyzes a job seeker's resume and compares it to a job listing to identify the skills the recruiter or hiring manager will be looking for based on the context of the job. It also checks to make sure that the resume is ATS-friendly. Resume scanners help job seekers identify areas of their resume that need improvement and optimize their resumes with better formatting, keyword usage, and content. This can increase their chances of getting noticed by recruiters and getting job interviews.
        </p>
      </div>
    </div>

    <div className="faq-item">
      <input type="checkbox" id="faq2" />
      <label htmlFor="faq2" className="faq-question">
        What is the best resume scanner?
        <span className="arrow"></span>
      </label>
      <div className="faq-answer">
        <p>
          The best resume scanner is one that ensures your resume is tailored to the job description, highlighting key skills, experience, and formatting to match the ATS requirements. It should provide you feedback and improve your chances of getting selected by recruiters.
        </p>
      </div>
    </div>

    <div className="faq-item">
      <input type="checkbox" id="faq3" />
      <label htmlFor="faq3" className="faq-question">
        What tests does our ATS resume scanner run?
        <span className="arrow"></span>
      </label>
      <div className="faq-answer">
        <p>
          Our ATS resume scanner runs several checks, including file type, fonts, section headings, date formatting, and headers/footers. These checks ensure your resume is parsed correctly and improves its visibility in keyword searches.
        </p>
      </div>
    </div>

    <div className="faq-item">
      <input type="checkbox" id="faq4" />
      <label htmlFor="faq4" className="faq-question">
        Can I run my resume through ATS?
        <span className="arrow"></span>
      </label>
      <div className="faq-answer">
        <p>
          Yes! You can upload your resume and check its compatibility with ATS systems to ensure it meets the required standards.
        </p>
      </div>
    </div>
  </div>
</section>

<Reviews/>


<section className="footer-section">
          <div className="footer-container">
            <div className="footer-column">
              <h4>Platform</h4>
              <ul>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Resume Optimization</a></li>
                <li><a href="#">Resume Builder</a></li>
                <li><a href="#">Resume Power Edit</a></li>
                <li><a href="#">LinkedIn Optimization</a></li>
                <li><a href="#">Job Tracker</a></li>
                <li><a href="#">Career Change Tool</a></li>
                <li><a href="#">Cover Letter Optimization</a></li>
                <li><a href="#">Tutorials</a></li>
                <li><a href="#">Customer Stories</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>ATS Resume</h4>
              <ul>
                <li><a href="#">What is an ATS?</a></li>
                <li><a href="#">How to Optimize Your Resume for ATS</a></li>
                <li><a href="#">How to Write a Resume</a></li>
                <li><a href="#">Resume Formats</a></li>
                <li><a href="#">Resume Templates</a></li>
                <li><a href="#">Resume Examples</a></li>
              </ul>
              <h4>Cover Letter</h4>
              <ul>
                <li><a href="#">How to Write a Cover Letter</a></li>
                <li><a href="#">Cover Letter Formats</a></li>
                <li><a href="#">Cover Letter Templates</a></li>
                <li><a href="#">Cover Letter Examples</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>LinkedIn</h4>
              <ul>
                <li><a href="#">LinkedIn Profile Writing Guide</a></li>
                <li><a href="#">LinkedIn Headline Examples</a></li>
                <li><a href="#">LinkedIn Summary Examples</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Affiliates</a></li>
                <li><a href="#">Jobscan Widget</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Customer Support</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Companies Hiring List</a></li>
              </ul>
              {/* <img src="your-logo.png" alt="Logo" /> */}
              <p>© 2024 ResumeScorer</p>
            </div>
          </div>
          <div className="footer-social">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-x-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-tiktok"></i></a>
          </div>
        </section>









      </main>
    </>
  );
}

export default Homepage2;
