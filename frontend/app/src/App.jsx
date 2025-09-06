import React, { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

// Main App component
const App = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [matchScore, setMatchScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [llmLoading, setLlmLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [keywords, setKeywords] = useState([]);
  const [chartData, setChartData] = useState({});
  const [llmFeedback, setLlmFeedback] = useState(null);

  // Reference for the element to be converted to PDF
  const resumeContentRef = useRef(null);

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError(null);
    } else {
      setResumeFile(null);
      setError('Please upload a valid PDF file.');
    }
  };

  // Function to handle the matching process
  const handleMatch = async () => {
    setMatchScore(null);
    setError(null);
    setLoading(true);

    const apiUrl = 'http://localhost:5000/api/match';
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('resume', resumeFile);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setMatchScore(result.score);
      setResumeText(result.resumeText);
      setKeywords(result.keywords);
      setChartData(result.chartData);
    } catch (err) {
      console.error('API call failed:', err);
      setError('Failed to get a match score. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the LLM optimization process
  const handleOptimize = async () => {
    setLlmFeedback(null);
    setError(null);
    setLlmLoading(true);

    const apiUrl = 'http://localhost:5000/api/optimize';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: jobDescription,
          resumeText: resumeText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Check if the response has the expected structure
      if (result && result.optimized_resume && Array.isArray(result.skill_gaps) && Array.isArray(result.growth_paths)) {
        setLlmFeedback(result);
      } else {
        // Handle unexpected response structure
        throw new Error('Received an unexpected response from the AI. The results may not be in the correct format.');
      }

    } catch (err) {
      console.error('LLM API call failed:', err);
      setError('Failed to get an optimized resume. Please try again later.');
    } finally {
      setLlmLoading(false);
    }
  };

  // Function to handle PDF download
  const handleDownloadPdf = () => {
    if (!resumeContentRef.current) {
      console.error('Resume content element not found.');
      return;
    }

    const input = resumeContentRef.current;

    // Use html2canvas to convert the HTML content to a canvas image
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add the captured image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Save the PDF with a dynamic filename
      pdf.save('Optimized_Resume.pdf');
    });
  };

  const isButtonDisabled = loading || !jobDescription || !resumeFile;
  const showResults = matchScore !== null;
  const showDetailedButtons = showResults && currentPage === 'home';

  const getMatchScoreMessage = () => {
    if (matchScore >= 80) return 'This is a great match! Your skills are highly aligned with the job description.';
    if (matchScore >= 50) return 'This is a good match. There is room for improvement to better align your resume with the role.';
    return 'The skills do not seem to align very well. Consider tailoring your resume more specifically for this position.';
  };

  const getMatchScoreTitle = () => {
    if (matchScore >= 80) return 'Outstanding Match!';
    if (matchScore >= 50) return 'Good Match';
    return 'Weak Match';
  };

  const highlightKeywords = (text) => {
    if (!text || !keywords.length) return text;
    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="highlight-keyword">${keyword}</span>`);
    });
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const getScoreColor = () => {
    if (matchScore >= 80) return 'linear-gradient(to bottom right, #10b981, #0d9488)';
    if (matchScore >= 50) return 'linear-gradient(to bottom right, #60a5fa, #3b82f6)';
    return 'linear-gradient(to bottom right, #f43f5e, #e11d48)';
  };

  // Radar chart component
  const RadarChart = ({ data }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
      if (canvasRef.current && data && data.labels.length > 0) {
        const ctx = canvasRef.current.getContext('2d');
        if (window.myChart) {
          window.myChart.destroy();
        }
        window.myChart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: data.labels,
            datasets: [{
              label: 'Keyword Relevance Score',
              data: data.data,
              fill: true,
              backgroundColor: 'rgba(96, 165, 250, 0.2)',
              borderColor: '#60a5fa',
              pointBackgroundColor: '#60a5fa',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#60a5fa'
            }]
          },
          options: {
            elements: {
              line: {
                borderWidth: 3
              }
            },
            scales: {
              r: {
                angleLines: {
                  color: 'rgba(255, 255, 255, 0.2)'
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.2)'
                },
                pointLabels: {
                  color: '#e5e7eb',
                  font: {
                    size: 14
                  }
                },
                ticks: {
                  backdropColor: 'transparent',
                  color: '#9ca3af',
                  showLabelBackdrop: false
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: '#e5e7eb'
                }
              }
            }
          }
        });
      }
    }, [data]);
    return <canvas ref={canvasRef} />;
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <header className="header">
              <h1>Resume Matcher</h1>
              <p>Find your perfect career fit with AI-powered analysis.</p>
            </header>
            <main className="main-content">
              <div className="form-section">
                <label htmlFor="jobDescription" className="form-label">Job Description</label>
                <textarea
                  id="jobDescription"
                  className="textarea"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="form-section">
                <label htmlFor="resume" className="form-label">Upload Resume (PDF)</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf"
                    className="file-input"
                    onChange={handleFileChange}
                  />
                  <svg className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="upload-text">Drag & Drop your file or <span className="upload-browse-text">Browse</span></p>
                  {resumeFile && (
                    <div className="file-selected-info">
                      <p className="file-name">File Selected:</p>
                      <p className="file-type">{resumeFile.name}</p>
                    </div>
                  )}
                </div>
                {error && <p className="error-message">{error}</p>}
              </div>
            </main>
            <div className="action-button-container">
              <button
                onClick={handleMatch}
                disabled={isButtonDisabled}
                className={`action-button ${isButtonDisabled ? 'disabled' : 'enabled'}`}
              >
                {loading ? (
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Get Match Score'
                )}
              </button>
            </div>
            {showResults && (
              <div className="result-area fade-in-content">
                <h3 className="text-3xl font-bold text-gray-200 mb-4">{getMatchScoreTitle()}</h3>
                <div className={`score-circle ${matchScore >= 80 ? 'animate-pulse' : ''}`} style={{ backgroundImage: getScoreColor() }}>
                  {matchScore}%
                </div>
                <p className="feedback-text">{getMatchScoreMessage()}</p>
                {showDetailedButtons && (
                  <div className="flex flex-row gap-4 mt-8 justify-center">
                    <button
                      onClick={() => setCurrentPage('detailedResults')}
                      className="secondary-action-button"
                    >
                      See Detailed Results
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('optimizedResume');
                        handleOptimize();
                      }}
                      className="secondary-action-button"
                    >
                      Optimize Your Resume
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        );
      case 'detailedResults':
        return (
          <div className="detailed-results-container">
            <h2 className="detailed-results-heading">Detailed Analysis</h2>
            <div className="back-button-container">
              <button onClick={() => setCurrentPage('home')} className="back-button">
                ← Back
              </button>
            </div>
            <div className="content-cards-container">
              <div className="content-card">
                <h3 className="content-card-title">Job Description</h3>
                <div className="content-text">
                  {highlightKeywords(jobDescription)}
                </div>
              </div>
              <div className="content-card">
                <h3 className="content-card-title">Resume Content</h3>
                <div className="content-text">
                  {highlightKeywords(resumeText)}
                </div>
              </div>
            </div>
            <div className="mt-8 visualization-container">
              <h3 className="visualization-heading">Skill Match Visualization</h3>
              <div className="chart-container">
                {Object.keys(chartData).length > 0 && <RadarChart data={chartData} />}
              </div>
            </div>
          </div>
        );
      case 'optimizedResume':
        return (
          <div className="optimized-resume-container">
            <h2 className="optimized-resume-heading">Optimize Your Resume</h2>
            <div className="back-button-container flex justify-between items-center">
              <button onClick={() => setCurrentPage('home')} className="back-button">
                ← Back
              </button>
              {llmFeedback && (
                <button
                  onClick={handleDownloadPdf}
                  className="secondary-action-button"
                >
                  Download PDF
                </button>
              )}
            </div>

            {llmLoading ? (
              <div className="loading-container">
                <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="loading-text">Generating personalized feedback...</p>
              </div>
            ) : llmFeedback ? (
              <div ref={resumeContentRef} className="llm-feedback-container fade-in-content">
                <p className="optimized-resume-text">
                  This section provides an AI-generated optimized version of your resume, highlights skill gaps, and suggests growth paths.
                </p>
                <div className="feedback-section">
                  <h3 className="llm-feedback-title">Optimized Resume</h3>
                  <p className="llm-feedback-content">
                    {llmFeedback.optimized_resume}
                  </p>
                </div>
                <div className="feedback-section">
                  <h3 className="llm-feedback-title mt-6">Skill Gaps</h3>
                  <ul className="llm-feedback-list">
                    {llmFeedback.skill_gaps.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="feedback-section">
                  <h3 className="llm-feedback-title mt-6">Growth Paths</h3>
                  <ul className="llm-feedback-list">
                    {llmFeedback.growth_paths.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              error && (
                <div className="error-message-llm">
                  <p>{error}</p>
                </div>
              )
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Script tags for chart.js, html2canvas and jspdf */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <style>
        {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-content { animation: fadeIn 0.8s ease-out forwards; }

        .app-container {
          min-height: 100vh;
          min-width: 100vw;
          display: flex;
          align-items: center;
          background-image: linear-gradient(135deg, #1f2937 0%, #0f172a 100%);
          color: #fff;
          font-family: 'Inter', sans-serif;
          justify-content: center;
          padding: 1rem;
        }

        .card {
          background-color: #1f2937;
          border-radius: 1.5rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          width: 100%;
          max-width: 64rem;
          border: 1px solid #374151;
          transition: transform 0.3s ease-in-out;
          margin: auto;
          min-height: 80vh;
          display: flex;
          flex-direction: column;
        }

        .card:hover { transform: scale(1.01); }

        .header { text-align: center; margin-bottom: 2rem; }
        .header h1 { font-size: 3rem; font-weight: 800; color: #60a5fa; margin-bottom: 0.5rem; }
        .header p { font-size: 1.25rem; color: #9ca3af; }
        .main-content { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 2rem; }

        @media (min-width: 768px) { .main-content { flex-direction: row; } }

        .form-section { display: flex; flex-direction: column; flex: 1; }
        .form-label { font-size: 1.125rem; font-weight: 600; color: #e5e7eb; margin-bottom: 0.5rem; }
        .textarea { width: 100%; height: 20rem; padding: 1rem; background-color: #374151; color: #e5e7eb; border: 1px solid #4b5563; border-radius: 0.75rem; resize: none; transition: all 0.2s ease-in-out; }
        .textarea:focus { outline: none; box-shadow: 0 0 0 2px #3b82f6; }
        .file-upload-container { position: relative; border: 2px dashed #4b5563; border-radius: 0.75rem; padding: 1.5rem; height: 20rem; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.2s ease-in-out; }
        .file-upload-container:hover { background-color: #374151; }
        .file-input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        .upload-icon { width: 4rem; height: 4rem; color: #9ca3af; margin-bottom: 0.5rem; }
        .upload-text { margin-top: 0.5rem; color: #9ca3af; font-weight: 500; }
        .upload-browse-text { color: #60a5fa; font-weight: 700; }
        .file-selected-info { margin-top: 1rem; text-align: center; }
        .file-name { font-weight: 600; color: #e5e7eb; }
        .file-type { font-size: 0.875rem; color: #9ca3af; }
        .error-message { margin-top: 0.5rem; color: #fca5a5; font-size: 0.875rem; }
        .action-button-container { display: flex; justify-content: center; margin-bottom: 2rem; }

        .action-button {
          padding: 1rem 2.5rem;
          border-radius: 9999px;
          color: #fff;
          font-weight: 800;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease-in-out;
          border: none;
        }
        .action-button.enabled { background-color: #2563eb; }
        .action-button.enabled:hover { background-color: #1d4ed8; }
        .action-button.disabled { background-color: #4b5563; cursor: not-allowed; }

        .secondary-action-button {
          padding: 0.75rem 2rem;
          border-radius: 9999px;
          color: #e5e7eb;
          font-weight: 600;
          background-color: #374151;
          border: 1px solid #4b5563;
          transition: all 0.3s ease-in-out;
          cursor: pointer;
        }
        .secondary-action-button:hover { background-color: #4b5563; }

        .result-area { text-align: center; margin-top: 2rem; }
        .result-area h3 { font-size: 1.875rem; font-weight: 700; color: #e5e7eb; margin-bottom: 1rem; }
        .score-circle {
          font-size: 4.5rem;
          font-weight: 800;
          padding: 1.5rem;
          border-radius: 9999px;
          width: 10rem;
          height: 10rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: linear-gradient(to bottom right, #10b981, #0d9488);
          color: #fff;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          margin: auto;
        }
        .feedback-text { margin-top: 1.5rem; color: #9ca3af; font-size: 1.125rem; max-width: 28rem; margin-left: auto; margin-right: auto; }

        .detailed-results-container, .optimized-resume-container {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: fadeIn 0.8s ease-out forwards;
        }
        .back-button-container { margin-bottom: 1.5rem; }
        .back-button {
          background: none;
          border: none;
          color: #60a5fa;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .back-button:hover { text-decoration: underline; }
        .detailed-results-heading, .optimized-resume-heading {
          font-size: 2.25rem;
          font-weight: 700;
          color: #e5e7eb;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .content-cards-container { display: flex; flex-direction: column; gap: 2rem; }
        @media (min-width: 768px) { .content-cards-container { flex-direction: row; } }
        .content-card {
          background-color: #374151;
          border-radius: 1rem;
          padding: 1.5rem;
          flex: 1;
          border: 1px solid #4b5563;
          height: 30rem;
          overflow-y: auto;
        }
        .content-card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #e5e7eb;
          margin-bottom: 1rem;
          border-bottom: 2px solid #60a5fa;
          padding-bottom: 0.5rem;
        }
        .content-text {
          font-size: 1rem;
          color: #d1d5db;
          line-height: 1.6;
        }
        .highlight-keyword {
          background-color: #60a5fa;
          color: #1f2937;
          font-weight: bold;
          padding: 2px 4px;
          border-radius: 4px;
        }
        .visualization-container {
          background-color: #374151;
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid #4b5563;
        }
        .visualization-heading {
          font-size: 1.5rem;
          font-weight: 600;
          color: #e5e7eb;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .chart-container {
          max-width: 600px;
          max-height: 600px;
          margin: auto;
        }

        /* LLM feedback specific styles */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1rem;
          height: 30vh;
        }

        .loading-text {
          font-size: 1.25rem;
          color: #9ca3af;
        }

        .llm-feedback-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          background-color: #1f2937;
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid #374151;
        }

        .feedback-section {
          background-color: #374151;
          padding: 1.5rem;
          border-radius: 0.75rem;
          border: 1px solid #4b5563;
        }

        .llm-feedback-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #60a5fa;
          border-bottom: 2px solid #60a5fa;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }

        .llm-feedback-content {
          white-space: pre-wrap;
          font-size: 1rem;
          color: #d1d5db;
          line-height: 1.6;
        }

        .llm-feedback-list {
          list-style-type: disc;
          list-style-position: inside;
          font-size: 1rem;
          color: #d1d5db;
          line-height: 1.6;
          padding-left: 1rem;
        }

        .error-message-llm {
          text-align: center;
          color: #fca5a5;
          margin-top: 2rem;
        }
        `}
      </style>
      <div className="app-container">
        <div className="card">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default App;
