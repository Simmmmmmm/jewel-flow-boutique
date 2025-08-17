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
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4 py-8">
      <article className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-luxury border border-border p-8 w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
          </div>
          <h1 className="text-foreground text-3xl font-serif font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Artlery account</p>
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
              placeholder="Enter your password"
            />
          </div>
          
          <Button type="submit" className="w-full h-12 btn-luxury text-base font-medium" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In to Artlery'}
          </Button>
        </form>
        
        <footer className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Create one now
            </Link>
          </p>
        </footer>
      </article>
    </div>
  );
};

export default Login;
