'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Mail, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import Logo from '../components/Logo';
import SocialIcons from '../components/SocialIcons';
import { 
  PRIMARY_PHONE, 
  SECONDARY_PHONE, 
  DEALERSHIP_INFO, 
  buildWhatsAppLink, 
  buildContactFormMessage 
} from '../lib/contactConfig';

export default function ContactPage() {
  const router = useRouter();
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleLogoClick = (e) => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      e.preventDefault();
      e.stopPropagation();
      clickCountRef.current = 0;
      router.push('/admin');
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 750);
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: 'Vehicle in Stock / Pricing',
    vehicleModel: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submittedMessage, setSubmittedMessage] = useState(null);
  const [activeTargetNumber, setActiveTargetNumber] = useState(PRIMARY_PHONE.clean);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone or WhatsApp number';
    } else if (formData.phone.trim().length < 6) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message or question';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Build formatted message
    const formattedText = buildContactFormMessage(formData);
    setSubmittedMessage(formattedText);

    // Build URL directly targeting Primary Number as requested
    const targetClean = activeTargetNumber || PRIMARY_PHONE.clean;
    const waUrl = buildWhatsAppLink(targetClean, formattedText);

    // Open WhatsApp
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-gray-800 font-sans flex flex-col justify-between">
      <div>
        {/* Top Black Bar with Dual Contact Numbers */}
        <div id="top-bar" className="bg-black text-white py-1.5 border-b border-gray-800">
          <div className="container mx-auto max-w-[1240px] px-3 flex flex-wrap justify-between items-center text-xs font-bold gap-2">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs">
              {/* Phone Line 1 */}
              <div className="flex items-center gap-1.5">
                <a 
                  href={PRIMARY_PHONE.tel} 
                  className="hover:text-yellow-300 transition-colors flex items-center gap-1 font-semibold"
                  title={`Call ${PRIMARY_PHONE.display}`}
                >
                  <Phone size={12} className="text-yellow-400" />
                  <span>{PRIMARY_PHONE.display}</span>
                </a>
                <a 
                  href={PRIMARY_PHONE.whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-emerald-400 hover:text-emerald-300 transition-colors ml-0.5"
                  title={`WhatsApp ${PRIMARY_PHONE.display}`}
                >
                  <MessageSquare size={13} />
                </a>
              </div>

              <span className="text-gray-600 hidden sm:inline">•</span>

              {/* Phone Line 2 */}
              <div className="flex items-center gap-1.5">
                <a 
                  href={SECONDARY_PHONE.tel} 
                  className="hover:text-yellow-300 transition-colors flex items-center gap-1 font-semibold"
                  title={`Call ${SECONDARY_PHONE.display}`}
                >
                  <Phone size={12} className="text-yellow-400" />
                  <span>{SECONDARY_PHONE.display}</span>
                </a>
                <a 
                  href={SECONDARY_PHONE.whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-emerald-400 hover:text-emerald-300 transition-colors ml-0.5"
                  title={`WhatsApp ${SECONDARY_PHONE.display}`}
                >
                  <MessageSquare size={13} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-[11px] text-gray-300 hidden md:flex items-center gap-1.5">
                <span className="text-yellow-400">📍</span>
                <span>Dar es Salaam, Tanzania</span>
              </div>
              <span className="text-gray-600 hidden md:inline">•</span>
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white flex items-center gap-1 text-xs transition"
              >
                <ArrowLeft size={13} />
                <span>Browse Inventory</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header (Dealership Blue #4b6ba3) */}
        <header id="main-header" className="bg-[#4b6ba3] py-2 sm:py-3 border-b-2 border-[#3c5683] shadow-md">
          <div className="container mx-auto max-w-[1240px] px-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <Link 
              href="/" 
              onClick={handleLogoClick}
              className="cursor-pointer select-none"
              title="3B MOTORS (Triple-click for Admin Access)"
            >
              <Logo width={240} height={72} />
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-1.5 rounded transition border border-white/20"
              >
                🚗 View All Stock
              </Link>
              <Link
                href="/contact"
                className="bg-white text-[#4b6ba3] font-bold text-xs px-4 py-1.5 rounded shadow transition border border-white"
              >
                📞 Contact Us
              </Link>
            </div>
          </div>
        </header>

        {/* Breadcrumb Header Banner */}
        <div className="bg-[#1f2837] text-white py-4 border-b border-gray-700">
          <div className="container mx-auto max-w-[1240px] px-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wide text-white uppercase flex items-center gap-2">
                  <span>Contact 3BrosMotor</span>
                  <span className="text-yellow-400 text-sm font-bold bg-yellow-400/20 px-2 py-0.5 rounded border border-yellow-400/30">
                    Dar es Salaam, Tanzania
                  </span>
                </h1>
                <p className="text-gray-300 text-xs sm:text-sm mt-0.5">
                  Reach our dealership sales team directly via phone call, WhatsApp, or send an inquiry below.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <span>/</span>
                <span className="text-yellow-400 font-semibold">Contact Us</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="container mx-auto max-w-[1240px] px-3 py-6">
          
          {/* Dual Phone Numbers Cards (Call & WhatsApp) */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Phone Card 1 */}
            <div id="card-phone-1" className="bg-white border border-gray-300 rounded-lg p-4 sm:p-5 shadow-sm hover:border-[#4b6ba3] transition">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-[#4b6ba3] flex-shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Dealership Phone Line 1
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    For car pricing, inventory visits & vehicle inquiries
                  </div>
                </div>
              </div>

              {/* Action Buttons: Call & WhatsApp */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
                <a
                  id="btn-call-primary"
                  href={PRIMARY_PHONE.tel}
                  className="flex items-center justify-center gap-2 bg-[#4b6ba3] hover:bg-blue-800 text-white font-bold py-2.5 px-3 rounded text-xs sm:text-sm shadow transition active:scale-[0.98]"
                >
                  <Phone size={16} />
                  <span>Call Now</span>
                </a>
                <a
                  id="btn-whatsapp-primary"
                  href={PRIMARY_PHONE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-3 rounded text-xs sm:text-sm shadow transition active:scale-[0.98]"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Phone Card 2 */}
            <div id="card-phone-2" className="bg-white border border-gray-300 rounded-lg p-4 sm:p-5 shadow-sm hover:border-[#4b6ba3] transition">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-[#4b6ba3] flex-shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Dealership Phone Line 2
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Order imports, financing questions & sales support
                  </div>
                </div>
              </div>

              {/* Action Buttons: Call & WhatsApp */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
                <a
                  id="btn-call-secondary"
                  href={SECONDARY_PHONE.tel}
                  className="flex items-center justify-center gap-2 bg-[#4b6ba3] hover:bg-blue-800 text-white font-bold py-2.5 px-3 rounded text-xs sm:text-sm shadow transition active:scale-[0.98]"
                >
                  <Phone size={16} />
                  <span>Call Now</span>
                </a>
                <a
                  id="btn-whatsapp-secondary"
                  href={SECONDARY_PHONE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-3 rounded text-xs sm:text-sm shadow transition active:scale-[0.98]"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Two-Column Section: Form + Dealership Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Form to Collect Details & Send via WhatsApp */}
            <div className="lg:col-span-7 bg-white border border-gray-300 rounded-lg shadow-sm p-4 sm:p-6">
              <div className="border-b border-gray-200 pb-3 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                    <span>Send Us an Inquiry</span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      Instant WhatsApp Dispatch
                    </span>
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Fill in your details below. Once submitted, your inquiry is pre-formatted and sent directly to our dealership via WhatsApp.
                </p>
              </div>

              {submittedMessage && (
                <div id="alert-submission-success" className="mb-4 bg-emerald-50 border border-emerald-300 p-3.5 rounded-md text-xs sm:text-sm">
                  <div className="flex items-start gap-2 text-emerald-800 font-bold mb-1">
                    <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Inquiry Ready! WhatsApp opened to complete your message.</span>
                  </div>
                  <p className="text-emerald-700 text-xs pl-6">
                    If WhatsApp did not open automatically, click either button below to send your inquiry:
                  </p>
                  <div className="pl-6 mt-2 flex flex-wrap gap-2">
                    <a
                      href={buildWhatsAppLink(PRIMARY_PHONE.clean, submittedMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 shadow"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp {PRIMARY_PHONE.display}</span>
                    </a>
                    <a
                      href={buildWhatsAppLink(SECONDARY_PHONE.clean, submittedMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 shadow"
                    >
                      <MessageSquare size={13} />
                      <span>WhatsApp {SECONDARY_PHONE.display}</span>
                    </a>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Full Name */}
                <div>
                  <label htmlFor="input-client-name" className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-client-name"
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Abc"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm outline-none transition focus:ring-2 focus:ring-[#4b6ba3] ${
                      errors.name ? 'border-red-500 bg-red-50/50' : 'border-gray-300 bg-white'
                    }`}
                  />
                  {errors.name && <p className="text-red-600 text-[11px] mt-1">{errors.name}</p>}
                </div>

                {/* 2. Phone / WhatsApp Number */}
                <div>
                  <label htmlFor="input-client-phone" className="block text-xs font-bold text-gray-700 mb-1">
                    Phone / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-client-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="e.g. +255 7XX XXX XXX or 07XX XXX XXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm outline-none transition focus:ring-2 focus:ring-[#4b6ba3] ${
                      errors.phone ? 'border-red-500 bg-red-50/50' : 'border-gray-300 bg-white'
                    }`}
                  />
                  {errors.phone && <p className="text-red-600 text-[11px] mt-1">{errors.phone}</p>}
                </div>

                {/* 3. Inquiry Type & Vehicle of Interest in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="select-inquiry-type" className="block text-xs font-bold text-gray-700 mb-1">
                      Reason for Contact
                    </label>
                    <select
                      id="select-inquiry-type"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white rounded text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#4b6ba3]"
                    >
                      <option value="Vehicle in Stock / Pricing">Vehicle in Stock / Pricing</option>
                      <option value="Order Import from Japan">Order Import from Japan</option>
                      <option value="Yard Visit / Test Drive">Yard Visit / Test Drive</option>
                      <option value="Financing & Payment Terms">Financing & Payment Terms</option>
                      <option value="Vehicle Spare Parts">Vehicle Spare Parts</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="input-vehicle-model" className="block text-xs font-bold text-gray-700 mb-1">
                      Vehicle / Stock # (Optional)
                    </label>
                    <input
                      id="input-vehicle-model"
                      name="vehicleModel"
                      type="text"
                      placeholder="e.g. Toyota Harrier, Prado, Stock #101"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-white rounded text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#4b6ba3]"
                    />
                  </div>
                </div>

                {/* 4. Message / Requirements */}
                <div>
                  <label htmlFor="textarea-client-message" className="block text-xs font-bold text-gray-700 mb-1">
                    Your Message / Question <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="textarea-client-message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us what you are looking for, your budget, or specific details you need..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded text-xs sm:text-sm outline-none transition focus:ring-2 focus:ring-[#4b6ba3] resize-y ${
                      errors.message ? 'border-red-500 bg-red-50/50' : 'border-gray-300 bg-white'
                    }`}
                  />
                  {errors.message && <p className="text-red-600 text-[11px] mt-1">{errors.message}</p>}
                </div>

                {/* WhatsApp Destination Selector */}
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs">
                  <div className="font-bold text-gray-700 mb-2 flex items-center justify-between">
                    <span>Send Message to WhatsApp Line:</span>
                    <span className="text-[11px] text-gray-500 font-normal">Choose recipient number</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTargetNumber(PRIMARY_PHONE.clean)}
                      className={`p-2 rounded border text-left flex items-center justify-between transition cursor-pointer ${
                        activeTargetNumber === PRIMARY_PHONE.clean
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-500">Line 1 (Sales)</div>
                        <div className="font-mono font-bold text-xs">{PRIMARY_PHONE.display}</div>
                      </div>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        activeTargetNumber === PRIMARY_PHONE.clean ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                      }`}>
                        {activeTargetNumber === PRIMARY_PHONE.clean && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTargetNumber(SECONDARY_PHONE.clean)}
                      className={`p-2 rounded border text-left flex items-center justify-between transition cursor-pointer ${
                        activeTargetNumber === SECONDARY_PHONE.clean
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-500">Line 2 (Support)</div>
                        <div className="font-mono font-bold text-xs">{SECONDARY_PHONE.display}</div>
                      </div>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        activeTargetNumber === SECONDARY_PHONE.clean ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                      }`}>
                        {activeTargetNumber === SECONDARY_PHONE.clean && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div>
                  <button
                    id="btn-submit-contact-whatsapp"
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-3 px-4 rounded shadow-md flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wider transition active:scale-[0.99] cursor-pointer"
                  >
                    <MessageSquare size={18} />
                    <span>Send Message via WhatsApp</span>
                  </button>
                  <p className="text-[11px] text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    <span>Your inquiry is pre-filled directly into WhatsApp for quick response from our team.</span>
                  </p>
                </div>

              </form>
            </div>

            {/* Right Column: Dealership Location & Details */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Location & Address Card */}
              <div id="card-dealership-location" className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#4b6ba3] font-bold text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-3">
                  <MapPin size={16} />
                  <span>Yard Location</span>
                </div>

                <div className="text-xs sm:text-sm space-y-2 text-gray-700">
                  <div className="font-bold text-gray-900 text-base">
                    {DEALERSHIP_INFO.name}
                  </div>
                  <p className="leading-relaxed">
                    {DEALERSHIP_INFO.address}
                  </p>
                  <div className="pt-2">
                    <a
                      id="link-google-maps"
                      href={DEALERSHIP_INFO.mapsSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#4b6ba3] font-bold px-3 py-1.5 rounded text-xs transition border border-blue-200"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours Card */}
              <div id="card-working-hours" className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#4b6ba3] font-bold text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-3">
                  <Clock size={16} />
                  <span>Business Hours</span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  {DEALERSHIP_INFO.workingHours.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                      <span className="font-semibold text-gray-700">{item.days}</span>
                      <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">{item.hours}</span>
                    </div>
                  ))}
                  <div className="text-[11px] text-gray-500 pt-1">
                    * WhatsApp lines are open for inquiries even outside yard opening hours.
                  </div>
                </div>
              </div>

              {/* Email & Support Card */}
              <div id="card-email-support" className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#4b6ba3] font-bold text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-3">
                  <Mail size={16} />
                  <span>Direct Email</span>
                </div>

                <div className="text-xs sm:text-sm text-gray-700">
                  <div className="text-gray-500 mb-1">For official tenders, documents & corporate inquiries:</div>
                  <a
                    href={`mailto:${DEALERSHIP_INFO.email}`}
                    className="text-blue-700 hover:underline font-bold text-sm"
                  >
                    {DEALERSHIP_INFO.email}
                  </a>
                </div>
              </div>

              {/* Official Social Media Channels */}
              <div id="card-social-channels" className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#4b6ba3] font-bold text-sm uppercase tracking-wide border-b border-gray-200 pb-2 mb-3">
                  <span>Official Social Media</span>
                </div>
                <div className="text-xs text-gray-600 mb-3">
                  Follow 3BrosMotor for new vehicle arrivals, video walkthroughs, and stock updates:
                </div>
                <SocialIcons variant="header" className="gap-2" />
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* Main Dealership Footer */}
      <footer id="main-footer" className="mt-8 border-t border-gray-300">
        <div className="bg-[#2a3854] text-white py-2.5 text-xs">
          <div className="container mx-auto max-w-[1240px] px-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>© {new Date().getFullYear()} 3BROS MOTOR. All Rights Reserved.</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-300">Follow Us:</span>
              <SocialIcons variant="footer" />
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="hover:text-yellow-300 transition">Inventory</Link>
              <span>•</span>
              <Link href="/contact" className="text-yellow-400 font-bold hover:underline">Contact Us</Link>
              <span>•</span>
              <Link href="/admin/login" className="hover:text-yellow-300 transition">Admin Portal</Link>
            </div>
          </div>
        </div>

        <div className="bg-[#191d24] text-white py-6 border-t border-gray-800">
          <div className="container mx-auto max-w-[1240px] px-3 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <Logo width={220} height={70} />
            </div>

            <div className="text-xs space-y-1 text-center md:text-left">
              <div className="font-bold text-sm text-white uppercase tracking-wide">3BROS MOTOR</div>
              <div className="text-gray-300">
                <span className="text-blue-400 font-semibold">Location:</span> {DEALERSHIP_INFO.address}
              </div>
              <div className="text-gray-300">
                <span className="text-blue-400 font-semibold">Email:</span> {DEALERSHIP_INFO.email}
              </div>
              <div className="text-gray-300 flex flex-wrap gap-x-3 gap-y-1 justify-center md:justify-start">
                <span className="flex items-center gap-1">
                  <span className="text-gray-400">Line 1:</span>
                  <a href={PRIMARY_PHONE.tel} className="hover:underline text-white font-medium">{PRIMARY_PHONE.display}</a>
                </span>
                <span className="text-gray-600 hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-gray-400">Line 2:</span>
                  <a href={SECONDARY_PHONE.tel} className="hover:underline text-white font-medium">{SECONDARY_PHONE.display}</a>
                </span>
              </div>
            </div>

            <div>
              <Link
                id="btn-footer-browse"
                href="/"
                className="bg-white hover:bg-gray-100 text-gray-900 font-bold px-5 py-2 rounded shadow text-xs uppercase tracking-wider transition inline-block border border-gray-300"
              >
                Back to Stock
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
