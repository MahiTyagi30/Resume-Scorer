import React from 'react';
import { Link } from 'react-router-dom';
import templates from '../templates'; // Import templates


function ResumeTemplates() {
  return (
    <div>
      <h1>Resume Templates</h1>
      <div className="template-list">
        {templates.map((template) => (
          <div key={template.id} className="template-item">
            <h3>{template.name}</h3>
            {/* Link to edit template by id */}
            <Link to={`/edit-template/${template.id}`}>Select and Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeTemplates;
