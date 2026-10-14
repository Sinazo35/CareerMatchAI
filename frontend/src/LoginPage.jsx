import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BriefcaseBusiness, CheckCircle2, FileText, FileUser, MoonStar, SunMedium } from 'lucide-react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:8001').replace(/\/$/, '');

export default function LoginPage({ onDemo, onAuthenticated }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('cm_theme') || 'light';
    } catch {
      return 'light';
    }
  });
  const [notice, setNotice] = useState('');
  const [mode, setMode] = useState('signin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === 'register';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('cm_theme', theme);
    } catch {}
  }, [theme]);

  const handleSubmit = async event => {
    event.preventDefault();
    if (isRegister && password !== confirmPassword) {
      setNotice('Your passwords do not match.');
      return;
    }
    setNotice('');
    setSubmitting(true);
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch(`${API}/api/auth/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.get('email'),
          password,
          ...(isRegister ? { name: form.get('name') } : {})
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Unable to authenticate. Please try again.');
      onAuthenticated(data.user);
    } catch (error) {
      setNotice(error instanceof TypeError
        ? 'Unable to reach the account service. Check that the backend is running.'
        : error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isRegister ? 'signin' : 'register');
    setPassword('');
    setConfirmPassword('');
    setNotice('');
  };

  return (
    <main className="login-page">
      <section className="login-showcase" aria-label="CareerMatch introduction">
        <div className="login-brand">
          <span className="login-mark"><FileUser size={22} strokeWidth={2.2} /></span>
          <span>CareerMatch <b>AI</b></span>
        </div>
        <div className="login-story">
          <p className="login-kicker">A clearer path to your next role</p>
          <h1>Make your experience move you forward.</h1>
          <p className="login-description">Bring your CV and a job description together. Find your strengths, spot skill gaps, and plan what comes next.</p>
          <div className="login-preview" aria-hidden="true">
            <div className="preview-topline"><span><FileText size={17} /> CV MATCH REPORT</span><span className="preview-status"><CheckCircle2 size={15} /> READY</span></div>
            <div className="preview-role"><span className="preview-role-icon"><BriefcaseBusiness size={19} /></span><div><b>Junior Data Analyst</b><small>Role fit overview</small></div></div>
            <div className="preview-score"><strong>82%</strong><span>Skills aligned</span><div className="preview-meter"><i /></div></div>
            <div className="preview-skills"><i>SQL</i><i>Excel</i><i>Power BI</i></div>
          </div>
        </div>
        <p className="login-showcase-foot">Your next move starts with a clearer picture.</p>
      </section>

      <section className="login-panel">
        <button className="login-theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle dark mode">
          {theme === 'dark' ? <SunMedium size={17} /> : <MoonStar size={17} />}
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
        <div className="login-form-wrap">
          {isRegister && (
            <button className="login-back" type="button" onClick={() => setMode('signin')}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
          <p className="login-eyebrow">{isRegister ? 'GET STARTED' : 'WELCOME BACK'}</p>
          <h2>{isRegister ? 'Create your account' : 'Sign in to CareerMatch'}</h2>
          <p className="login-subtitle">{isRegister ? 'Set up your profile to start planning your next move.' : 'Use your account to continue to your career workspace.'}</p>
          <form className="login-form" onSubmit={handleSubmit} key={mode}>
            {isRegister && <>
              <label htmlFor="register-name">Full name</label>
              <input id="register-name" name="name" type="text" autoComplete="name" placeholder="Your name" required />
            </>}
            <label htmlFor={isRegister ? 'register-email' : 'login-email'}>Email address</label>
            <input id={isRegister ? 'register-email' : 'login-email'} name="email" type="email" autoComplete={isRegister ? 'email' : 'username'} placeholder="you@example.com" required />
            <label htmlFor={isRegister ? 'register-password' : 'login-password'}>Password</label>
            <input id={isRegister ? 'register-password' : 'login-password'} name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'} minLength={isRegister ? 8 : undefined} value={password} onChange={event => setPassword(event.target.value)} required />
            {isRegister && <>
              <label htmlFor="register-confirm-password">Confirm password</label>
              <input id="register-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required />
            </>}
            <button className="login-submit" type="submit" disabled={submitting}>{submitting ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'} {!submitting && <ArrowRight size={18} />}</button>
          </form>
          <p className="login-mode-toggle">{isRegister ? 'Already have an account?' : 'First time here?'} <button type="button" onClick={switchMode}>{isRegister ? 'Sign in' : 'Create an account'}</button></p>
          {notice && <p className="login-notice" role="status">{notice}</p>}
          <div className="login-divider"><span>OR</span></div>
          <button className="login-guest" type="button" onClick={onDemo}>Continue as guest <ArrowRight size={17} /></button>
          <p className="login-demo-note">This demo does not create or verify user accounts.</p>
        </div>
        <p className="login-footer">CareerMatch AI <span>·</span> MVP demo</p>
      </section>
    </main>
  );
}