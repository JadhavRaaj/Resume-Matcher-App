import React, { useState, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { useSpring, animated } from '@react-spring/web';

// Icons as inline SVGs
const BotIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 21.28c-2.31 0-4.52-.36-6.62-1.07a2 2 0 0 1-1.35-2.52c.2-.5.5-.94.88-1.31s.8-.69 1.31-.88a2 2 0 0 1 2.52-1.35c.71 2.1 1.07 4.31 1.07 6.62z"/><path d="M12 21.28c2.31 0 4.52-.36 6.62-1.07a2 2 0 0 0 1.35-2.52c-.2-.5-.5-.94-.88-1.31s-.8-.69-1.31-.88a2 2 0 0 0-2.52-1.35c-.71 2.1-1.07 4.31-1.07 6.62z"/><path d="M12 21.28c0-2.31-.36-4.52-1.07-6.62a2 2 0 0 0-2.52-1.35c-.5.2-.94.5-1.31.88s-.69.8-1.31 1.31a2 2 0 0 0-1.35 2.52c2.1.71 4.31 1.07 6.62 1.07z"/><path d="M12 21.28c0-2.31-.36-4.52-1.07-6.62a2 2 0 0 1-2.52-1.35c-.5.2-.94.5-1.31.88s-.69.8-1.31 1.31a2 2 0 0 1-1.35 2.52c2.1.71 4.31 1.07 6.62 1.07z"/></svg>);
const FileTextIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>);
const UploadCloudIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4 4-4-4"/></svg>);
const UserPlusIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>);
const LogInIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>);
const GithubIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22s-4 1-6 2c-.22 0-.35-.11-.47-.23-.12-.12-.15-.22-.15-.22a8.67 8.67 0 0 0 0-.25c.02-.1-.08-.18-.17-.18s-.24.08-.3.08h-.07a1.65 1.65 0 0 1-1.39-1.33c-.09-.56-.16-1.13-.23-1.7-.1-.9-.12-1.7-.12-2.31 0-1.42 1.05-2.73 2.5-3.05-.17-.4-.25-.86-.25-1.3 0-.58.11-1.15.34-1.7a.89.89 0 1 1 1.76-.3.26.26 0 0 0 .15-.28c.17-1.02.7-2.06 1.3-3.1.6-1.04 1.3-2.08 2-3.13.7-1.05 1.5-2.1 2.5-2.7a5.57 5.57 0 0 1 3.25-1.15c.67.1 1.3.36 1.83.74.53.38.97.87 1.3 1.48.33.61.54 1.28.6 2.01.06.73.08 1.48.06 2.22-.03 1.15-.1 2.3-.23 3.44-.13 1.14-.31 2.27-.55 3.4-.24 1.13-.56 2.25-.96 3.37-.4 1.12-.87 2.24-1.43 3.33-.56 1.09-1.2 2.15-1.93 3.19-.73 1.04-1.55 2.05-2.5 3.03-1.05-.02-2.1-.03-3.14-.04zm0 0l.02.01c.08-.03.17-.06.25-.1zm0 0l-.02-.01c-.08.03-.17.06-.25.1z"/><path d="M12 21.28c-2.31 0-4.52-.36-6.62-1.07a2 2 0 0 1-1.35-2.52c.2-.5.5-.94.88-1.31s.8-.69 1.31-.88a2 2 0 0 1 2.52-1.35c.71 2.1 1.07 4.31 1.07 6.62z"/><path d="M12 21.28c2.31 0 4.52-.36 6.62-1.07a2 2 0 0 0 1.35-2.52c-.2-.5-.5-.94-.88-1.31s-.8-.69-1.31-.88a2 2 0 0 0-2.52-1.35c-.71 2.1-1.07 4.31-1.07 6.62z"/><path d="M12 21.28c0-2.31-.36-4.52-1.07-6.62a2 2 0 0 0-2.52-1.35c-.5.2-.94.5-1.31.88s-.69.8-1.31 1.31a2 2 0 0 0-1.35 2.52c2.1.71 4.31 1.07 6.62 1.07z"/><path d="M12 21.28c0-2.31-.36-4.52-1.07-6.62a2 2 0 0 1-2.52-1.35c-.5.2-.94.5-1.31.88s-.69.8-1.31 1.31a2 2 0 0 1-1.35 2.52c2.1.71 4.31 1.07 6.62 1.07z"/></svg>);
const LinkedinIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>);
const MailIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>);
const BriefcaseIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><line x1="12" y1="12" x2="12" y2="12"/></svg>);
const SettingsIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.19a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.26.43a2 2 0 0 0 .73 2.73l.08.15a2 2 0 0 1 0 2l-.08.15a2 2 0 0 0-.73 2.73l.43.25a2 2 0 0 1 1 1.73v.19a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.19a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.26-.43a2 2 0 0 0-.73-2.73l-.08-.15a2 2 0 0 1 0-2l.08-.15a2 2 0 0 0 .73-2.73l-.43-.25a2 2 0 0 1-1-1.73v-.19a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>);
const SunIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>);
const MoonIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>);
const BackArrowIcon = ({ size = 24, className = '' }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>);

// Main App component
const App = () => {
  const [theme, setTheme] = useState('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState('RM');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const resumeContentRef = useRef(null);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleRegister = () => {
    console.log('Register clicked!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked!');
  };

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

  const handleMatch = async () => {
    setMatchScore(null);
    setError(null);
    setLoading(true);

    const apiUrl = 'https://resume-matcher-api-qy31.onrender.com/api/match';
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

  const handleOptimize = async () => {
    setLlmFeedback(null);
    setError(null);
    setLlmLoading(true);

    const apiUrl = 'https://resume-matcher-api-qy31.onrender.com/api/optimize';
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

      if (result && result.optimized_resume && Array.isArray(result.skill_gaps) && Array.isArray(result.growth_paths)) {
        setLlmFeedback(result);
      } else {
        throw new Error('Received an unexpected response from the AI. The results may not be in the correct format.');
      }

    } catch (err) {
      console.error('LLM API call failed:', err);
      setError('Failed to get an optimized resume. Please try again later.');
    } finally {
      setLlmLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!resumeContentRef.current) {
      console.error('Resume content element not found.');
      return;
    }
    const input = resumeContentRef.current;
    window.html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Optimized_Resume.pdf');
    });
  };

  const isButtonDisabled = loading || !jobDescription || !resumeFile;
  const showResults = matchScore !== null;
  const showDetailedButtons = showResults && currentPage === 'optimizeResume';

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
                angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                grid: { color: 'rgba(255, 255, 255, 0.2)' },
                pointLabels: { color: '#e5e7eb', font: { size: 14 } },
                ticks: { backdropColor: 'transparent', color: '#9ca3af', showLabelBackdrop: false }
              }
            },
            plugins: {
              legend: {
                labels: { color: '#e5e7eb' }
              }
            }
          }
        });
      }
    }, [data, theme]);
    return <canvas ref={canvasRef} />;
  };

  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 60 }
  });

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <animated.div style={springProps} className="content-container">
            <section className="hero-section">
              <h1 className="hero-title">
                Find Your Perfect Job Match
              </h1>
              <p className="hero-subtitle">
                Our AI-powered platform helps you tailor your resume to specific job descriptions,
                increasing your chances of landing that dream role.
              </p>
            </section>
            <div className="feature-grid">
              <FeatureCard
                title="Create Resume"
                description="Generate a professional resume from scratch with AI assistance."
                icon={<BotIcon size={48} className="feature-icon-1" />}
                onClick={() => setCurrentPage('createResume')}
              />
              <FeatureCard
                title="Optimize Resume"
                description="Import your existing resume to analyze and improve it."
                icon={<UploadCloudIcon size={48} className="feature-icon-2" />}
                onClick={() => setCurrentPage('optimizeResume')}
              />
              <FeatureCard
                title="Match Jobs"
                description="Find the perfect job for you by analyzing your resume."
                icon={<BriefcaseIcon size={48} className="feature-icon-3" />}
                onClick={() => {}}
              />
            </div>
          </animated.div>
        );
      case 'optimizeResume':
        return (
          <animated.div style={springProps} className="content-container">
            <h2 className="page-title">Optimize Your Resume</h2>
            <div className="form-container">
              <div className="form-grid">
                <div className="form-card">
                  <label className="form-label">Job Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-card">
                  <label className="form-label">Upload Resume (PDF)</label>
                  <div className="file-input-container">
                    <div className="file-input-content">
                      <UploadCloudIcon size={32} className="file-input-icon" />
                      <p className="file-input-text">Drag & Drop your file or <span className="file-input-browse">Browse</span></p>
                      {resumeFile && (
                        <p className="file-selected-text">File Selected: <span className="file-name">{resumeFile.name}</span></p>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      className="file-input-field"
                      onChange={handleFileChange}
                    />
                  </div>
                  {error && <p className="error-message">{error}</p>}
                </div>
              </div>
              <button
                onClick={handleMatch}
                disabled={isButtonDisabled}
                className={`main-button ${isButtonDisabled ? 'button-disabled' : ''}`}
              >
                {loading ? (
                  <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Get Match Score'
                )}
              </button>
              {showResults && (
                <div className="results-card">
                  <h3 className="results-title">{getMatchScoreTitle()}</h3>
                  <div
                    className={`score-circle ${matchScore >= 80 ? 'pulse' : ''}`}
                    style={{ background: getScoreColor() }}
                  >
                    {matchScore}%
                  </div>
                  <p className="results-message">{getMatchScoreMessage()}</p>
                  <div className="results-buttons">
                    <button
                      onClick={() => setCurrentPage('detailedResults')}
                      className="secondary-button"
                    >
                      See Detailed Results
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('optimizedResume');
                        handleOptimize();
                      }}
                      className="tertiary-button"
                    >
                      Optimize Your Resume
                    </button>
                  </div>
                </div>
              )}
            </div>
          </animated.div>
        );
      case 'detailedResults':
        return (
          <animated.div style={springProps} className="content-container">
            <h2 className="page-title">Detailed Analysis</h2>
            <div className="analysis-container">
              <button onClick={() => setCurrentPage('optimizeResume')} className="back-button">
                <BackArrowIcon size={20} />
                <span>Back</span>
              </button>
              <div className="text-analysis-grid">
                <div className="text-card">
                  <h3 className="card-title">Job Description</h3>
                  <p className="text-content">{highlightKeywords(jobDescription)}</p>
                </div>
                <div className="text-card">
                  <h3 className="card-title">Resume Content</h3>
                  <p className="text-content">{highlightKeywords(resumeText)}</p>
                </div>
              </div>
              <div className="chart-card">
                <h3 className="chart-title">Skill Match Visualization</h3>
                <div className="chart-container">
                  {Object.keys(chartData).length > 0 && <RadarChart data={chartData} />}
                </div>
              </div>
            </div>
          </animated.div>
        );
      case 'optimizedResume':
        return (
          <animated.div style={springProps} className="content-container">
            <h2 className="page-title">Optimized Resume</h2>
            <div className="analysis-container">
              <div className="button-row">
                <button onClick={() => setCurrentPage('optimizeResume')} className="back-button">
                  <BackArrowIcon size={20} />
                  <span>Back</span>
                </button>
                {llmFeedback && (
                  <button onClick={handleDownloadPdf} className="download-button">
                    Download PDF
                  </button>
                )}
              </div>
              {llmLoading ? (
                <div className="loading-card">
                  <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="loading-text">Generating personalized feedback...</p>
                </div>
              ) : llmFeedback ? (
                <div ref={resumeContentRef} className="llm-feedback-card">
                  <div className="feedback-section">
                    <h3 className="feedback-title">Optimized Resume</h3>
                    <p className="feedback-text">{llmFeedback.optimized_resume}</p>
                  </div>
                  <div className="feedback-section">
                    <h3 className="feedback-title">Skill Gaps</h3>
                    <ul className="feedback-list">
                      {llmFeedback.skill_gaps.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="feedback-section">
                    <h3 className="feedback-title">Growth Paths</h3>
                    <ul className="feedback-list">
                      {llmFeedback.growth_paths.map((path, index) => (
                        <li key={index}>{path}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="placeholder-card">
                  <p>Please click "Optimize Your Resume" to get AI feedback.</p>
                </div>
              )}
            </div>
          </animated.div>
        );
      default:
        return (
          <animated.div style={springProps} className="content-container">
            <h2 className="coming-soon-title">Coming Soon!</h2>
            <p className="coming-soon-text">This feature is under development. Please check back later!</p>
            <button
              onClick={() => setCurrentPage('home')}
              className="main-button"
            >
              Back to Home
            </button>
          </animated.div>
        );
    }
  };

  const FeatureCard = ({ title, description, icon, onClick }) => {
    return (
      <div onClick={onClick} className="feature-card">
        <div className="feature-icon-container">
          {icon}
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
      </div>
    );
  };

  const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-copyright">
          © 2025 ResumeMatcher. All rights reserved.
        </div>
        <div className="footer-social-links">
          <a href="#" className="social-link">
            <GithubIcon size={20} />
          </a>
          <a href="#" className="social-link">
            <LinkedinIcon size={20} />
          </a>
          <a href="#" className="social-link">
            <MailIcon size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;800;900&display=swap');
          
          :root {
            --slate-900: #0f172a;
            --slate-800: #1e293b;
            --slate-700: #334155;
            --slate-600: #475569;
            --slate-400: #94a3b8;
            --white: #fff;
            --indigo-600: #4f46e5;
            --indigo-500: #6366f1;
            --indigo-400: #818cf8;
            --purple-400: #c084fc;
            --pink-400: #f472b6;
            --green-600: #10b981;
            --green-500: #059669;
            --red-400: #f87171;
            --blue-400: #60a5fa;
            --blue-500: #3b82f6;
            --danger: #f43f5e;
          }

          .dark {
            background-color: var(--slate-900);
            color: var(--white);
          }

          .light {
            background-color: #f1f5f9;
            color: #1e293b;
          }

          .app-container {
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
            background-color: rgba(30, 41, 59, 0.9);
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
            border-bottom: 1px solid var(--slate-700);
          }

          .nav-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 1rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .brand {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.05em;
            color: var(--indigo-400);
            cursor: pointer;
          }

          .desktop-nav {
            display: none;
            align-items: center;
            gap: 1.5rem;
          }

          .mobile-nav-toggle {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          @media (min-width: 768px) {
            .desktop-nav { display: flex; }
            .mobile-nav-toggle { display: none; }
          }

          .nav-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: background-color 0.3s ease;
            color: var(--white);
          }

          .nav-button:hover { background-color: var(--slate-700); }

          .profile-circle {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.875rem;
            background-color: var(--indigo-500);
            color: var(--white);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease;
            cursor: pointer;
          }

          .profile-circle:hover {
            transform: scale(1.1);
          }

          .mobile-menu {
            display: none;
            background-color: rgba(30, 41, 59, 0.95);
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
          }

          .mobile-menu.show {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem;
            gap: 1rem;
          }

          .main-content {
            flex: 1;
            margin-top: 5rem;
            padding: 1.5rem 2.5rem;
          }

          .content-container {
            display: flex;
            flex-direction: column;
            gap: 4rem;
            padding: 4rem 0;
            width: 100%;
            max-width: 100%;
          }

          /* Centering wrapper for all page content blocks */
          .hero-section,
          .analysis-container {
            width: 100%;
            max-width: 72rem;
            margin-left: auto;
            margin-right: auto;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .hero-section { text-align: center; }

          .form-container, .analysis-container { display: flex; flex-direction: column; gap: 2rem; }

          .hero-title {
            font-size: 2.25rem;
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: -0.05em;
            background: linear-gradient(to right, var(--indigo-400), var(--purple-400), var(--pink-400));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @media (min-width: 640px) {
            .hero-title { font-size: 3.75rem; }
          }

          .hero-subtitle {
            font-size: 1.125rem;
            font-weight: 300;
            color: var(--slate-400);
          }

          .feature-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            width: 100%;
            max-width: 100%;
            padding: 0 1rem;
          }

          @media (min-width: 768px) {
            .feature-grid { grid-template-columns: repeat(2, 1fr); }
          }

          @media (min-width: 1024px) {
            .feature-grid { grid-template-columns: repeat(3, 1fr); }
          }

          .feature-card {
            background-color: var(--slate-800);
            border-radius: 1.5rem;
            padding: 2rem;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
            border: 1px solid var(--slate-700);
            transition: all 0.3s ease;
            transform: translateY(0);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1rem;
            cursor: pointer;
          }

          .feature-card:hover {
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2), 0 15px 15px rgba(0, 0, 0, 0.06);
            border-color: var(--indigo-500);
            transform: translateY(-8px);
          }

          .feature-icon-container {
            padding: 1rem;
            border-radius: 9999px;
            background-color: var(--slate-700);
          }
          
          .feature-icon-1 { color: var(--indigo-400); }
          .feature-icon-2 { color: var(--purple-400); }
          .feature-icon-3 { color: var(--pink-400); }

          .feature-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--white);
            margin-top: 1rem;
          }

          .feature-description {
            color: var(--slate-400);
          }

          .page-title {
            font-size: 1.875rem;
            font-weight: 700;
            text-align: center;
            color: var(--white);
          }

/* Center the children of the form container (the grid and button) */
.form-container {
  align-items: center;
}

/* Base styles for all screen sizes (mobile-first approach) */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 90%; /* Responsive percentage width */
  max-width: 90rem;
  padding: 0 1rem;
}

.form-card {
  background-color: var(--slate-800);
  border-radius: 0.75rem;
  padding: 2.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--slate-700);
  width: 100%; /* Responsive width */
  max-width: 30rem;
  box-sizing: border-box;
}

/* Media query for laptops and larger screens (min-width: 1024px) */
@media (min-width: 1024px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr); /* Two columns for laptops */
    gap: 2rem;
    width: 90rem; /* Your original fixed width */
    padding: 0 1rem;
  }

  .form-card {
    width: 30rem; /* Your original fixed width */
  }
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--slate-400);
}

.form-textarea {
  width: 100%;
  padding: 0rem;
  margin-top: 0.5rem;
  height: 20rem;
  background-color: var(--slate-700);
  color: var(--white);
  border-radius: 0.5rem;
  border: 2px solid var(--slate-600);
  transition: border-color 0.2s ease;
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--indigo-400);
}

.file-input-container {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border: 2px dashed var(--slate-600);
  border-radius: 0.5rem;
  color: var(--slate-400);
  position: relative;
  cursor: pointer;
  overflow: hidden;
  height: 20rem;
}

.file-input-content {
  text-align: center;
}

.file-input-icon {
  margin: 0 auto;
}

.file-input-text {
  margin-top: 0.5rem;
}

.file-input-browse {
  color: var(--indigo-400);
  cursor: pointer;
}

.file-selected-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--white);
}

.file-name {
  font-weight: 500;
}

.file-input-field {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.error-message {
  margin-top: 0.5rem;
  color: var(--red-400);
  font-size: 0.875rem;
  text-align: center;
}

.main-button {
  width: 100%;
  max-width: 30rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  background-color: var(--indigo-600);
  color: var(--white);
  border: none;
  cursor: pointer;
}

.main-button:hover {
  background-color: var(--indigo-500);
  transform: scale(1.05);
}

.button-disabled {
  background-color: var(--slate-600);
  color: var(--slate-400);
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  height: 1.5rem;
  width: 1.5rem;
  margin: 0 auto;
  color: var(--white);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

          .results-card {
            margin-top: 2rem;
            background-color: var(--slate-800);
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--slate-700);
            text-align: center;
            gap: 1rem;
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          .results-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--white);
          }

          .score-circle {
            margin: 0 auto;
            width: 8rem;
            height: 8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--white);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
          }

          .score-circle.pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .results-message {
            color: var(--slate-400);
          }

          .results-buttons {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
          }

          @media (min-width: 640px) {
            .results-buttons { flex-direction: row; }
          }
          
          .secondary-button {
            padding: 0.5rem 1.5rem;
            border-radius: 0.5rem;
            border: 1px solid var(--indigo-400);
            color: var(--indigo-400);
            font-weight: 500;
            transition: all 0.2s ease;
            background: none;
            cursor: pointer;
          }
          
          .secondary-button:hover { background-color: var(--slate-900); }

          .tertiary-button {
            padding: 0.5rem 1.5rem;
            border-radius: 0.5rem;
            border: 1px solid var(--purple-400);
            color: var(--purple-400);
            font-weight: 500;
            transition: all 0.2s ease;
            background: none;
            cursor: pointer;
          }
          
          .tertiary-button:hover { background-color: var(--slate-900); }

          .back-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--slate-400);
            transition: color 0.2s ease;
            align-self: flex-start; /* Prevents stretching and aligns left */
            cursor: pointer;
          }

          .back-button:hover { color: var(--white); }

          .text-analysis-grid {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
            gap: 1.5rem;
          }

          @media (min-width: 768px) {
            .text-analysis-grid { grid-template-columns: repeat(2, 1fr); }
          }
          
          .text-card {
            background-color: var(--slate-800);
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--slate-700);
          }

          .card-title {
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--white);
            margin-bottom: 0.5rem;
          }

          .text-content {
            color: var(--slate-300);
            font-size: 0.875rem;
            line-height: 1.625;
          }

          .chart-card {
            background-color: var(--slate-800);
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--slate-700);
            width: 100%;
          }

          .chart-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--white);
            text-align: center;
            margin-bottom: 1rem;
          }

          .chart-container {
            width: 100%;
            max-width: 28rem;
            margin: 0 auto;
          }

          .download-button {
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            background-color: var(--green-600);
            color: var(--white);
            font-weight: 500;
            transition: background-color 0.2s ease;
            border: none;
            cursor: pointer;
          }
          
          .download-button:hover { background-color: var(--green-500); }

          .button-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 56rem;
            margin: 0 auto;
          }
          
          .loading-card, .placeholder-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2.5rem;
            background-color: var(--slate-800);
            border-radius: 0.75rem;
            border: 1px solid var(--slate-700);
            text-align: center;
            max-width: 56rem;
            margin: 0 auto;
          }

          .loading-text {
            margin-top: 1rem;
            color: var(--slate-400);
          }

          .llm-feedback-card {
            background-color: var(--slate-800);
            border-radius: 0.75rem;
            padding: 2rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--slate-700);
            color: var(--white);
            gap: 1.5rem;
            display: flex;
            flex-direction: column;
            white-space: pre-wrap;
            max-width: 56rem;
            margin: 0 auto;
          }

          .feedback-section {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .feedback-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--white);
          }

          .feedback-text {
            color: var(--slate-300);
            line-height: 1.625;
          }
          
          .feedback-list {
            list-style-type: disc;
            list-style-position: inside;
            gap: 0.25rem;
            display: flex;
            flex-direction: column;
            color: var(--slate-300);
          }

          .coming-soon-title {
            font-size: 1.875rem;
            font-weight: 700;
            text-align: center;
            color: var(--white);
          }

          .coming-soon-text {
            font-size: 1.125rem;
            text-align: center;
            color: var(--slate-400);
          }

          .footer-container {
            background-color: rgba(30, 41, 59, 0.9);
            backdrop-filter: blur(8px);
            border-top: 1px solid var(--slate-700);
            width: 100%;
          }

          .footer-content {
            max-width: 1280px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            text-align: center;
          }

          @media (min-width: 640px) {
            .footer-content {
              flex-direction: row;
              gap: 0;
              text-align: left;
            }
          }

          .footer-copyright {
            color: var(--slate-400);
            font-size: 0.875rem;
          }

          .footer-social-links {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .social-link {
            color: var(--slate-400);
            transition: all 0.3s ease;
            transform: scale(1);
          }

          .social-link:hover {
            color: var(--white);
            transform: scale(1.25);
          }
          
          .highlight-keyword {
            background-color: rgba(129, 140, 248, 0.3);
            color: var(--indigo-400);
            padding: 2px 4px;
            border-radius: 4px;
            font-weight: 600;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: .5;
            }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <script src="https://unpkg.com/html2canvas@1.0.0-rc.5/dist/html2canvas.js"></script>
      <script src="https://unpkg.com/jspdf@1.5.3/dist/jspdf.min.js"></script>

      <div className="app-container">
        <header className="header">
          <nav className="nav-container">
            <div className="flex-row">
              <span className="brand" onClick={() => setCurrentPage('home')}>
                ResumeMatcher
              </span>
            </div>
            <div className="desktop-nav">
              {isLoggedIn ? (
                <>
                  <button onClick={handleLogout} className="nav-button">
                    <LogInIcon size={18} />
                    <span className="font-medium">Logout</span>
                  </button>
                  <div className="relative-group" onClick={handleEditProfile}>
                    <div className="profile-circle">
                      {userInitials}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={handleRegister} className="nav-button">
                    <UserPlusIcon size={18} />
                    <span className="font-medium">Register</span>
                  </button>
                  <button onClick={handleLogin} className="nav-button">
                    <LogInIcon size={18} />
                    <span className="font-medium">Login</span>
                  </button>
                </>
              )}
              <button onClick={handleThemeToggle} className="nav-button">
                {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              </button>
            </div>
            <div className="mobile-nav-toggle">
              <button onClick={handleThemeToggle} className="nav-button">
                {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              </button>
              <button onClick={toggleMenu} className="nav-button">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
            </div>
          </nav>
          <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`}>
            {isLoggedIn ? (
              <>
                <button onClick={handleLogout} className="nav-button-full">
                  <LogInIcon size={18} />
                  <span>Logout</span>
                </button>
                <button onClick={handleEditProfile} className="nav-button-full">
                  <SettingsIcon size={18} />
                  <span>Edit Profile</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={handleRegister} className="nav-button-full">
                  <UserPlusIcon size={18} />
                  <span>Register</span>
                </button>
                <button onClick={handleLogin} className="nav-button-full">
                  <LogInIcon size={18} />
                  <span>Login</span>
                </button>
              </>
            )}
          </div>
        </header>
        <main className="main-content">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
