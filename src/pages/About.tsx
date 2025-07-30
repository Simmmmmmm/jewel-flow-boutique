import React from 'react';
import { Award, Heart, Shield, Users } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Excellence',
      description: 'Every piece is crafted with love and attention to detail, ensuring exceptional quality and beauty.'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'We stand behind our craftsmanship with lifetime warranties and quality assurance on every item.'
    },
    {
      icon: Award,
      title: 'Master Craftsmanship',
      description: 'Our artisans bring decades of experience and traditional techniques to create timeless pieces.'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We provide personalized service and expert guidance.'
    }
  ];

  const team = [
    {
      name: 'Elena Rodriguez',
      role: 'Master Jeweler',
      experience: '25+ years',
      specialization: 'Diamond Setting'
    },
    {
      name: 'James Chen',
      role: 'Design Director',
      experience: '15+ years',
      specialization: 'Contemporary Design'
    },
    {
      name: 'Sarah Williams',
      role: 'Gemologist',
      experience: '20+ years',
      specialization: 'Precious Stones'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-luxury-white">
      {/* Hero Section */}
      <div className="bg-luxury-white shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-luxury-heading text-4xl md:text-6xl font-serif font-bold mb-6">
              Our Story
            </h1>
            <p className="text-luxury-body text-xl max-w-3xl mx-auto leading-relaxed">
              For over a decade, Luxe Jewelry has been creating extraordinary pieces that celebrate 
              life's most precious moments. Founded on principles of excellence, integrity, and 
              timeless beauty.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-luxury-heading text-3xl md:text-4xl font-serif font-bold mb-6">
              A Legacy of Excellence
            </h2>
            <div className="space-y-4 text-luxury-body leading-relaxed">
              <p>
                Founded in 2013 by master jeweler Elena Rodriguez, Luxe Jewelry began as a small 
                workshop with a simple mission: to create jewelry that tells your unique story. 
                What started as a passion project has grown into a renowned atelier known for 
                exceptional craftsmanship and personalized service.
              </p>
              <p>
                Each piece in our collection is meticulously handcrafted using traditional 
                techniques passed down through generations, combined with contemporary design 
                sensibilities. We source only the finest materials, from conflict-free diamonds 
                to ethically sourced precious metals.
              </p>
              <p>
                Today, our team of skilled artisans continues to push the boundaries of jewelry 
                making while honoring the timeless traditions that make each piece truly special. 
                Every creation is not just jewelry – it's a work of art meant to be treasured 
                for generations.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl shadow-luxury flex items-center justify-center">
              <div className="text-center text-gold-700">
                <div className="w-32 h-32 mx-auto mb-4 bg-gold-300 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-serif font-bold">LJ</span>
                </div>
                <p className="text-lg font-medium">Atelier Workshop</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-luxury-heading text-3xl md:text-4xl font-serif font-bold mb-4">
              Our Values
            </h2>
            <p className="text-luxury-body text-lg max-w-2xl mx-auto">
              The principles that guide everything we do and every piece we create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={value.title}
                  className="text-center bg-luxury-white rounded-xl shadow-elegant p-6 hover:shadow-luxury transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gold-100 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-gold-600" />
                  </div>
                  <h3 className="text-luxury-heading text-lg font-serif font-semibold mb-3">
                    {value.title}
                  </h3>
                  <p className="text-luxury-body leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-luxury-heading text-3xl md:text-4xl font-serif font-bold mb-4">
              Meet Our Artisans
            </h2>
            <p className="text-luxury-body text-lg max-w-2xl mx-auto">
              The talented individuals who bring our vision to life through their exceptional skills and dedication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="text-center bg-luxury-white rounded-xl shadow-elegant p-8 hover:shadow-luxury transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-serif font-bold text-luxury-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-luxury-heading text-xl font-serif font-bold mb-1">
                  {member.name}
                </h3>
                <p className="text-gold-600 font-medium mb-2">{member.role}</p>
                <p className="text-luxury-body text-sm mb-2">{member.experience} experience</p>
                <p className="text-luxury-body text-sm font-medium">
                  Specializes in {member.specialization}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment Section */}
        <div className="bg-gradient-to-r from-gold-600 to-gold-700 rounded-2xl shadow-luxury p-8 lg:p-12 text-center">
          <h2 className="text-luxury-white text-3xl md:text-4xl font-serif font-bold mb-6">
            Our Commitment to You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-luxury-white">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-sm">Satisfaction Guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Lifetime</div>
              <div className="text-sm">Warranty Coverage</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Ethical</div>
              <div className="text-sm">Sourcing Promise</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;