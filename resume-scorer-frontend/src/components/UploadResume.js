import React, { useState } from 'react';
import axios from 'axios';

function UploadResume() {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axios.post('http://localhost:5000/upload', formData);
      window.location.href = '/results';
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h1>Upload Your Resume</h1>
      <input type="file" onChange={onFileChange} />
      <button onClick={onUpload}>Upload</button>
    </div>
  );
}

export default UploadResume;
