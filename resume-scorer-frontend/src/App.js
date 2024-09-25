import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadResume from './components/UploadResume';
import ScorePage from './components/ScorePage';
import Homepage2 from './components/Homepage2';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage2 />} /> {/* Homepage2 is rendered at the root */}
          <Route path="/upload" element={<UploadResume />} /> {/* UploadResume is now under /upload */}
          <Route path="/score" element={<ScorePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
