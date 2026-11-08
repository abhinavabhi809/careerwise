import { useState } from "react";
import "./App.css";

function App() {

  const [resume, setResume] = useState(null);

  const [resumeText, setResumeText] = useState("");

  const [skills, setSkills] = useState([]);

  const [careerRecommendations, setCareerRecommendations] =
    useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const compatibleCareers = careerRecommendations.filter(
  (career) => career.match_score > 0
);
const bestCareer = compatibleCareers[0];

  const [loading, setLoading] = useState(false);


  // ==========================================
  // Analyze Resume
  // ==========================================

  const analyzeResume = async (file) => {

    setLoading(true);

    setResumeText("");

    setSkills([]);

    setCareerRecommendations([]);


    const formData = new FormData();

    formData.append("file", file);


    try {

      const response = await fetch(
        "https://careerwise-x5sb.onrender.com/upload-resume",
        {
          method: "POST",
          body: formData,
        }
      );


      const data = await response.json();


      if (data.error) {

        alert(data.error);

        return;

      }


      setResumeText(data.text);

      setSkills(data.skills);

      setCareerRecommendations(
        data.career_recommendations
      );


    } catch (error) {

      console.error(error);

      alert(
        "Could not connect to the CareerWise backend."
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // File Selection
  // ==========================================

  const handleFileChange = (event) => {

    const file = event.target.files[0];

    if (!file) return;


    setResume(file);

    analyzeResume(file);

  };


  return (

<div className={`app ${isDarkMode ? "dark-mode" : ""}`}>

      {/* ======================================
          Navigation
      ====================================== */}

      <nav className="navbar">

        <div className="logo">
          CareerWise
        </div>


        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#about">
            About
          </a>

        </div>


        <a
          href="#upload"
          className="nav-button"
        >
          Get Started
        </a>
<button
  className="theme-toggle"
  onClick={() => setIsDarkMode(!isDarkMode)}
>
  {isDarkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>
      </nav>



      {/* ======================================
          Hero Section
      ====================================== */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">


          <p className="hero-label">
            AI-POWERED CAREER GUIDANCE
          </p>


          <h1>
            Find the career
            <br />
            that fits you.
          </h1>
          <h2>All Career Matches</h2>

<p className="career-description">
  Careers are ranked from highest to lowest based on the skills found in your resume.
</p>


          <p className="hero-description">

            CareerWise analyzes your resume,
            identifies your skills, and recommends
            career paths that match your potential.

          </p>


          {/* Upload */}

          <div
            className="upload-area"
            id="upload"
          >

            <label className="primary-button">

              Analyze My Resume →

              <input
                type="file"
                accept=".pdf,.docx"
                style={{
                  display: "none"
                }}
                onChange={handleFileChange}
              />

            </label>


            <p className="file-hint">
              PDF or DOCX files only
            </p>


            {resume && (

              <p className="resume-name">

                Selected resume:

                <strong>
                  {" "}{resume.name}
                </strong>

              </p>

            )}


            {loading && (

              <p className="loading">
                Analyzing your resume...
              </p>

            )}

          </div>

        </div>



        <div className="match-card">
          <div className="card-header">
            <span>{bestCareer ? "Your Best Career Match" : "Career Match"}</span>
            <span className="card-dot">●</span>
          </div>

          {bestCareer ? (
            <>
              <h2>{bestCareer.career}</h2>
              <p>The strongest match based on the skills found in your resume.</p>

              <div className="match-score">
                <strong>{bestCareer.match_score}%</strong>
                <span>Match</span>
              </div>

              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${bestCareer.match_score}%` }}
                ></div>
              </div>

              <div className="card-footer">
                <span>Matched skills</span>
                <span>
                  {bestCareer.matched_skills.length > 0
                    ? bestCareer.matched_skills.join(" · ")
                    : "No matching skills found"}
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Software Developer</h2>
              <p>
                Your skills match this career
                particularly well.
              </p>

              <div className="match-score">
                <strong>87%</strong>
                <span>Match</span>
              </div>

              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: "87%" }}
                ></div>
              </div>

              <div className="card-footer">
                <span>Skills</span>
                <span>Python · React · SQL</span>
              </div>
            </>
          )}
        </div>

      </section>



      {/* ======================================
          Resume Analysis
      ====================================== */}

      {resumeText && (

        <section className="resume-section">

          <div className="resume-result">


            <h2>
              Resume Analysis
            </h2>


            <p className="result-description">

              CareerWise successfully extracted
              and analyzed your resume.

            </p>


            {/* Extracted Text */}

            <h3>
              Extracted Resume Text
            </h3>


            <div className="resume-text-box">

              <pre>
                {resumeText}
              </pre>

            </div>



            {/* ==================================
                Detected Skills
            ================================== */}

            {skills.length > 0 && (

              <div className="skills-result">

                <h2>
                  Detected Skills
                </h2>


                <p>

                  CareerWise found{" "}

                  <strong>
                    {skills.length}
                  </strong>

                  {" "}skills in your resume.

                </p>


                <div className="skills-list">

                  {skills.map((skill) => (

                    <span
                      className="skill-tag"
                      key={skill}
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>

            )}



            {skills.length === 0 && (

              <div className="no-skills">

                No recognized skills were
                found in this resume.

              </div>

            )}



            {/* ==================================
                Career Recommendations
            ================================== */}

            {compatibleCareers.length > 0 && (

              <div className="career-results">


                <h2>
                  Career Recommendations
                </h2>


                <p className="career-description">

                  Based on the skills detected
                  in your resume, these career
                  paths are the best matches.

                </p>


                <div className="career-list">


                  {compatibleCareers.map(
                    (career) => (

                      <div
                        className="career-card"
                        key={career.career}
                      >


                        {/* Header */}

                        <div className="career-card-header">


                          <div>

                            <h3>
                              {career.career}
                            </h3>


                            <p>

                              {career.match_score}%
                              {" "}skill match

                            </p>

                          </div>


                          <div className="career-score">

                            {career.match_score}%

                          </div>

                        </div>



                        {/* Progress */}

                        <div className="career-progress">

                          <div
                            className="career-progress-bar"
                            style={{
                              width:
                                `${career.match_score}%`
                            }}
                          ></div>

                        </div>



                        {/* Skills */}

                        <div className="career-skills">


                          {/* Matched */}

                          <div>

                            <h4>
                              Matched Skills
                            </h4>


                            <div className="career-tags">


                              {career.matched_skills.length >
                              0 ? (

                                career.matched_skills.map(
                                  (skill) => (

                                    <span
                                      className="matched-tag"
                                      key={skill}
                                    >

                                      ✓ {skill}

                                    </span>

                                  )
                                )

                              ) : (

                                <span className="empty-skill">

                                  No matching skills

                                </span>

                              )}

                            </div>

                          </div>



                          {/* Missing */}

                          <div>

                            <h4>
                              Skills to Improve
                            </h4>


                            <div className="career-tags">


                              {career.missing_skills.length >
                              0 ? (

                                career.missing_skills.map(
                                  (skill) => (

                                    <span
                                      className="missing-tag"
                                      key={skill}
                                    >

                                      + {skill}

                                    </span>

                                  )
                                )

                              ) : (

                                <span className="complete-skill">

                                  All required skills
                                  matched!

                                </span>

                              )}

                            </div>

                          </div>


                        </div>


                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </div>

        </section>

      )}



      {/* ======================================
          How It Works
      ====================================== */}

      <section
        className="how-it-works"
        id="how-it-works"
      >

        <div className="section-heading">

          <p className="section-label">
            HOW IT WORKS
          </p>


          <h2>

            Your career journey,
            <br />
            simplified.

          </h2>

        </div>


        <div className="feature-grid">


          <div className="feature-card">

            <div className="feature-number">
              01
            </div>


            <h3>
              Upload Resume
            </h3>


            <p>

              Upload your resume in PDF or DOCX
              format and let CareerWise process
              your information.

            </p>

          </div>



          <div className="feature-card">

            <div className="feature-number">
              02
            </div>


            <h3>
              Analyze Skills
            </h3>


            <p>

              Our system extracts your skills,
              education and experience from
              your resume.

            </p>

          </div>



          <div className="feature-card">

            <div className="feature-number">
              03
            </div>


            <h3>
              Discover Careers
            </h3>


            <p>

              CareerWise compares your profile
              with career requirements and finds
              suitable career paths.

            </p>

          </div>


        </div>

      </section>



      {/* ======================================
          About
      ====================================== */}

      <section
        className="about"
        id="about"
      >

        <p className="section-label">
          ABOUT CAREERWISE
        </p>


        <h2>
          Make better career decisions with AI.
        </h2>


        <p>

          CareerWise is an AI-based career
          recommendation system designed to
          help students and job seekers understand
          their skills and discover suitable
          career paths.

        </p>

      </section>



      {/* ======================================
          Footer
      ====================================== */}

      <footer>

        <strong>
          CareerWise
        </strong>


        <span>
          AI-Based Career Recommendation System
        </span>

      </footer>


    </div>

  );

}


export default App;