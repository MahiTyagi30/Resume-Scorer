import React, { useState, useEffect } from "react";
import "./Reviews.css"; // Assuming your CSS is in a file named Reviews.css

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      text: "“I was having a hard time getting interviews, and every single one I submitted after using the tool received a response – either a screening or an invitation to interview.”",
      author: "Thelonious B.",
      source: "Sitejabber.com Review",
    },
    {
      text: "“This tool really helped me optimize my resume and land more interviews. It’s easy to use and very effective.”",
      author: "Jane D.",
      source: "Trustpilot.com Review",
    },
    {
      text: "“I never realized how many mistakes my resume had until I used this tool. Now I feel more confident applying to jobs!”",
      author: "John S.",
      source: "G2.com Review",
    },
  ];

  // Automatically change the review every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [reviews.length]);

  // Function to manually set the current review index
  const setCurrentSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="reviews-section">
      <h2>Reviews from Our Users</h2>
      <div className="review-container">
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`review ${index === currentIndex ? "active" : ""}`}
          >
            <blockquote>
              <p>{review.text}</p>
              <footer>
                <cite>{review.author}</cite>
                <span className="review-source">{review.source}</span>
              </footer>
            </blockquote>
          </div>
        ))}

        {/* Review carousel navigation */}
        <div className="review-navigation">
          {reviews.map((_, index) => (
            <span
              key={index}
              className={`nav-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
