"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import Avatar from "@/components/Avatar/Avatar";

export default function AccountSettingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    gender: "Prefer not to say",
    mobileNumber: "",
    dateOfBirth: "",
    profilePic: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPassLoading, setIsPassLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated" && session?.user) {
      setProfileData({
        name: session.user.name || "",
        username: session.user.username || "",
        bio: session.user.bio || "",
        location: session.user.location || "",
        gender: session.user.gender || "Prefer not to say",
        mobileNumber: session.user.mobileNumber || "",
        dateOfBirth: session.user.dateOfBirth ? session.user.dateOfBirth.split("T")[0] : "",
        profilePic: session.user.profilePic || "",
      });
    }
  }, [status, session, router]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.put("/users/profile", profileData);
      await update({
        ...session,
        user: {
          ...session.user,
          ...res.data,
        },
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload an image file");
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      // Assuming there's an upload endpoint
      const { data } = await axios.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const newPic = data.url;
      setProfileData(prev => ({ ...prev, profilePic: newPic }));
      
      // Update profile immediately with the new pic
      const res = await axios.put("/users/profile", { ...profileData, profilePic: newPic });
      await update({
        ...session,
        user: { ...session.user, profilePic: newPic }
      });
      
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setIsPassLoading(true);
    try {
      await axios.put("/users/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsPassLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-accent-primary border-t-transparent animate-spin"></div>
          <p className="font-bold tracking-widest text-[0.8rem] uppercase">Loading Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary font-['Inter',sans-serif] selection:bg-accent-primary/30">
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
            Account Settings
          </h1>
        </div>
        <div className="hidden md:block">
           <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-widest bg-bg-primary px-3 py-1 rounded-full border border-border-light">
             User ID: {session?.user?.id?.slice(-8)}
           </span>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto pt-32 pb-20 px-6">
        <section className="mb-12 animate-slide-up">
          <span className="bg-accent-primary/10 text-accent-primary px-4 py-1.5 rounded-full text-[0.75rem] font-bold uppercase tracking-widest mb-6 inline-block">
            Personal Center
          </span>
          <h2 className="text-[2.5rem] lg:text-[4.5rem] font-black text-text-primary leading-[1] mb-6 tracking-tighter">
            Manage your <span className="text-accent-primary italic">Account.</span>
          </h2>
          <p className="text-[1.1rem] text-text-muted font-medium leading-relaxed max-w-2xl">
            Update your personal information, contact details, and security settings in one place.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile & Personal Info */}
          <div className="lg:col-span-8 space-y-8">
            <section className="p-8 lg:p-10 rounded-[40px] bg-bg-white border border-border-light hover:border-accent-primary/30 transition-all animate-slide-up shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                <div className="relative group shrink-0">
                  <div className={`w-28 h-28 lg:w-36 lg:h-36 rounded-[40px] overflow-hidden bg-accent-primary/10 border-4 border-white shadow-xl flex-shrink-0 transition-transform group-hover:scale-[1.02] ${isUploading ? 'animate-pulse opacity-50' : ''}`}>
                    <Avatar contact={profileData} size="xl" />
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent-primary text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-accent-dark transition-all hover:scale-110 active:scale-95">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                    </svg>
                  </label>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-[1.8rem] font-black text-text-primary mb-1">
                    Profile Information
                  </h3>
                  <p className="text-text-muted text-[0.9rem] leading-relaxed mb-4">
                    Control how others see you on Bridge. Choose a cartoon avatar or upload your own.
                  </p>
                  
                  {/* Predefined Avatars Grid */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {[
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo',
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna',
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie',
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe',
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Jasper',
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Bella'
                    ].map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfileData(prev => ({ ...prev, profilePic: url }))}
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 ${profileData.profilePic === url ? 'border-accent-primary ring-2 ring-accent-primary/20 scale-105' : 'border-transparent hover:border-accent-primary/50'}`}
                      >
                        <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-bg-primary border border-border-light rounded-full text-[0.7rem] font-bold text-text-secondary uppercase">@{profileData.username}</span>
                    <span className="px-3 py-1 bg-bg-primary border border-border-light rounded-full text-[0.7rem] font-bold text-text-secondary uppercase">{session?.user?.email}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-bg-primary border border-border-light rounded-2xl py-3.5 px-5 text-[0.95rem] text-text-primary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider ml-1">Username</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-bg-primary border border-border-light rounded-2xl py-3.5 px-5 text-[0.95rem] text-text-primary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider ml-1">Bio</label>
                  <textarea
                    rows="3"
                    className="w-full bg-bg-primary border border-border-light rounded-2xl py-3.5 px-5 text-[0.95rem] text-text-primary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all resize-none shadow-sm"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Write a few lines about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider ml-1">Gender</label>
                    <select
                      className="w-full bg-bg-primary border border-border-light rounded-2xl py-3.5 px-5 text-[0.95rem] text-text-primary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm appearance-none"
                      value={profileData.gender}
                      onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider ml-1">Mobile Number</label>
                    <input
                      type="tel"
                      className="w-full bg-bg-primary border border-border-light rounded-2xl py-3.5 px-5 text-[0.95rem] text-text-primary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm"
                      value={profileData.mobileNumber}
                      onChange={(e) => setProfileData({ ...profileData, mobileNumber: e.target.value })}
                      placeholder="+880 1XXX XXXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider ml-1">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full bg-bg-primary border border-border-light rounded-2xl py-3.5 px-5 text-[0.95rem] text-text-primary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold text-text-muted uppercase tracking-wider ml-1">Location</label>
                    <input
                      type="text"
                      className="w-full bg-bg-primary border border-border-light rounded-2xl py-3.5 px-5 text-[0.95rem] text-text-primary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-10 py-4 bg-accent-primary text-white rounded-2xl font-bold text-[0.95rem] hover:bg-accent-dark hover:-translate-y-1 active:translate-y-0 transition-all shadow-[0_8px_20px_rgba(61,90,115,0.3)] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isLoading ? "Saving Changes..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Right Column: Security & Misc */}
          <div className="lg:col-span-4 space-y-8">
            <section className="p-8 rounded-[40px] bg-bg-white border border-border-light hover:border-accent-primary/30 transition-all animate-slide-up shadow-sm h-fit">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[1.3rem] font-black text-text-primary mb-0.5">Security</h3>
                  <p className="text-[0.8rem] text-text-muted font-bold uppercase tracking-wider">Change Password</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider ml-1">Current Password</label>
                  <input
                    type="password"
                    required
                    className="w-full bg-bg-primary border border-border-light rounded-xl py-3 px-4 text-[0.9rem] text-text-primary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider ml-1">New Password</label>
                  <input
                    type="password"
                    required
                    className="w-full bg-bg-primary border border-border-light rounded-xl py-3 px-4 text-[0.9rem] text-text-primary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider ml-1">Confirm New</label>
                  <input
                    type="password"
                    required
                    className="w-full bg-bg-primary border border-border-light rounded-xl py-3 px-4 text-[0.9rem] text-text-primary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPassLoading}
                  className="w-full py-4 bg-accent-primary text-white rounded-xl font-bold text-[0.9rem] hover:bg-accent-dark hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isPassLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </section>

            <div className="p-8 rounded-[40px] bg-[#1e2336] text-white border border-white/5 hover:border-accent-primary/30 relative overflow-hidden transition-all shadow-xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/20 blur-[60px] rounded-full" />
               <h4 className="text-[0.8rem] font-bold text-accent-primary uppercase tracking-widest mb-6">Account Status</h4>
               <ul className="space-y-5">
                 <li className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[1rem]">✅</div>
                   <div>
                     <p className="text-[0.65rem] opacity-50 font-bold uppercase">Account Verified</p>
                     <p className="text-[0.85rem] font-bold">Identity Confirmed</p>
                   </div>
                 </li>
                 <li className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[1rem]">🛡️</div>
                   <div>
                     <p className="text-[0.65rem] opacity-50 font-bold uppercase">Security Level</p>
                     <p className="text-[0.85rem] font-bold">Standard Protection</p>
                   </div>
                 </li>
               </ul>
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
