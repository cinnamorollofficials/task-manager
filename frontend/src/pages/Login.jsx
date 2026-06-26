import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if redirected due to expired token
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      setInfo('Sesi Anda telah berakhir. Silakan login kembali.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email || !password) {
      setError('Harap isi email dan password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-m3-background p-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-m3-primaryContainer opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-m3-tertiaryContainer opacity-25 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glassmorphism rounded-4xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-m3-primary tracking-tight font-display mb-2">Selamat Datang</h2>
          <p className="text-m3-onSurfaceVariant text-sm">Masuk ke Task Management System Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-m3-onError text-m3-error rounded-3xl text-sm border border-m3-error/20 flex items-center gap-2 animate-pulse">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {info && (
          <div className="mb-6 p-4 bg-m3-secondaryContainer text-m3-onSecondaryContainer rounded-3xl text-sm border border-m3-outline/10 flex items-center gap-2">
            <span>ℹ️</span>
            <span>{info}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-m3-onSurfaceVariant tracking-wider uppercase pl-2">Alamat Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-m3-onSurfaceVariant">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-m3-surfaceVariant/30 text-m3-onSurface rounded-3xl border border-m3-outline/20 focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary transition-all duration-300"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-m3-onSurfaceVariant tracking-wider uppercase pl-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-m3-onSurfaceVariant">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-m3-surfaceVariant/30 text-m3-onSurface rounded-3xl border border-m3-outline/20 focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-m3-onSurfaceVariant hover:text-m3-primary transition-colors"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-m3-primary text-m3-onPrimary hover:bg-m3-primaryContainer hover:text-m3-onPrimaryContainer font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 m3-ripple shadow-lg disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Masuk...' : 'Masuk Sekarang'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-m3-onSurfaceVariant text-sm">
            Belum punya akun?{' '}
            <Link to="/register" className="text-m3-tertiary hover:underline font-semibold font-display">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
