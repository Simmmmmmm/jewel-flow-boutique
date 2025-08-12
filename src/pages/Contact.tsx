import React, { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us | Luxe Jewelry';

    // Inject simple JSON-LD for SEO
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Luxe Jewelry',
      url: window.location.origin,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@luxe-jewelry.example'
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      toast({ title: 'Message sent', description: 'Thanks for reaching out. We will get back to you shortly.' });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-luxury-white">
      <header className="bg-luxury-white shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-luxury-heading text-4xl md:text-5xl font-serif font-bold mb-3">Contact Us</h1>
          <p className="text-luxury-body max-w-2xl mx-auto">We'd love to hear from you. Send us a message and our team will respond within 24 hours.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-luxury-white rounded-xl shadow-elegant p-6 md:p-8">
          <h2 className="text-luxury-heading text-2xl font-serif font-semibold mb-6">Send a Message</h2>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-luxury-body">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <label className="text-sm text-luxury-body">Email</label>
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
          <div className="bg-luxury-white rounded-xl shadow-elegant p-6">
            <h3 className="text-luxury-heading text-xl font-serif font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3 text-luxury-body">
              <li className="flex items-start gap-3"><Mail className="w-5 h-5 text-gold-600 mt-0.5" /> support@luxe-jewelry.example</li>
              <li className="flex items-start gap-3"><Phone className="w-5 h-5 text-gold-600 mt-0.5" /> +1 (000) 000-0000</li>
              <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-gold-600 mt-0.5" /> 123 Luxury Ave, Suite 100, New York, NY</li>
            </ul>
          </div>
          <div className="bg-luxury-white rounded-xl shadow-elegant p-3 overflow-hidden">
            <div className="aspect-[4/3] w-full bg-gold-50 grid place-items-center text-luxury-body">Map placeholder</div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Contact;
