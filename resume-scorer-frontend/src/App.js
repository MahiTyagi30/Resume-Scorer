import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadResume from './components/UploadResume';
import ScorePage from './components/ScorePage';
import Homepage2 from './components/Homepage2';
import ResumeTemplates from './components/ResumeTemplates';
import EditTemplate from './components/EditTemplate'; // Import EditTemplate component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage2 />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/score" element={<ScorePage />} />
          <Route path="/templates" element={<ResumeTemplates />} />
          <Route path="/edit-template/:id" element={<EditTemplate />} /> {/* Route for editing */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
