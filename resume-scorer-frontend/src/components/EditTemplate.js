import React, { useState } from 'react';

function EditTemplate({ templateId }) {
  const [content, setContent] = useState(''); // Resume content will be here

  const handleSave = () => {
    // Logic for saving the edited template, possibly to a backend or for download
    console.log('Template saved:', content);
  };

  return (
    <div>
      <h1>Edit Template {templateId}</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="10"
        cols="50"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default EditTemplate;
