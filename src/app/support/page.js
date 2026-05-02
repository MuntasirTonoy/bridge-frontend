'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SupportPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqs = [
    {
      question: "How do I secure my account?",
      answer: "Use a strong password and enable two-factor authentication in your account settings. Never share your login credentials with anyone."
    },
    {
      question: "Can I delete messages for everyone?",
      answer: "Yes, you can delete messages you've sent. Depending on your settings and the chat type, you can choose to delete for yourself or for everyone."
    },
    {
      question: "How do I block a user?",
      answer: "Go to the user's profile or chat settings and select 'Block User'. This will prevent them from sending you messages or seeing your online status."
    },
    {
      question: "Where are my files stored?",
      answer: "Attachments are securely stored using Cloudinary. When you delete a message with an attachment, it is also removed from our storage servers."
    },
    {
      question: "Is Bridge Chat free to use?",
      answer: "Yes, Bridge Chat is completely free for personal use, including high-quality voice messages and file sharing."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-primary transition-colors duration-500 font-['Inter',sans-serif] selection:bg-accent-primary/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-white/80 backdrop-blur-xl border-b border-border-light px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/chat" 
            className="p-2 rounded-full hover:bg-accent-primary/10 text-text-secondary transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </Link>
          <h1 className="text-[1.2rem] font-black tracking-tight text-text-primary">Bridge Support</h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-[0.9rem] font-medium text-text-secondary hover:text-accent-primary transition-colors">About Bridge</Link>
          <a href="#" className="text-[0.9rem] font-medium text-text-secondary hover:text-accent-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-[0.9rem] font-medium text-text-secondary hover:text-accent-primary transition-colors">Terms of Service</a>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto pt-28 pb-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-[2.5rem] lg:text-[3.5rem] font-black text-text-primary leading-tight mb-6 animate-slide-up">
            How can we <span className="text-accent-primary italic">help you</span> today?
          </h2>
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-text-muted group-focus-within:text-accent-primary transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search for help articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-5 pl-14 pr-6 rounded-[24px] bg-bg-white border border-border-light shadow-xl shadow-accent-primary/5 focus:ring-4 focus:ring-accent-primary/10 transition-all outline-none text-text-primary text-[1rem]"
            />
          </div>
        </section>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-8 rounded-[32px] bg-bg-white border border-border-light hover:border-accent-primary/30 transition-all group cursor-pointer hover:translate-y-[-5px]">
            <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-6 group-hover:scale-110 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 className="text-[1.2rem] font-bold text-text-primary mb-2">Account & Security</h3>
            <p className="text-text-muted text-[0.9rem] leading-relaxed">Manage your login info, privacy settings, and active sessions.</p>
          </div>
          <div className="p-8 rounded-[32px] bg-bg-white border border-border-light hover:border-accent-primary/30 transition-all group cursor-pointer hover:translate-y-[-5px]">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3 className="text-[1.2rem] font-bold text-text-primary mb-2">Chat Features</h3>
            <p className="text-text-muted text-[0.9rem] leading-relaxed">Learn about voice messages, file sharing, and message management.</p>
          </div>
          <div className="p-8 rounded-[32px] bg-bg-white border border-border-light hover:border-accent-primary/30 transition-all group cursor-pointer hover:translate-y-[-5px]">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="text-[1.2rem] font-bold text-text-primary mb-2">Privacy Policy</h3>
            <p className="text-text-muted text-[0.9rem] leading-relaxed">Understand how we protect your data and your rights at Bridge.</p>
          </div>
        </div>

        {/* FAQs */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[1.8rem] font-black text-text-primary">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-[24px] bg-bg-white border border-border-light hover:border-accent-primary/20 transition-all">
                <h4 className="text-[1.05rem] font-bold text-text-primary mb-3">{faq.question}</h4>
                <p className="text-text-muted text-[0.95rem] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-20 bg-bg-white rounded-[32px] border border-dashed border-border-light">
                <p className="text-text-muted italic">No matching articles found. Try a different search.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Support */}
        <section className="p-10 rounded-[40px] bg-[#1e2336] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/20 blur-[100px] rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-[2rem] font-black mb-4 leading-tight">Still need help?</h3>
              <p className="opacity-70 text-[1.1rem]">Our team is here to support you 24/7. Reach out and we'll get back to you as soon as possible.</p>
            </div>
            <button className="px-10 py-5 bg-white text-[#1e2336] font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Contact Us
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-light py-12 text-center text-text-muted text-[0.85rem]">
        <p>© 2026 Bridge Chat Application. Designed with love for communication.</p>
      </footer>
    </div>
  );
}
