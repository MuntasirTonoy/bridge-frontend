"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary transition-colors duration-500 font-['Inter',sans-serif] selection:bg-accent-primary/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg-white/80 backdrop-blur-xl border-b border-border-light px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/chat"
            className="p-2 rounded-full hover:bg-accent-primary/10 text-text-secondary transition-all"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <h1 className="text-[1.2rem] font-black tracking-tight text-text-primary">
            About Bridge
          </h1>
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto pt-32 pb-20 px-6">
        {/* Hero Section */}
        <section className="mb-20 animate-slide-up">
          <span className="bg-accent-primary/10 text-accent-primary px-4 py-1.5 rounded-full text-[0.75rem] font-bold uppercase tracking-widest mb-6 inline-block">
            The Vision
          </span>
          <h2 className="text-[3rem] lg:text-[5rem] font-black text-text-primary leading-[1] mb-8 tracking-tighter">
            Building Bridges through{" "}
            <span className="text-accent-primary italic">Dialogue.</span>
          </h2>
          <p className="text-[1.3rem] text-text-muted font-medium leading-relaxed max-w-2xl">
            More than just a chat app. A seamless platform designed to connect
            people with privacy, speed, and elegance.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            <section className="animate-slide-up">
              <h3 className="text-[2.2rem] font-black text-text-primary mb-8 flex items-center gap-4">
                Our Mission & Goals
              </h3>
              <div className="space-y-6 text-[1.15rem] text-text-muted leading-relaxed">
                <p>
                  <span className="text-text-primary font-bold">Bridge</span>{" "}
                  was born out of a simple but powerful motive: to create a
                  communication tool that feels as natural as a face-to-face
                  conversation while leveraging the power of modern technology.
                  Our goal is to break down the barriers of digital interaction
                  by providing a platform that is both powerful and incredibly
                  simple to use.
                </p>
                <p>
                  We believe that communication should be{" "}
                  <span className="italic">
                    unfiltered, secure, and beautiful
                  </span>
                  . In an era where privacy is often compromised, Bridge focuses
                  on giving users full control over their data. From real-time
                  message synchronization to secure file handling, every feature
                  is built with the user's peace of mind as the top priority.
                </p>
                <blockquote className="border-l-4 border-accent-primary pl-6 py-2 my-10 italic text-[1.3rem] text-text-primary font-medium">
                  "The shortest distance between two people is a meaningful
                  conversation. Bridge is here to pave that path."
                </blockquote>
              </div>
            </section>

            <section
              className="animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="text-[2.2rem] font-black text-text-primary mb-8">
                Why Bridge?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-bg-white border border-border-light rounded-[32px] hover:border-accent-primary/30 transition-all">
                  <div className="w-12 h-12 bg-accent-primary/10 rounded-2xl flex items-center justify-center text-accent-primary mb-6">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h4 className="text-[1.2rem] font-bold text-text-primary mb-3">
                    Privacy First
                  </h4>
                  <p className="text-text-muted text-[0.95rem]">
                    Your data belongs to you. We use industry-standard practices
                    to ensure your conversations remain private and secure.
                  </p>
                </div>
                <div className="p-8 bg-bg-white border border-border-light rounded-[32px] hover:border-accent-primary/30 transition-all">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <h4 className="text-[1.2rem] font-bold text-text-primary mb-3">
                    Instant Speed
                  </h4>
                  <p className="text-text-muted text-[0.95rem]">
                    Built with Socket.io and high-performance backend, messages
                    and files are delivered with zero latency.
                  </p>
                </div>
                <div className="p-8 bg-bg-white border border-border-light rounded-[32px] hover:border-accent-primary/30 transition-all">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="7 10 12 15 22 5" />
                    </svg>
                  </div>
                  <h4 className="text-[1.2rem] font-bold text-text-primary mb-3">
                    Modern Experience
                  </h4>
                  <p className="text-text-muted text-[0.95rem]">
                    A premium UI/UX design that feels alive, featuring dark
                    mode, animations, and intuitive controls.
                  </p>
                </div>
                <div className="p-8 bg-bg-white border border-border-light rounded-[32px] shadow-sm hover:border-l-2 hover:border-accent-primary transition-all">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <h4 className="text-[1.2rem] font-bold text-text-primary mb-3">
                    Always Evolving
                  </h4>
                  <p className="text-text-muted text-[0.95rem]">
                    Bridge is constantly updated with new features like voice
                    notes, PDF sharing, and advanced chat management.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-[2.2rem] font-black text-text-primary mb-8 flex items-ce  nter gap-4">
                Meet the Developer
              </h3>
              <div className="p-8 lg:p-10 rounded-[40px] bg-bg-white border border-border-light hover:border-accent-primary/30 flex flex-col md:flex-row gap-10 items-center transition-all">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[32px] overflow-hidden bg-accent-primary/10 flex-shrink-0 border-4 border-white transition-all">
                  <img
                    src="https://api.dicebear.com/7.x/adventurer/svg?seed=Tonoy"
                    alt="Developer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-[1.8rem] font-black text-text-primary mb-2">
                    MD Muntasir Mahmud Tonoy
                  </h4>
                  <p className="text-accent-primary font-bold text-[1rem] uppercase tracking-widest mb-4">
                    Lead Full Stack Developer
                  </p>
                  <p className="text-text-muted text-[1.05rem] leading-relaxed mb-6">
                    A passionate developer from Bangladesh focused on creating
                    real-world MERN stack applications that bridge the gap
                    between people and technology.
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <a
                      href="https://muntasir-mahmud.web.app"
                      target="_blank"
                      className="px-5 py-2.5 bg-bg-primary text-text-primary rounded-xl font-bold text-[0.85rem] border border-border-light hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all"
                    >
                      Portfolio
                    </a>
                    <a
                      href="https://github.com/muntasirtonoy"
                      target="_blank"
                      className="px-5 py-2.5 bg-bg-primary text-text-primary rounded-xl font-bold text-[0.85rem] border border-border-light hover:bg-[#181717] hover:text-white hover:border-[#181717] transition-all"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/munatsirtonoy"
                      target="_blank"
                      className="px-5 py-2.5 bg-bg-primary text-text-primary rounded-xl font-bold text-[0.85rem] border border-border-light hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Stats/Info */}
          <div className="lg:col-span-4 space-y-10">
            <div className="p-8 bg-[#1e2336] rounded-[40px] text-white border border-white/5 hover:border-accent-primary/30 relative overflow-hidden transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/20 blur-[60px] rounded-full" />
              <h4 className="text-[0.8rem] font-bold text-accent-primary uppercase tracking-widest mb-6">
                At a Glance
              </h4>
              <ul className="space-y-6">
                <li className="flex items-center gap-4">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <p className="text-[0.7rem] opacity-50 font-bold uppercase">
                      Availability
                    </p>
                    <p className="text-[0.95rem] font-bold">
                      Global / Web-based
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-[0.7rem] opacity-50 font-bold uppercase">
                      Technology
                    </p>
                    <p className="text-[0.95rem] font-bold">
                      Next.js & Socket.io
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <p className="text-[0.7rem] opacity-50 font-bold uppercase">
                      Encryption
                    </p>
                    <p className="text-[0.95rem] font-bold">
                      JWT & Secure Storage
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-[40px] bg-bg-white border border-border-light hover:border-accent-primary/30 transition-all">
              <h4 className="text-[1.1rem] font-black text-text-primary mb-4">
                Start your journey
              </h4>
              <p className="text-text-muted text-[0.9rem] mb-6 leading-relaxed">
                Join thousands of users who have already found a better way to
                communicate.
              </p>
              <Link
                href="/"
                className="w-full py-4 bg-accent-primary text-white rounded-2xl flex items-center justify-center font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-light py-12 text-center text-text-muted text-[0.85rem]">
        <p>© 2026 Bridge Chat Application. All rights reserved.</p>
      </footer>
    </div>
  );
}
