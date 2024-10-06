import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { jsPDF } from 'jspdf'; // Import jsPDF for generating PDF
import './ScorePage.css'; // Add your custom styles here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const ScorePage = () => {
  const location = useLocation(); // Get location object
  const { state } = location; // Extract state from location object
  const {
    score = 0,
    characterMatch = 0,
    matchDetails = [], // Default to empty array if no matchDetails
    suggestions = [] // Default to empty array if no suggestions
  } = state || {}; // Default values if state is undefined

  // Function to handle the download of the report as PDF
  const handleDownloadReport = () => {
    const doc = new jsPDF();

    // Add content to the PDF
    doc.setFontSize(22);
    doc.text('Resume Score Report', 10, 20);

    doc.setFontSize(16);
    doc.text(`Score: ${score}/100`, 10, 40);
    doc.text(`Character Match: ${characterMatch}%`, 10, 50);

    doc.text('Suggestions for Improvement:', 10, 70);
    suggestions.forEach((suggestion, index) => {
      doc.text(`${index + 1}. ${suggestion}`, 10, 80 + index * 10);
    });

    // Save the PDF
    doc.save('Resume_Score_Report.pdf');
  };

  // Function to handle sending email
  const handleSendEmail = () => {
    // Placeholder for email functionality
    alert('Email sent! (This is a placeholder. You need to implement actual email sending.)');
  };

  return (
    <div className="score-page">
      <div className="score-container">
        <h1 className="score-heading">Your Resume Score</h1>
        <div className="score-box">
          <h2 className="score">{score}/100</h2>
          <p className="score-description">
            Based on key criteria, your resume has been evaluated against best practices.
          </p>
        </div>

        <div className="match-container">
          <h2 className="match-heading">Character Match Breakdown</h2>
          <p className="match-description">
            We analyzed your resume for key sections, skills, and keywords that match your target job description.
          </p>

          {/* Character Match Progress */}
          <div className="progress-section">
            <div className="progress-bar">
              <span className="progress-text">Matched Characters: {characterMatch}%</span>
              <div className="progress" style={{ width: `${characterMatch}%` }}></div>
            </div>
          </div>

          {/* Matching Criteria Breakdown */}
          <div className="criteria-breakdown">
            {matchDetails.length > 0 ? (
              matchDetails.map((detail, index) => (
                <div key={index} className="criteria-item">
                  {detail.isMatch ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />
                  ) : (
                    <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
                  )}
                  <p>{detail.description}</p>
                </div>
              ))
            ) : (
              <p>No specific match details available.</p>
            )}
          </div>

          {/* Suggestions for Improvement */}
          <div className="suggestions-section">
            <h3>Suggestions for Improvement</h3>
            <ul className="suggestions-list">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))
              ) : (
                <p>No suggestions available.</p>
              )}
            </ul>
          </div>

          {/* Call-to-Action */}
          <div className="call-to-action">
            <p>Want personalized tips? Download the detailed report below!</p>
            <button className="download-btn" onClick={handleDownloadReport}>
              Download Report
            </button>
            <button className="send-email-btn" onClick={handleSendEmail}>
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorePage;
