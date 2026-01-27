"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Music, ChevronRight, Radio, ArrowLeft, Twitter, Facebook } from 'lucide-react';

const RetroRetrofuturisticCRT = ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) => {
  return (
    <div className="relative group w-full max-w-4xl mx-auto p-2 md:p-4">
      {/* Outer Industrial Chassis */}
      <div className="relative bg-zinc-900 rounded-[1.5rem] md:rounded-[3rem] p-3 md:p-6 border-t-4 md:border-t-8 border-l-4 md:border-l-8 border-zinc-800 border-r-zinc-950 border-b-zinc-950 shadow-[20px_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Top Vent Detail */}
        <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 flex space-x-1 opacity-30">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-1 h-2 md:h-3 bg-black rounded-full" />
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-6 mt-2 md:mt-4">
          
          {/* Main Screen Housing */}
          <div className="relative flex-grow aspect-square bg-black rounded-[1rem] md:rounded-[2rem] border-[6px] md:border-[12px] border-zinc-800 shadow-[inset_0_0_40px_rgba(0,0,0,1)] overflow-hidden">
            
            {/* The "Glass" Tube Curvature Effect */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="relative w-full h-full z-0 transform scale-[1.02] brightness-[1.1] contrast-[1.2]">
                {children}
              </div>

              {/* CRT Overlay Layers */}
              <div className="pointer-events-none absolute inset-0 z-10">
                {/* Sharp Scanlines */}
                <div className="absolute inset-0 w-full h-full opacity-[0.25] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_3px]" />
                
                {/* RGB Phosphor Mask */}
                <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(90deg,rgba(255,0,0,0.5),rgba(0,255,0,0.5),rgba(0,0,255,0.5))] bg-[length:3px_100%]" />
                
                {/* Heavy Vignette for Depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_40%,rgba(0,0,0,0.9)_110%)]" />
                
                {/* Screen Flicker Effect */}
                <div className="absolute inset-0 bg-white/5 opacity-0 animate-[flicker_0.15s_infinite]" />
              </div>
            </div>
          </div>

          {/* Retrofuturistic Side Control Panel */}
          <div className="hidden md:flex flex-col w-24 justify-between py-4 border-l-2 border-zinc-800 pl-6">
            <div className="space-y-4">
              {/* Radial Knobs */}
              <div className="w-12 h-12 rounded-full bg-zinc-800 border-4 border-zinc-700 shadow-xl flex items-center justify-center cursor-pointer hover:rotate-45 transition-transform duration-500">
                <div className="w-1 h-4 bg-zinc-600 rounded-full transform rotate-45" />
              </div>
              <div className="w-12 h-12 rounded-full bg-zinc-800 border-4 border-zinc-700 shadow-xl flex items-center justify-center cursor-pointer hover:-rotate-12 transition-transform duration-500">
                <div className="w-1 h-4 bg-zinc-600 rounded-full transform -rotate-12" />
              </div>
            </div>

            {/* Status Lights */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[8px] text-zinc-500 font-mono uppercase">Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]" />
                <span className="text-[8px] text-zinc-500 font-mono uppercase">Load</span>
              </div>
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-6 flex justify-between items-end border-t border-[#D2B997]/30 pt-4">
          <div className="font-mono">
            <h3 className="text-[#A8D8EA] text-lg uppercase tracking-widest leading-none">{title}</h3>
            <p className="text-[#D2B997] text-[10px] uppercase font-bold tracking-[0.3em]">{subtitle}</p>
          </div>
          <div className="text-[10px] text-zinc-700 font-mono italic">
            MODULAR_DISPLAY_V0.12
          </div>
        </div>
      </div>

      {/* Industrial Support Feet */}
      <div className="flex justify-around px-12">
        <div className="w-16 h-4 bg-zinc-800 rounded-b-xl shadow-lg" />
        <div className="w-16 h-4 bg-zinc-800 rounded-b-xl shadow-lg" />
      </div>
    </div>
  );
};

const ArtistCard = ({ name, date, image, songs, socials, bio }: { name: string; date: string; image: string; songs: string[]; socials: { instagram?: string; youtube?: string }; bio: string }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-12 items-center mb-24 last:mb-0">
      <div className="w-full xl:w-2/3">
        <RetroRetrofuturisticCRT title={name} subtitle={date}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover brightness-100 contrast-[1.1]"
          />
        </RetroRetrofuturisticCRT>
      </div>
      
      <div className="w-full xl:w-1/3 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D2B997]/10 text-[#D2B997] text-xs font-mono rounded-full border border-[#D2B997]/30">
          <Radio size={12} className="animate-pulse" /> LIVE AT INQUIVETSA XII
        </div>
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">{name}</h2>
        <p className="text-[#B8A7D9] text-sm leading-relaxed border-l-2 border-[#D2B997]/30 pl-4 font-depixel-small">
          {bio}
        </p>
        
        <div className="space-y-3 bg-[#2A2A2A]/50 p-6 rounded-2xl border border-[#D2B997]/10">
          <p className="text-[10px] font-bold text-[#A8D8EA] uppercase tracking-[0.3em] font-depixel-small">Popular Picks</p>
          <ul className="space-y-3">
            {songs.map((song, i) => (
              <li key={i} className="flex items-center text-[#B8A7D9] text-sm group cursor-default font-depixel-small">
                <span className="mr-3 text-[#D2B997]/50 text-[10px]">0{i+1}</span>
                <span className="group-hover:text-[#A8D8EA] transition-colors">{song}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <div className="flex gap-4">
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2A2A2A] border border-[#D2B997]/20 text-[#B8A7D9] hover:text-[#D2B997] hover:border-[#D2B997]/50 transition-all">
                <Instagram size={18} />
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2A2A2A] border border-[#D2B997]/20 text-[#B8A7D9] hover:text-[#A8D8EA] hover:border-[#A8D8EA]/50 transition-all">
                <Youtube size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PronitePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-sans selection:bg-[#A8D8EA] selection:text-[#1A1A1A]">
      {/* Global Animations */}
      <style>{`
        @keyframes flicker {
          0% { opacity: 0.15; }
          5% { opacity: 0.25; }
          10% { opacity: 0.1; }
          15% { opacity: 0.4; }
          30% { opacity: 0.2; }
          100% { opacity: 0.15; }
        }
        .scanlines {
          background: linear-gradient(
            to bottom,
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.25) 50%
          );
          background-size: 100% 4px;
        }
        .retro-grid-floor {
          background-image: linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: perspective(1000px) rotateX(75deg);
          position: absolute;
          bottom: -20%;
          left: -50%;
          right: -50%;
          height: 100%;
          z-index: 0;
          mask-image: linear-gradient(to top, black, transparent);
        }
      `}</style>

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-depixel-small">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Image src="/ball_a.png" alt="INQUIVESTA XII" width={60} height={60} className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative pt-48 pb-24 px-8 overflow-hidden min-h-screen flex flex-col justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 blur-[2px]"
          style={{
            backgroundImage: 'url(/pronite/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/80 via-[#1A1A1A]/60 to-[#1A1A1A] z-0" />
        <div className="retro-grid-floor" />
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-[#e3b87c]" />
            <span className="text-[#e3b87c] font-mono text-xs uppercase tracking-[0.5em]">Live Transmission</span>
          </div>
          <h1 className="text-7xl md:text-[12rem] font-black italic uppercase leading-none tracking-tighter text-white mb-8">
            PRONITE<span className="text-[#e3b87c]">."</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <p className="max-w-xl text-zinc-500 text-sm leading-relaxed uppercase tracking-wider font-depixel-small">
             Join us at the Open Air Stage for a dual-night sequence featuring the industry's most prolific vocalists, exclusive at Inquivesta XII.
            </p>
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">Est. Coordinates</span>
              <span className="font-mono text-xl text-white tracking-widest">IISER_KOLKATA // MOHANPUR</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lineup Section */}
      <section className="py-16 px-8 bg-[#1A1A1A] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">The Headliners</h2>
          </div>
          
          {/* Day 1 */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-[#A8D8EA]" />
              <span className="text-[#A8D8EA] font-mono text-sm uppercase tracking-[0.3em]">Day 1 [Feb 7th]</span>
            </div>
          </div>

          <ArtistCard 
            name="Monali Thakur"
            date="February 7, 2026"
            image="/pronite/artist_2.jpeg"
            bio="Commanding the stage on Night 1, National Award winner Monali Thakur brings her signature blend of vocal precision and infectious energy. Expect a setlist that traverses the depths of Bollywood soul and the peaks of modern pop."
            songs={["Sawaar Loon", "Moh Moh Ke Dhaage", "Cham Cham", "Badri Ki Dulhania"]}
            socials={{
              instagram: "https://www.instagram.com/monalithakur03",
              youtube: "https://www.youtube.com/channel/UC5UhoMDm--gaSN2vRY606kg"
            }}
          />

          {/* <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D2B997]/30 to-transparent my-20" /> */}

          {/* Day 2 */}
          {/* <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-[#A8D8EA]" />
              <span className="text-[#A8D8EA] font-mono text-sm uppercase tracking-[0.3em]">Day 2 [Feb 8th]</span>
            </div>
          </div>

          <ArtistCard 
            name="Nikhil D'Souza"
            date="February 8, 2026"
            image="/pronite/artist_2.jpeg"
            bio="Night 2 belongs to the architect of acoustic pop. Nikhil D'Souza's performance is a curated auditory experience, blending international folk-pop sensibilities with the cinematic textures of the modern era."
            songs={["Mere Bina", "Vaaste", "Sham", "O Gujariya"]}
            socials={{
              instagram: "https://www.instagram.com/nikhildsouzamusic",
              youtube: "https://www.youtube.com/nikhildsouza81"
            }}
          /> */}
        </div>
      </section>

      {/* Access & Logistics */}
      <section className="py-32 px-8 relative bg-[#2A2A2A]">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <div>
              <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-8 text-[#D2B997]">Protocol</h3>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#1A1A1A] border border-[#D2B997]/30 rounded-xl flex items-center justify-center text-[#A8D8EA] font-mono font-bold">01</div>
                  <div className="space-y-2">
                    <h4 className="font-bold uppercase text-xs tracking-widest text-[#D2B997]">Mandatory Credentials</h4>
                    <p className="text-xs text-[#B8A7D9] leading-relaxed uppercase font-depixel-small">Entry into IISER Kolkata campus requires a physical or digital Day Pass. No exceptions.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#1A1A1A] border border-[#D2B997]/30 rounded-xl flex items-center justify-center text-[#A8D8EA] font-mono font-bold">02</div>
                  <div className="space-y-2">
                    <h4 className="font-bold uppercase text-xs tracking-widest text-[#D2B997]">Synchronization (Time)</h4>
                    <p className="text-xs text-[#B8A7D9] leading-relaxed uppercase font-depixel-small">Entry opens at <span className="text-[#D2B997]">18:00</span>, and closes at <span className="text-[#D2B997]">19:00</span>. Ensure early arrival.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#1A1A1A] border border-[#D2B997]/30 rounded-xl flex items-center justify-center text-[#A8D8EA] font-mono font-bold">03</div>
                  <div className="space-y-2">
                    <h4 className="font-bold uppercase text-xs tracking-widest text-[#D2B997]">Integrity Check</h4>
                    <p className="text-xs text-[#B8A7D9] leading-relaxed uppercase font-depixel-small">A government-issued/Institute photo ID must match the name on your digital access token.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-32 px-8 relative bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 text-white">Location</h2>
            <p className="text-[#A8D8EA] font-mono text-sm uppercase tracking-[0.3em]">Open Air Stage</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-[#D2B997]/30">
              <iframe 
                className="w-full h-full"
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=IISER Kolkata Athletics Ground&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              />
            </div>

            {/* Venue Details */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-[#D2B997]">Venue Details</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#2A2A2A] border border-[#D2B997]/30 rounded-lg flex items-center justify-center text-[#A8D8EA]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <h4 className="font-bold uppercase text-sm tracking-widest text-[#D2B997]">Open Air Stage</h4>
                      <p className="text-[#B8A7D9] text-sm font-depixel-small">IISER Kolkata</p>
                      <p className="text-[#A8D8EA] text-xs font-depixel-small">Mohanpur, West Bengal 741246</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#2A2A2A] border border-[#D2B997]/30 rounded-lg flex items-center justify-center text-[#A8D8EA]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div>
                      <h4 className="font-bold uppercase text-sm tracking-widest text-[#D2B997]">Event Timing</h4>
                      <p className="text-[#B8A7D9] text-sm font-depixel-small">Gates Open: 6:00 PM</p>
                      <p className="text-[#A8D8EA] text-xs font-depixel-small">Show Starts: 7:00 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#2A2A2A] border border-[#D2B997]/30 rounded-lg flex items-center justify-center text-[#A8D8EA]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y2="10"/></svg>
                    </div>
                    <div>
                      <h4 className="font-bold uppercase text-sm tracking-widest text-[#D2B997]">Dates</h4>
                      <p className="text-[#B8A7D9] text-sm font-depixel-small">February 7-8, 2026</p>
                      <p className="text-[#A8D8EA] text-xs font-depixel-small">Two nights of live music</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2A2A]/80 border-t border-[#D2B997]/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image src="/logo-full.svg" alt="INQUIVESTA XII" width={150} height={75} className="h-16 w-auto mb-4" />
              <p className="text-[#D2B997] text-sm font-depixel-small">IISER Kolkata's flagship annual science festival</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 font-depixel-body">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Home
                </Link>
                <Link
                  href="/about_us"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  About Us
                </Link>
                <Link
                  href="/events"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Events
                </Link>
                <Link
                  href="/sponsors"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Sponsors
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 font-depixel-body">Events</h3>
              <div className="space-y-2">
                <Link
                  href="/events"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Competitions
                </Link>
                <Link
                  href="/masquerade"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Masquerade
                </Link>
                <Link
                  href="/pronite"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Pronite
                </Link>
                <Link
                  href="/merch"
                  className="block text-[#B8A7D9] hover:text-[#D2B997] transition-colors text-sm font-depixel-small"
                >
                  Merch
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 font-depixel-body">Contact</h3>
              <div className="space-y-2 text-sm font-depixel-small text-[#D2B997]">
                <p>IISER Kolkata</p>
                <p>Mohanpur, West Bengal</p>
                <p>Email: inquivesta@iiserkol.ac.in</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D2B997]/30 mt-8 pt-8 text-center">
            {/* Social Media Links with Icons */}
            <div className="flex justify-center items-center space-x-6 mb-6">
              <Link 
                href="https://x.com/InquivestaXII?t=EXpyCAYhrVmUgL98ShBGdg&s=09" 
                className="flex flex-col items-center group transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#1DA1F2]/20 to-[#1DA1F2]/10 p-2 rounded-full border border-[#1DA1F2]/30 group-hover:border-[#1DA1F2] transition-all duration-300">
                  <Twitter className="w-4 h-4 text-[#1DA1F2] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[#1DA1F2] text-xs font-depixel-small mt-1 group-hover:text-[#1DA1F2] transition-colors">X</span>
              </Link>

              <Link 
                href="https://www.instagram.com/inquivesta_iiserk/" 
                className="flex flex-col items-center group transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#E4405F]/20 to-[#E4405F]/10 p-2 rounded-full border border-[#E4405F]/30 group-hover:border-[#E4405F] transition-all duration-300">
                  <Instagram className="w-4 h-4 text-[#E4405F] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[#E4405F] text-xs font-depixel-small mt-1 group-hover:text-[#E4405F] transition-colors">Instagram</span>
              </Link>

              <Link 
                href="https://www.facebook.com/inquivesta" 
                className="flex flex-col items-center group transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#1877F2]/20 to-[#1877F2]/10 p-2 rounded-full border border-[#1877F2]/30 group-hover:border-[#1877F2] transition-all duration-300">
                  <Facebook className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-[#1877F2] text-xs font-depixel-small mt-1 group-hover:text-[#1877F2] transition-colors">Facebook</span>
              </Link>

              <Link 
                href="https://www.youtube.com/@Inquivesta" 
                className="flex flex-col items-center group transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-[#FF0000]/20 to-[#FF0000]/10 p-2 rounded-full border border-[#FF0000]/30 group-hover:border-[#FF0000] transition-all duration-300">
                  <svg className="w-4 h-4 text-[#FF0000] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span className="text-[#FF0000] text-xs font-depixel-small mt-1 group-hover:text-[#FF0000] transition-colors">YouTube</span>
              </Link>
            </div>
            <p className="text-[#D2B997] text-sm font-depixel-small mb-6">
              Designed with ❤️ by team inquivesta!
            </p>
            <p className="text-[#D2B997] text-sm font-depixel-small">
              © 2026 INQUIVESTA XII - IISER Kolkata. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}