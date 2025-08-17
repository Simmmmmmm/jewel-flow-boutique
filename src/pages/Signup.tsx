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
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4 py-8">
      <article className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-luxury border border-border p-8 w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-foreground text-3xl font-serif font-bold mb-2">Join Artlery</h1>
          <p className="text-muted-foreground">Create your premium jewelry account</p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="h-12 bg-background/50 border-border focus:border-primary transition-colors" 
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="h-12 bg-background/50 border-border focus:border-primary transition-colors" 
              placeholder="Create a password"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Confirm Password</label>
            <Input 
              type="password" 
              value={confirm} 
              onChange={(e) => setConfirm(e.target.value)} 
              required 
              className="h-12 bg-background/50 border-border focus:border-primary transition-colors" 
              placeholder="Confirm your password"
            />
          </div>
          
          <Button type="submit" className="w-full h-12 btn-luxury text-base font-medium" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Artlery Account'}
          </Button>
        </form>
        
        <footer className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </footer>
      </article>
    </div>
  );
};

export default Signup;
