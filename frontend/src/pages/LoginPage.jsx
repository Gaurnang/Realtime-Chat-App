import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-2">Welcome Back</h2>
          <p className="text-center text-base-content/60 mb-4">Sign in to your account</p>

          {error && (
            <div className="alert alert-error text-sm mb-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-2">
              <Mail className="w-4 h-4 opacity-50" />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <Lock className="w-4 h-4 opacity-50" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="grow"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn btn-ghost btn-xs">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </label>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : 'Log In'}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="link link-primary">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
