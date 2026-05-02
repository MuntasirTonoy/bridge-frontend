"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Lottie from "lottie-react";
import axios from "@/lib/axios";
import chatAnimation from "../../public/Chat.json";

// Icons
function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");

  const [isLogin, setIsLogin] = useState(modeParam !== "signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup fields
  const [signupForm, setSignupForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [signupErrors, setSignupErrors] = useState({});
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    setIsLogin(modeParam !== "signup");
  }, [modeParam]);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/chat");
    }
  }, [status, router]);

  // Theme logic
  useEffect(() => {
    const saved = localStorage.getItem("bridge-theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("bridge-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("bridge-theme", "light");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSignupErrors({});
    router.push(`/?mode=${!isLogin ? "login" : "signup"}`, { scroll: false });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
      toast.error(res.error);
    } else {
      toast.success("Logged in successfully!");
      router.push("/chat");
    }
  };

  const checkUsernameAvailability = async () => {
    if (!signupForm.username || !/^[a-z0-9_.]+$/.test(signupForm.username))
      return;
    setUsernameChecking(true);
    try {
      const res = await axios.get(
        `/auth/check-username?username=${signupForm.username}`,
      );
      if (!res.data.available) {
        setSignupErrors((prev) => ({
          ...prev,
          username: "Username is taken.",
        }));
        setUsernameAvailable(false);
      } else {
        setSignupErrors((prev) => ({ ...prev, username: null }));
        setUsernameAvailable(true);
      }
    } catch (err) {
      console.error("Check failed");
    } finally {
      setUsernameChecking(false);
    }
  };

  const validateSignup = () => {
    const e = {};
    if (!signupForm.name.trim()) e.name = "Name required.";
    if (!signupForm.username.trim()) e.username = "Username required.";
    if (!signupForm.email.trim()) e.email = "Email required.";
    if (signupForm.password.length < 8) e.password = "8+ characters.";
    if (signupForm.confirm !== signupForm.password) e.confirm = "Mismatch.";
    return e;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errs = validateSignup();
    setSignupErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await axios.post("/auth/signup", {
        name: signupForm.name,
        username: signupForm.username,
        email: signupForm.email,
        password: signupForm.password,
      });
      const res = await signIn("credentials", {
        redirect: false,
        email: signupForm.email,
        password: signupForm.password,
      });
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Account created!");
        router.push("/chat");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] dark:bg-[#1a2332] transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#5a6a7a] dark:text-[#9aa5b8] font-medium animate-pulse">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 font-['Inter',sans-serif] transition-colors duration-500">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-8 right-8 z-50 p-3 rounded-2xl bg-white/80 dark:bg-[#252c3d]/80 backdrop-blur-md shadow-lg border border-white/20 text-[#1a2332] dark:text-[#e8edf4] hover:scale-110 active:scale-95 transition-all"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="bg-bg-secondary dark:bg-bg-secondary-dark w-full max-w-[1000px] min-h-[660px] rounded-[40px] flex overflow-hidden animate-slide-up transition-colors border border-gray-500/20 duration-500">
        {/* Branding Side (Left) */}
        <div className="flex-1 relative hidden lg:flex flex-col justify-center items-center p-12 bg-[#3d5a73] dark:bg-[#1e2336] overflow-hidden">
          <div className="absolute top-12 left-12 z-10 text-white">
            <h1 className="text-[2.5rem] font-black tracking-tighter leading-none mb-2">
              Bridge
            </h1>
            <p className="text-[1rem] font-medium opacity-90 max-w-[200px] leading-snug">
              Connecting dialogues, building bridges.
            </p>
          </div>

          <div className="w-full max-w-[440px] relative z-10">
            <Lottie
              animationData={chatAnimation}
              loop={true}
              className="w-full h-auto"
            />
          </div>

          <div className="absolute bottom-12 left-12 right-12 z-10 text-white">
            <div className="flex gap-2 mb-4">
              <div className="w-8 h-1 bg-white/40 rounded-full" />
              <div className="w-2 h-1 bg-white rounded-full" />
              <div className="w-2 h-1 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Form Side (Right) */}
        <div className="flex-1 flex flex-col p-8 lg:p-16 justify-center relative">
          <div className="w-full max-w-[380px] mx-auto">
            <header className="mb-10 text-center">
              <h2 className="text-[2.2rem] font-bold text-[#1a2332] dark:text-[#e8edf4] mb-1">
                {isLogin ? "Hello Again!" : "Welcome!"}
              </h2>
              <p className="text-[#5a6a7a] dark:text-[#9aa5b8] text-[0.9rem] font-medium">
                {isLogin
                  ? "Let's get started with your journey"
                  : "Create an account to start chatting"}
              </p>
            </header>

            <div className="relative">
              {/* Login Form */}
              <div
                className={`transition-all duration-500 ease-in-out ${isLogin ? "opacity-100 translate-x-0 relative z-10" : "opacity-0 -translate-x-8 pointer-events-none absolute inset-0 z-0"}`}
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-4">
                    <input
                      className="w-full p-4 rounded-xl bg-white dark:bg-[#252c3d] border-none text-[0.95rem] text-[#1a2332] dark:text-[#e8edf4] shadow-sm transition-all focus:ring-2 focus:ring-accent-primary/20 placeholder:text-[#8a9aaa]"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="relative">
                      <input
                        className="w-full p-4 pr-12 rounded-xl bg-white dark:bg-[#252c3d] border-none text-[0.95rem] text-[#1a2332] dark:text-[#e8edf4] shadow-sm transition-all focus:ring-2 focus:ring-accent-primary/20 placeholder:text-[#8a9aaa]"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a9aaa] hover:text-[#5a6a7a] transition-colors"
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="remember-me"
                          className="peer appearance-none w-4 h-4 rounded border border-[#dde3ea] dark:border-[#2e3650] bg-white dark:bg-[#252c3d] checked:bg-accent-primary checked:border-accent-primary transition-all cursor-pointer"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <svg
                          className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block left-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="4"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-[0.75rem] font-medium text-[#5a6a7a] dark:text-[#9aa5b8] group-hover:text-[#1a2332] dark:group-hover:text-[#e8edf4] transition-colors select-none">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-[0.75rem] font-semibold text-[#5a6a7a] dark:text-[#9aa5b8] hover:text-[#1a2332] dark:hover:text-[#e8edf4] transition-colors"
                    >
                      Recovery Password
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 p-4 rounded-xl bg-accent-primary text-white font-bold text-[1rem] transition-all shadow-lg hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <div className="mt-8">
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute w-full border-t border-[#dde3ea] dark:border-[#2e3650]"></div>
                    <span className="relative bg-[#f0f2f5] dark:bg-[#222736] px-4 text-[0.8rem] text-[#8a9aaa] font-medium transition-colors">
                      Or continue with
                    </span>
                  </div>
                  <button className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-[#252c3d] rounded-xl shadow-sm border border-[#dde3ea] dark:border-[#2e3650] transition-all hover:bg-[#f8f9fa] dark:hover:bg-[#2c344a] hover:translate-y-[-2px] hover:shadow-md group">
                    <img
                      src="https://www.svgrepo.com/show/355037/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span className="text-[0.9rem] font-semibold text-[#1a2332] dark:text-[#e8edf4]">
                      Google
                    </span>
                  </button>
                </div>

                <footer className="mt-8 text-center text-[0.85rem] text-[#5a6a7a] dark:text-[#9aa5b8]">
                  Don't have an account?{" "}
                  <button
                    onClick={toggleMode}
                    className="text-[#3d5a73] dark:text-[#4f7391] font-bold hover:underline"
                  >
                    Register now
                  </button>
                </footer>
              </div>

              {/* Signup Form */}
              <div
                className={`transition-all duration-500 ease-in-out ${!isLogin ? "opacity-100 translate-x-0 relative z-10" : "opacity-0 translate-x-8 pointer-events-none absolute inset-0 z-0"}`}
              >
                <form onSubmit={handleSignup} className="space-y-3">
                  <input
                    className="w-full p-3.5 rounded-xl bg-white dark:bg-[#252c3d] border-none text-[0.95rem] text-[#1a2332] dark:text-[#e8edf4] shadow-sm transition-all focus:ring-2 focus:ring-accent-primary/20 placeholder:text-[#8a9aaa]"
                    type="text"
                    placeholder="Full Name"
                    value={signupForm.name}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, name: e.target.value })
                    }
                  />
                  <div className="relative">
                    <input
                      className="w-full p-3.5 rounded-xl bg-white dark:bg-[#252c3d] border-none text-[0.95rem] text-[#1a2332] dark:text-[#e8edf4] shadow-sm transition-all focus:ring-2 focus:ring-accent-primary/20 placeholder:text-[#8a9aaa]"
                      type="text"
                      placeholder="Username"
                      value={signupForm.username}
                      onBlur={checkUsernameAvailability}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          username: e.target.value.toLowerCase(),
                        })
                      }
                    />
                    {usernameChecking && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.7rem] text-[#8a9aaa]">
                        checking...
                      </span>
                    )}
                  </div>
                  <input
                    className="w-full p-3.5 rounded-xl bg-white dark:bg-[#252c3d] border-none text-[0.95rem] text-[#1a2332] dark:text-[#e8edf4] shadow-sm transition-all focus:ring-2 focus:ring-accent-primary/20 placeholder:text-[#8a9aaa]"
                    type="email"
                    placeholder="Email"
                    value={signupForm.email}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, email: e.target.value })
                    }
                  />
                  <div className="relative">
                    <input
                      className="w-full p-3.5 pr-12 rounded-xl bg-white dark:bg-[#252c3d] border-none text-[0.95rem] text-[#1a2332] dark:text-[#e8edf4] shadow-sm transition-all focus:ring-2 focus:ring-accent-primary/20 placeholder:text-[#8a9aaa]"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          password: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a9aaa]"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full p-3.5 pr-12 rounded-xl bg-white dark:bg-[#252c3d] border-none text-[0.95rem] text-[#1a2332] dark:text-[#e8edf4] shadow-sm transition-all focus:ring-2 focus:ring-accent-primary/20 placeholder:text-[#8a9aaa]"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={signupForm.confirm}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          confirm: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a9aaa]"
                    >
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 p-4 rounded-xl bg-accent-primary text-white font-bold text-[1rem] transition-all shadow-lg hover:bg-accent-dark hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </form>

                <div className="mt-8">
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute w-full border-t border-[#dde3ea] dark:border-[#2e3650]"></div>
                    <span className="relative bg-[#f0f2f5] dark:bg-[#222736] px-4 text-[0.8rem] text-[#8a9aaa] font-medium transition-colors">
                      Or continue with
                    </span>
                  </div>
                  <button className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-[#252c3d] rounded-xl shadow-sm border border-[#dde3ea] dark:border-[#2e3650] transition-all hover:bg-[#f8f9fa] dark:hover:bg-[#2c344a] hover:translate-y-[-2px] hover:shadow-md group">
                    <img
                      src="https://www.svgrepo.com/show/355037/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span className="text-[0.9rem] font-semibold text-[#1a2332] dark:text-[#e8edf4]">
                      Google
                    </span>
                  </button>
                </div>

                <footer className="mt-8 text-center text-[0.85rem] text-[#5a6a7a] dark:text-[#9aa5b8]">
                  Already have an account?{" "}
                  <button
                    onClick={toggleMode}
                    className="text-[#3d5a73] dark:text-[#4f7391] font-bold hover:underline"
                  >
                    Log in
                  </button>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] dark:bg-[#1a2332]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#5a6a7a] dark:text-[#9aa5b8] font-medium">Loading...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
