import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import templates from '../templates'; // Import templates

function EditTemplate() {
  const { id } = useParams(); // Get the template ID from the URL
  const template = templates.find((t) => t.id === parseInt(id)); // Find the template by ID

  const [content, setContent] = useState(template ? template.content : {}); // Set initial content

  // Update state when the template content changes
  useEffect(() => {
    if (template) {
      setContent(template.content);
    }
  }, [template]);

  const handleChange = (field, value) => {
    setContent((prevContent) => ({
      ...prevContent,
      [field]: value, // Update specific field in the content
    }));
  };

  const handleSave = () => {
    console.log('Template saved:', content); // Save logic
  };

  return (
    <div>
      <h1>Edit Template {template ? template.name : ''}</h1>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={content.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div>
        <label>Job Title:</label>
        <input
          type="text"
          value={content.jobTitle || ''}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
        />
      </div>
      <div>
        <label>Education:</label>
        <input
          type="text"
          value={content.education || ''}
          onChange={(e) => handleChange('education', e.target.value)}
        />
      </div>
      <div>
        <label>Experience:</label>
        <input
          type="text"
          value={content.experience || ''}
          onChange={(e) => handleChange('experience', e.target.value)}
        />
      </div>
      <div>
        <label>Skills:</label>
        <input
          type="text"
          value={content.skills || ''}
          onChange={(e) => handleChange('skills', e.target.value)}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default EditTemplate;
