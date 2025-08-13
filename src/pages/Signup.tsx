import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Signup: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Sign Up | Artlery';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return alert('Passwords do not match');
    setLoading(true);
    try {
      await signUp(email, password);
      navigate('/');
    } catch {
      // toasts handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-luxury-white flex items-center justify-center px-4">
      <article className="bg-luxury-white rounded-xl shadow-elegant p-8 w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-luxury-heading text-3xl font-serif font-bold">Create Account</h1>
          <p className="text-luxury-body mt-2">Join Artlery for a premium experience</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-luxury-body">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-luxury-body">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <label className="text-sm text-luxury-body">Confirm Password</label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full btn-luxury" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </Button>
        </form>
        <footer className="mt-4 text-center text-sm text-luxury-body">
          Already have an account? <Link to="/login" className="text-gold-700 story-link">Log in</Link>
        </footer>
      </article>
    </div>
  );
};

export default Signup;
