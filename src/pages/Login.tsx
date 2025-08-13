import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Login | Artlery';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch {
      // handled in context toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-luxury-white flex items-center justify-center px-4">
      <article className="bg-luxury-white rounded-xl shadow-elegant p-8 w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-luxury-heading text-3xl font-serif font-bold">Login</h1>
          <p className="text-luxury-body mt-2">Welcome back to Artlery</p>
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
          <Button type="submit" className="w-full btn-luxury" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <footer className="mt-4 text-center text-sm text-luxury-body">
          New here? <Link to="/signup" className="text-gold-700 story-link">Create an account</Link>
        </footer>
      </article>
    </div>
  );
};

export default Login;
