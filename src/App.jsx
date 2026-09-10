import LabMatcher from './components/LabMatcher';
import api from './api/client';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChatbotPreview from './components/ChatbotPreview';
import FeaturesGrid from './components/FeaturesGrid';
import LoginPrompt from './components/LoginPrompt';
import './App.css';
import CompliancePlanner from './components/CompliancePlanner';
import ChangeImpact from './components/ChangeImpact';
import Newsletter from './components/Newsletter';
import DocumentAuditor from './components/DocumentAuditor';
import ChatHistorySidebar from './components/ChatHistorySidebar';

function App() {
  const [loginPrompt, setLoginPrompt] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [addingAccount, setAddingAccount] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeFeatureId, setActiveFeatureId] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const requestLogin = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setLoginPrompt({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const dismissLoginPrompt = () => {
    setLoginPrompt((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const openLoginForm = () => {
    setLoginPrompt((prev) => ({
      ...prev,
      visible: false,
    }));

    setAuthMode('login');
    setShowLoginForm(true);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');

    const email = event.target.elements['login-email'].value;
    const password = event.target.elements['login-password'].value;

    try {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('access_token', response.data.access_token);

  setUserEmail(email);
  setShowLoginForm(false);
  setIsLoggedIn(true);
} catch (error) {
  setLoginError('Incorrect email or password.');
}
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoginError('');

    const email = event.target.elements['login-email'].value;
    const password = event.target.elements['login-password'].value;

    try {
      const response = await api.post('/auth/register', { email, password });
      localStorage.setItem('access_token', response.data.access_token);

      setShowLoginForm(false);
      setIsLoggedIn(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setLoginError('An account with this email already exists.');
      } else {
        setLoginError('Something went wrong. Please try again.');
      }
    }
  };

  const switchToSignup = () => {
    setAuthMode('signup');
    setLoginError('');
  };

  const switchToLogin = () => {
    setAuthMode('login');
    setLoginError('');
  };

  const openFeature = (featureId) => {
    setActiveFeatureId(featureId);
  };
  const closeFeature = () => {
    setActiveFeatureId(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setUserEmail('');
    setActiveFeatureId(null);
    setChatMessages([]);
  };
  const clearChatHistory = () => {
    setChatMessages([]);
  };
  return (
    <div
      className={`page ${isLoggedIn ? 'page--logged-in' : ''} ${
        isSidebarOpen ? '' : 'page--sidebar-closed'
      }`}
      
    >
      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <aside className="page__visual">
        {activeFeatureId === 'compliance-journey' ? (
          <div className="feature-view">
            <button className="feature-view__back" type="button" onClick={closeFeature}>
              ← Back to chat
            </button>
            <CompliancePlanner />
          </div>
        ) : activeFeatureId === 'lab-matcher' ? (
          <div className="feature-view">
            <button className="feature-view__back" type="button" onClick={closeFeature}>
              ← Back to chat
            </button>
            <LabMatcher />
          </div>
        ) : activeFeatureId === 'change-impact' ? (
          <div className="feature-view">
            <button className="feature-view__back" type="button" onClick={closeFeature}>
              ← Back to chat
            </button>
            <ChangeImpact />
          </div>
        ) : activeFeatureId === 'newsletter' ? (
          <div className="feature-view">
            <button className="feature-view__back" type="button" onClick={closeFeature}>
              ← Back to chat
            </button>
            <Newsletter />
          </div>
        ) : activeFeatureId === 'document-auditor' ? (
          <div className="feature-view">
            <button className="feature-view__back" type="button" onClick={closeFeature}>
              ← Back to chat
            </button>
            <DocumentAuditor />
          </div>
        ) : (
          <>
            <div className="landing-hero">
              <Hero />
            </div>

            <div className="landing-chat-row">
  {isLoggedIn && (
  <ChatHistorySidebar messages={chatMessages} onClear={clearChatHistory} />
)}  

  <div className="landing-chat">
    <div className="assistant-heading">
      <span className="assistant-heading__brand">BISync</span>
    </div>

    <ChatbotPreview
      onLockedClick={requestLogin}
      isLoggedIn={isLoggedIn}
      messages={chatMessages}
      setMessages={setChatMessages}
    />
  </div>
</div>
          </>
        )}
      </aside>

      {/* =================================================
          RIGHT SIDE
          THIS BECOMES THE SIDEBAR AFTER LOGIN
      ================================================= */}
      {isLoggedIn && (
        <button
          className="sidebar-toggle"
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? '›' : '‹'}
        </button>
      )}
      <main className="page__content">
        {/* Landing navbar */}
        <div className="landing-navbar">
          <Navbar
  onLogin={() => {
  setAddingAccount(false);
  setAuthMode('login');
  setShowLoginForm(true);
}}
onAddAccount={() => {
  setAddingAccount(true);
  setAuthMode('login');
  setShowLoginForm(true);
}}
  isLoggedIn={isLoggedIn}
  userEmail={userEmail}
  onLogout={handleLogout}
/>
        </div>

        {/* Landing intro */}
        <section className="intro landing-intro">
          <h1 className="intro__heading">
            Find the standard that applies to you.
          </h1>

          <p className="intro__body">
            A conversational guide to Indian Standards and BIS certification —
            grounded in official sources, built for the people who need to
            act on them.
          </p>
        </section>
        <div className="landing-features">
          <FeaturesGrid
            isLoggedIn={isLoggedIn}
            onLockedClick={requestLogin}
            onFeatureClick={openFeature}
          />
        </div>
      </main>

      {/* =================================================
          LOGIN PROMPT
      ================================================= */}

      {loginPrompt.visible && !isLoggedIn && (
        <LoginPrompt
          x={loginPrompt.x}
          y={loginPrompt.y}
          onDismiss={dismissLoginPrompt}
          onLogin={openLoginForm}
        />
      )}

      {/* =================================================
          LOGIN / SIGNUP MODAL
      ================================================= */}

      {showLoginForm && (
        <div
          className="login-modal-overlay"
          onClick={() => setShowLoginForm(false)}
        >
          <div
            className="login-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="login-modal__close"
              type="button"
              onClick={() => setShowLoginForm(false)}
              aria-label="Close login"
            >
              ×
            </button>

            <p className="login-modal__eyebrow">BISync</p>

            <h2 className="login-modal__heading">
  {authMode === 'login'
    ? addingAccount
      ? 'Add another account.'
      : 'Welcome back.'
    : 'Create your account.'}
</h2>

            <p className="login-modal__body">
              {authMode === 'login'
                ? 'Log in to continue exploring Indian Standards and BIS services.'
                : 'Sign up to start exploring Indian Standards and BIS services.'}
            </p>

            <form
              className="login-modal__form"
              onSubmit={authMode === 'login' ? handleLogin : handleSignup}
            >
              {loginError && (
                <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {loginError}
                </p>
              )}

              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                required
              />

              <label htmlFor="login-password">Password</label>
              <div className="login-password-field">
  <input
    id="login-password"
    type={showPassword ? 'text' : 'password'}
    placeholder="Enter your password"
    required
  />

  <button
    type="button"
    className="login-password-toggle"
    onClick={() => setShowPassword((prev) => !prev)}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
    <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.8 4.2 10 7-0.4 1-1.2 2.1-2.3 3.1" />
    <path d="M6.1 6.1C4.3 7.3 2.9 9.3 2 12c1.2 2.8 4.8 7 10 7 1.2 0 2.4-.2 3.4-.6" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
)}
  </button>
</div>

              <button type="submit" className="login-modal__submit">
                {authMode === 'login' ? 'Log in' : 'Sign up'}
              </button>
            </form>

           {!addingAccount && (
  <p className="login-modal__switch">
    {authMode === 'login' ? (
      <>
        Don&apos;t have an account?{' '}
        <button
          type="button"
          className="login-modal__switch-btn"
          onClick={switchToSignup}
        >
          Sign up
        </button>
      </>
    ) : (
      <>
        Already have an account?{' '}
        <button
          type="button"
          className="login-modal__switch-btn"
          onClick={switchToLogin}
        >
          Log in
        </button>
      </>
    )}
  </p>
)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;