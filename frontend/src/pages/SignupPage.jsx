import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react'

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signup(formData);
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
          <h2 className="card-title text-2xl font-bold justify-center mb-2">Create Account</h2>
          <p className="text-center text-base-content/60 mb-4">Get started with your free account</p>
          
          {error && (
            <div className="alert alert-error text-sm mb-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="input input-bordered flex items-center gap-2">
              <User className="w-4 h-4 opacity-50" />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </label>

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
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn btn-ghost btn-xs">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </label>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;