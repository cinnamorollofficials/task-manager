import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Harap isi semua field yang wajib.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    const result = await registerUser(name, email, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-m3-background p-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-m3-primaryContainer opacity-20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-m3-tertiaryContainer opacity-25 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glassmorphism rounded-4xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-m3-primary tracking-tight font-display mb-2">Buat Akun</h2>
          <p className="text-m3-onSurfaceVariant text-sm">Silakan daftarkan akun baru Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-m3-onError text-m3-error rounded-3xl text-sm border border-m3-error/20 flex items-center gap-2 animate-pulse">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-8 animate-bounce">
            <CheckCircle2 className="mx-auto h-16 w-16 text-m3-tertiary mb-4" />
            <h3 className="text-xl font-bold text-m3-onSurface mb-2">Registrasi Berhasil!</h3>
            <p className="text-m3-onSurfaceVariant text-sm">Mengalihkan Anda ke halaman login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-m3-onSurfaceVariant tracking-wider uppercase pl-2">Nama Lengkap</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-m3-onSurfaceVariant">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-m3-surfaceVariant/30 text-m3-onSurface rounded-3xl border border-m3-outline/20 focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary transition-all duration-300"
                />
              </div>
            </div>

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
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-m3-surfaceVariant/30 text-m3-onSurface rounded-3xl border border-m3-outline/20 focus:border-m3-primary focus:outline-none focus:ring-1 focus:ring-m3-primary transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-m3-primary text-m3-onPrimary hover:bg-m3-primaryContainer hover:text-m3-onPrimaryContainer font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 m3-ripple shadow-lg disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        <div className="text-center mt-8">
          <p className="text-m3-onSurfaceVariant text-sm">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-m3-tertiary hover:underline font-semibold font-display">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
