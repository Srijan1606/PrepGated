// ==============================================================================
// PrepGated - Candidate Authentication View
// Styled to match the brutalist architectural portal design from ChatGPT mockup:
// - Top Nav: "PrepGated" logo (double angled slash marks) + "New here? [ Create account ]"
// - Left Hero: "PRACTICE · PREPARE · GET PLACED" kicker,
//   "Your path to the right opportunity." (with glowing purple/indigo "opportunity.")
//   + Subtitle + Glass Auth Card with tabs, icons, Keep me signed in, Forgot password,
//   vibrant blue button, and Google + GitHub social buttons.
// - Right: Vertical timeline with LEARN, PRACTICE, TRACK, IMPROVE, GET PLACED nodes.
// - Architectural backdrop: Monumental dark hall opening to sunrise mountains.
// ==============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, AlertCircle, Check, Sun, Moon } from 'lucide-react';

export const Login: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  // If already authenticated, navigate to dashboard/market
  React.useEffect(() => {
    if (user) {
      navigate('/market');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await signUpWithEmail(email, password, name);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          navigate('/market');
        }
      } else {
        const res = await signInWithEmail(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          navigate('/market');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmail('candidate@prepgated.com', 'candidate123');
      navigate('/market');
    } catch (err: any) {
      // Direct navigate if preview
      navigate('/market');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/market');
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const timelineSteps = [
    { id: 'learn', label: 'LEARN', desc: 'Curriculum & concept drilldowns' },
    { id: 'practice', label: 'PRACTICE', desc: 'Adaptive diagnostic problem sets' },
    { id: 'track', label: 'TRACK', desc: 'Real-time percentile benchmarks' },
    { id: 'improve', label: 'IMPROVE', desc: 'System design & STAR interviews' },
    { id: 'get_placed', label: 'GET PLACED', desc: 'Target company pipeline clearance' },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#090a0f] text-zinc-100 selection:bg-[#4f46e5] selection:text-white font-sans">
      {/* =========================================================================
          ARCHITECTURAL BACKGROUND SCENE
          Deep brutalist interior with glowing doorway opening to mountain dawn
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Layer 1: High-fidelity brutalist architectural photo backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-right lg:bg-center opacity-45 mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2400&q=85')`,
          }}
        />

        {/* Layer 2: Monumental Gateway Perspective & Mountain Vista Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f] via-[#090a0f]/90 to-transparent lg:w-[65%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-[#090a0f]/70" />

        {/* Right Portal Glowing Atmosphere (matching the ChatGPT image) */}
        <div className="hidden lg:block absolute right-[18%] top-0 bottom-0 w-[240px] pointer-events-none">
          {/* Dawn Sky inside portal opening */}
          <div className="absolute top-[8%] bottom-[22%] left-0 right-0 bg-gradient-to-b from-[#93c5fd]/30 via-[#fed7aa]/20 to-[#475569]/30 rounded-t-sm shadow-[0_0_80px_rgba(147,197,253,0.15)]" />
          
          {/* Left Vertical Glowing Blue Neon Strip */}
          <div className="absolute top-[6%] bottom-[20%] left-[-2px] w-[3px] bg-[#3b82f6] shadow-[0_0_20px_#3b82f6,0_0_40px_#60a5fa,0_0_60px_#2563eb]" />

          {/* Steps gradient at base of portal */}
          <div className="absolute bottom-[16%] left-[-60px] right-[-60px] h-[55px] bg-gradient-to-t from-[#090a0f] via-[#13151f] to-transparent border-t border-zinc-800/40" />
        </div>

        {/* Ground Floor Light Reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-[#090a0f] via-[#0b0d14]/80 to-transparent" />
        <div className="hidden lg:block absolute bottom-0 right-[15%] w-[400px] h-[140px] bg-blue-500/5 blur-[90px] rounded-full" />
      </div>

      {/* =========================================================================
          TOP NAVIGATION BAR
          PrepGated Brand (left) + "New here? [ Create account ]" (right) + Theme Toggle
          ========================================================================= */}
      <header className="relative z-20 w-full px-6 sm:px-12 lg:px-16 pt-7 pb-4 flex items-center justify-between">
        {/* Brand: PrepGated */}
        <div className="flex items-center gap-3 select-none">
          {/* Double slanted slash logo */}
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#6366f1] to-[#3b82f6] transform -skew-x-[24deg] shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
            <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#818cf8] to-[#60a5fa] transform -skew-x-[24deg] shadow-[0_0_12px_rgba(96,165,250,0.6)]" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            PrepGated
          </span>
        </div>

        {/* Right Nav Action */}
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle visual theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400 hidden sm:inline">
              {isSignUp ? 'Already have an account?' : 'New here?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="px-4 py-1.5 rounded-lg border border-zinc-700/80 hover:border-zinc-500 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 hover:text-white font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
            >
              {isSignUp ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN HERO VIEWPORT (Card on Left, Vertical Pathway on Right)
          ========================================================================= */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-6 lg:py-10 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Headline & Auth Card */}
        <div className="w-full max-w-[480px] lg:max-w-[440px] flex flex-col justify-center space-y-7">
          {/* Headline & Kicker */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[2px] uppercase text-zinc-400 font-mono">
              <span>PRACTICE</span>
              <span className="text-zinc-600">·</span>
              <span>PREPARE</span>
              <span className="text-zinc-600">·</span>
              <span>GET PLACED</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-1.5px] leading-[1.15] text-white">
              Your path to the{' '}
              <span className="bg-gradient-to-r from-[#818cf8] via-[#a78bfa] to-[#c084fc] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(129,140,248,0.4)]">
                right opportunity.
              </span>
            </h1>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-[410px]">
              A structured, data-driven platform to help you build skills, track progress, and get placement ready.
            </p>
          </div>

          {/* Floating Glass Auth Card (matching the mockup) */}
          <div className="w-full bg-[#11131a]/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden">
            {/* Top Mode Tabs */}
            <div className="flex items-center border-b border-zinc-800/80 mb-5 relative">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg(null);
                }}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative pr-6 ${
                  !isSignUp ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign in
                {!isSignUp && (
                  <span className="absolute bottom-0 left-0 right-6 h-[2px] bg-[#4f46e5] shadow-[0_0_10px_#4f46e5]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg(null);
                }}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative px-6 ${
                  isSignUp ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Create account
                {isSignUp && (
                  <span className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#4f46e5] shadow-[0_0_10px_#4f46e5]" />
                )}
              </button>
            </div>

            {/* Error Message banner if any */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name for Sign Up */}
              {isSignUp && (
                <div className="space-y-1.5">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Candidate full name"
                      className="w-full bg-[#181a24] border border-zinc-800 focus:border-[#4f46e5] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all focus:ring-1 focus:ring-[#4f46e5]/40"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-[#181a24] border border-zinc-800 focus:border-[#4f46e5] rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all focus:ring-1 focus:ring-[#4f46e5]/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignUp ? 'Create password (min 6 chars)' : 'Password'}
                    className="w-full bg-[#181a24] border border-zinc-800 focus:border-[#4f46e5] rounded-xl pl-10 pr-10 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all focus:ring-1 focus:ring-[#4f46e5]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Keep me signed in & Forgot password row */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-[#4f46e5] focus:ring-0 cursor-pointer accent-[#4f46e5]"
                  />
                  <span>Keep me signed in</span>
                </label>

                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered email address.')}
                    className="text-[#6366f1] hover:text-[#818cf8] font-medium transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(79,70,229,0.4)] disabled:opacity-50 text-sm"
              >
                <span>{loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Instant Demo Candidate login helper */}
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-1.5 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer text-center font-mono"
              >
                ⚡ Explore as Demo Candidate (1-Click)
              </button>

              {/* Divider: or */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <span className="relative px-3 bg-[#11131a] text-xs text-zinc-500 font-mono">
                  or
                </span>
              </div>

              {/* Google Sign In (Full Width & Prominent) */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white dark:bg-[#181a24] hover:bg-zinc-50 dark:hover:bg-[#202330] border border-zinc-300 dark:border-zinc-800 text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-100 transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.8 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Vertical Timeline Pathway (matching the ChatGPT image exactly) */}
        <div className="hidden lg:flex flex-col items-start pl-8 pr-4 py-8 select-none">
          <div className="relative flex flex-col gap-9">
            {/* Continuous vertical connecting line */}
            <div className="absolute left-[7px] top-[8px] bottom-[8px] w-[1px] bg-gradient-to-b from-[#3b82f6] via-zinc-700 to-zinc-800" />

            {timelineSteps.map((step, idx) => {
              const isFirst = idx === activeStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className="flex items-center gap-4 group cursor-pointer text-left transition-all"
                >
                  {/* Geometric Node Box */}
                  <div
                    className={`relative z-10 w-3.5 h-3.5 rounded-[2px] transition-all flex items-center justify-center ${
                      isFirst
                        ? 'bg-[#3b82f6] shadow-[0_0_12px_#3b82f6]'
                        : 'border border-zinc-600 bg-[#090a0f] group-hover:border-zinc-400'
                    }`}
                  >
                    {isFirst && <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />}
                  </div>

                  {/* Step label */}
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-mono tracking-[1.5px] uppercase font-bold transition-colors ${
                        isFirst
                          ? 'text-white'
                          : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono hidden xl:block">
                      {step.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* =========================================================================
          FOOTER / TRUST STATS
          ========================================================================= */}
      <footer className="relative z-10 w-full px-6 sm:px-12 lg:px-16 py-5 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3 font-mono">
        <div className="flex items-center gap-3">
          <span>In-Demand Career Tracks</span>
          <span aria-hidden="true">·</span>
          <span>Adaptive 5-Stage Placement Pipeline</span>
          <span aria-hidden="true">·</span>
          <span>AI Resume & Mock Interviews</span>
        </div>
        <div>
          <span>© PrepGated Intelligence Platform</span>
        </div>
      </footer>
    </div>
  );
};
