'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../../components/Logo';
import { 
  authenticateWithFirebaseEmail, 
  authenticateWithFirebaseGoogle, 
  isUserAuthenticated, 
  logoutAdmin,
  getAdminUser
} from '../../lib/auth';
import { firebaseConfig } from '../../lib/firebase';
import { 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  Key, 
  ArrowRight, 
  LogOut, 
  Check, 
  Loader2
} from 'lucide-react';
import { PRIMARY_PHONE, SECONDARY_PHONE } from '../../lib/contactConfig';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isUserAuthenticated()) {
      setAlreadyLoggedIn(true);
      setCurrentUser(getAdminUser());
    }
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await authenticateWithFirebaseEmail(email, password);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 600);
      } else {
        // If Firebase error is that operation is not allowed or user not found, also offer fallback check
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError(err?.message || 'Unexpected login error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await authenticateWithFirebaseGoogle();
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 600);
      } else {
        setError(res.error || 'Google Sign-In failed.');
      }
    } catch (err) {
      setError(err?.message || 'Google Sign-In encountered an error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutExisting = async () => {
    await logoutAdmin();
    setAlreadyLoggedIn(false);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between font-sans">
      <div>
        {/* Top bar */}
        <div className="bg-black text-white py-1 text-xs">
          <div className="container mx-auto max-w-[1240px] px-3 flex flex-wrap justify-between items-center font-bold gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <a href={PRIMARY_PHONE.tel} className="hover:text-yellow-300 transition">{PRIMARY_PHONE.display}</a>
                <a href={PRIMARY_PHONE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 ml-0.5" title="WhatsApp">💬</a>
              </span>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span className="flex items-center gap-1">
                <a href={SECONDARY_PHONE.tel} className="hover:text-yellow-300 transition">{SECONDARY_PHONE.display}</a>
                <a href={SECONDARY_PHONE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 ml-0.5" title="WhatsApp">💬</a>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/contact" className="text-gray-300 hover:text-white">
                Contact Page
              </Link>
              <Link href="/" className="text-yellow-400 hover:underline">
                &larr; Back to Public Inventory
              </Link>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="bg-[#4b6ba3] py-3 border-b-2 border-[#3c5683]">
          <div className="container mx-auto max-w-[1240px] px-3 flex justify-between items-center">
            <Link href="/">
              <Logo width={220} height={66} />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-white text-xs font-semibold uppercase tracking-wider bg-black/20 px-3 py-1 rounded flex items-center gap-1.5">
                <Lock size={12} /> Dealer Admin Portal
              </span>
            </div>
          </div>
        </header>

        {/* Main Section */}
        <div className="container mx-auto max-w-[1240px] px-3 py-8 flex flex-col items-center justify-center">
          
          <div className="bg-white border border-gray-300 rounded-sm shadow-md w-full max-w-md p-6">
            
            <div className="text-center mb-5">
              <div className="flex justify-center mb-2">
                <Logo width={220} height={66} variant="light" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">3BrosMotor .LTD</h2>
              <p className="text-xs text-gray-500 mt-1">
                Authorized Dealership Management Portal
              </p>
            </div>

            {alreadyLoggedIn ? (
              <div className="bg-green-50 border border-green-200 p-4 rounded text-center text-xs space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-green-700 font-bold text-sm">
                  <ShieldCheck size={18} /> You are signed in
                </div>
                <p className="text-gray-600">
                  Signed in as <strong className="text-gray-800">{currentUser?.email || 'Administrator'}</strong>
                </p>
                <div className="flex gap-2 justify-center pt-1">
                  <Link
                    href="/admin"
                    className="bg-[#1c459c] hover:bg-blue-900 text-white font-bold px-4 py-2 rounded text-xs inline-flex items-center gap-1 shadow-sm"
                  >
                    Enter Stock Manager <ArrowRight size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogoutExisting}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-3 py-2 rounded text-xs inline-flex items-center gap-1"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </div>
            ) : isSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-5 rounded text-center text-xs space-y-2">
                <ShieldCheck size={28} className="mx-auto text-green-600" />
                <p className="font-bold text-sm">Authentication Successful!</p>
                <p className="text-gray-600">Opening vehicle stock manager...</p>
                <div className="flex justify-center pt-2">
                  <Loader2 className="animate-spin text-green-700" size={18} />
                </div>
              </div>
            ) : (
              <div>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-start gap-2">
                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-red-600" />
                    <div className="flex-1">
                      <span className="font-semibold block mb-0.5">Authentication Failed</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* Email and Password Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Administrator Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="abc@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-gray-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1c459c] hover:bg-blue-900 disabled:bg-blue-300 text-white font-bold py-2.5 rounded uppercase tracking-wider text-xs shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Verifying Credentials...
                      </>
                    ) : (
                      <>
                        <Lock size={14} /> Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-in */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-medium py-2 rounded text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign In with Google</span>
                </button>

                <div className="text-center pt-4">
                  <Link href="/" className="text-blue-600 hover:underline text-xs">
                    &larr; Return to public vehicle inventory
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      <footer className="bg-[#191d24] text-gray-400 py-3 text-xs text-center border-t border-gray-800">
        &copy; {new Date().getFullYear()} 3BrosMotor .LTD. Dealership Internal System.
      </footer>
    </div>
  );
}
