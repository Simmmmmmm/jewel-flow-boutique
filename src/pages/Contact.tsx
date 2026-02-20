import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, MapPin, Phone } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Contact: React.FC = () => {
  const { toast } = useToast();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/contact' } });
    } else {
      // Pre-populate form with user data
      setName(user.email.split('@')[0]); // Use email prefix as name
      setEmail(user.email);
    }
  }, [user, navigate]);

  useEffect(() => {
    document.title = 'Contact Us | Artlery';

    // Inject simple JSON-LD for SEO
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Artlery',
      url: window.location.origin,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'simmmmmm.03@gmail.com'
        }
      ]
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const isValid = useMemo(() => name && email && message, [name, email, message]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !token) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();

      // Clear form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      toast({
        title: 'Message sent',
        description: 'Thanks for reaching out. We will get back to you shortly.'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-luxury-heading text-4xl md:text-5xl font-serif font-bold mb-3">Contact Us</h1>
          <p className="text-luxury-body max-w-2xl mx-auto">We'd love to hear from you. Send us a message and our team will respond within 24 hours.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-card border border-border rounded-xl shadow-elegant p-6 md:p-8">
          <h2 className="text-luxury-heading text-2xl font-serif font-semibold mb-6">Send a Message</h2>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-luxury-body">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-luxury-body flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm text-luxury-body">Subject</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm text-luxury-body">Message</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} className="mt-1" />
            </div>
            <Button type="submit" className="btn-luxury px-8" disabled={!isValid || loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </section>

        <aside className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-elegant p-6">
            <h3 className="text-luxury-heading text-xl font-serif font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3 text-luxury-body">
              <li className="flex items-start gap-3"><Mail className="w-5 h-5 text-primary mt-0.5" /> simmmmmm.03@gmail.com</li>
              <li className="flex items-start gap-3"><Phone className="w-5 h-5 text-primary mt-0.5" /> 9137953753</li>
              <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5" /> BKC, Mumbai, India</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl shadow-elegant p-3 overflow-hidden">
            <div className="aspect-[4/3] w-full">
              <MapContainer center={[19.0619, 72.8567]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  
                />
                <Marker position={[19.0619, 72.8567]}>
                  <Popup>
                    BKC, Mumbai, India
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Contact;
