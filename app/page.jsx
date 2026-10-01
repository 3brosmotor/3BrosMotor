'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Search, RotateCcw, ChevronDown, ChevronUp, Phone, MessageSquare, Layers, Eye } from 'lucide-react';
import HeroSlider from './components/HeroSlider';
import Logo from './components/Logo';
import VehicleInquiryModal from './components/VehicleInquiryModal';
import VehicleDetailModal from './components/VehicleDetailModal';
import SocialIcons from './components/SocialIcons';
// import DealershipSeoSection from './components/DealershipSeoSection';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredCars, INVENTORY_EVENT, initCarStoreSync } from './lib/carStore';
import { getVehicleImages } from './lib/carsData';
import { PRIMARY_PHONE, SECONDARY_PHONE, DEALERSHIP_INFO } from './lib/contactConfig';

const MAKES_LIST = [
  'SINO',
  'SACHMAN',
  'SCANIA',
  'Toyota',
  'Volkswagen',
  'Suzuki',
  'Land Rover',
  'Nissan',
  'Mitsubishi',
  'Subaru',
  'Hino',
  'Daihatsu',
  'Bmw',
  'Mazda',
  'Audi',
  'Honda'
];

const BODY_TYPES = [
  { name: 'Bus', icon: '🚌' },
  { name: 'Coupe', icon: '🏎️' },
  { name: 'Hatchback', icon: '🚗' },
  { name: 'Heavy Truck', icon: '🚛' },
  { name: 'MPV', icon: '🚐' },
  { name: 'Pickup', icon: '🛻' },
  { name: 'Saloon', icon: '🚙' },
  { name: 'Sedan', icon: '🚘' },
  { name: 'SUV', icon: '🚙' },
  { name: 'T Wagon', icon: '🚐' },
  { name: 'Van', icon: '🚐' }
];

export default function Home() {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdminRedirecting, setIsAdminRedirecting] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  // Triple-click on Dealership Logo accesses Admin Portal
  const handleLogoClick = (e) => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      e.preventDefault();
      e.stopPropagation();
      clickCountRef.current = 0;
      setIsAdminRedirecting(true);
      setTimeout(() => {
        router.push('/admin');
      }, 350);
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 750);
  };

  useEffect(() => {
    initCarStoreSync();
    const stored = getStoredCars();
    setCars(stored);
    setIsLoaded(true);

    // If URL has ?stock= or ?vehicle= query parameter, open vehicle modal immediately
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get('stock') || params.get('vehicle');
      if (targetId) {
        const found = stored.find(c => String(c.id) === String(targetId));
        if (found) {
          setDetailModalCar(found);
        }
      }
    }

    const handleStorageUpdate = () => {
      setCars(getStoredCars());
    };
    window.addEventListener(INVENTORY_EVENT, handleStorageUpdate);
    return () => window.removeEventListener(INVENTORY_EVENT, handleStorageUpdate);
  }, []);
  
  // Search and filter state
  const [filterMake, setFilterMake] = useState('');
  const [filterBodyType, setFilterBodyType] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStockNo, setFilterStockNo] = useState('');
  const [filterChassis, setFilterChassis] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [inquiryModalCar, setInquiryModalCar] = useState(null);
  const [detailModalCar, setDetailModalCar] = useState(null);

  // Mobile & Tablet collapsible fold states for Makes and Body Types
  const [isMobileMakesOpen, setIsMobileMakesOpen] = useState(false);
  const [isMobileBodyTypesOpen, setIsMobileBodyTypesOpen] = useState(false);

  const toggleMobileMakes = () => {
    setIsMobileMakesOpen(prev => !prev);
  };

  const toggleMobileBodyTypes = () => {
    setIsMobileBodyTypesOpen(prev => !prev);
  };

  const handleMakeClick = (makeName) => {
    const isSelected = filterMake.toLowerCase() === makeName.toLowerCase();
    setFilterMake(isSelected ? '' : makeName);
    setActivePage(1);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      document.getElementById('main-inventory-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBodyTypeClick = (typeName) => {
    const isSelected = filterBodyType.toLowerCase() === typeName.toLowerCase();
    setFilterBodyType(isSelected ? '' : typeName);
    setActivePage(1);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      document.getElementById('main-inventory-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resetFilters = () => {
    setFilterMake('');
    setFilterBodyType('');
    setFilterModel('');
    setFilterYear('');
    setFilterStockNo('');
    setFilterChassis('');
    setGlobalSearch('');
    setActivePage(1);
  };

  const hasActiveFilters = Boolean(
    filterMake || filterBodyType || filterModel || filterYear || filterStockNo || filterChassis || globalSearch
  );

  // Extract unique makes and models for dropdowns
  const uniqueMakes = useMemo(() => {
    if (!cars) return [];
    return [...new Set(cars.map(c => c.make))].filter(Boolean);
  }, [cars]);

  const uniqueModels = useMemo(() => {
    if (!cars) return [];
    let filtered = cars;
    if (filterMake) {
      filtered = cars.filter(c => c.make.toLowerCase() === filterMake.toLowerCase());
    }
    return [...new Set(filtered.map(c => c.model))].filter(Boolean);
  }, [cars, filterMake]);

  // Derived filtered list
  const filteredCars = useMemo(() => {
    if (!cars) return [];
    return cars.filter(car => {
      if (filterMake && car.make.toLowerCase() !== filterMake.toLowerCase()) return false;
      if (filterBodyType && car.bodyType?.toLowerCase() !== filterBodyType.toLowerCase()) return false;
      if (filterModel && car.model.toLowerCase() !== filterModel.toLowerCase()) return false;
      if (filterYear && !car.year?.toString().includes(filterYear.trim())) return false;
      if (filterChassis && !car.chassis?.toLowerCase().includes(filterChassis.trim().toLowerCase())) return false;
      if (filterStockNo && !car.id?.toString().includes(filterStockNo.trim())) return false;
      
      if (globalSearch) {
        const searchString = `${car.make} ${car.model} ${car.year} ${car.chassis} ${car.features} ${car.id} ${car.bodyType || ''} ${car.location || ''}`.toLowerCase();
        if (!searchString.includes(globalSearch.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [cars, filterMake, filterBodyType, filterModel, filterYear, filterChassis, filterStockNo, globalSearch]);

  // Clean 1-page demo pagination (6 cars per page)
  const CARS_PER_PAGE = 6;
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / CARS_PER_PAGE));
  const safeActivePage = Math.min(Math.max(1, activePage), totalPages);

  const displayedCars = useMemo(() => {
    const start = (safeActivePage - 1) * CARS_PER_PAGE;
    return filteredCars.slice(start, start + CARS_PER_PAGE);
  }, [filteredCars, safeActivePage]);

  const startCount = filteredCars.length > 0 ? (safeActivePage - 1) * CARS_PER_PAGE + 1 : 0;
  const endCount = Math.min(safeActivePage * CARS_PER_PAGE, filteredCars.length);

  const whatsappInquire = (car) => {
    setInquiryModalCar(car);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col justify-between">
      <div>
        {/* Top Black Bar with Dual Contact Lines */}
        <div id="top-bar" className="bg-black text-white py-1.5 border-b border-gray-800 text-xs">
          <div className="container mx-auto max-w-[1240px] px-3 flex flex-wrap justify-between items-center gap-2 font-bold tracking-wide">
            {/* Dual Contact Lines */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs">
              {/* Line 1 */}
              <div className="flex items-center gap-1.5">
                <a 
                  id="link-topbar-call-primary"
                  href={PRIMARY_PHONE.tel} 
                  className="text-white hover:text-yellow-300 transition-colors flex items-center gap-1 font-semibold"
                  title={`Call ${PRIMARY_PHONE.display}`}
                >
                  <Phone size={12} className="text-yellow-400" />
                  <span>{PRIMARY_PHONE.display}</span>
                </a>
                <a 
                  id="link-topbar-wa-primary"
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

              {/* Line 2 */}
              <div className="flex items-center gap-1.5">
                <a 
                  id="link-topbar-call-secondary"
                  href={SECONDARY_PHONE.tel} 
                  className="text-white hover:text-yellow-300 transition-colors flex items-center gap-1 font-semibold"
                  title={`Call ${SECONDARY_PHONE.display}`}
                >
                  <Phone size={12} className="text-yellow-400" />
                  <span>{SECONDARY_PHONE.display}</span>
                </a>
                <a 
                  id="link-topbar-wa-secondary"
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

            {/* Right side: Showroom Hours & Location (clean, uncluttered customer view) */}
            <div className="text-[11px] text-gray-300 hidden md:flex items-center gap-2">
              <span className="text-yellow-400">📍</span>
              <span>Dar es Salaam, Tanzania</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-300">Mon - Sat: 8:00 AM - 6:30 PM</span>
            </div>
          </div>
        </div>

        {/* Triple-click redirect indicator toast */}
        {isAdminRedirecting && (
          <div className="fixed top-3 right-3 z-50 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl border border-gray-700 flex items-center gap-2 font-bold animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>⚡ Opening 3B MOTORS Admin Portal...</span>
          </div>
        )}

        {/* Main Header (Dealership Blue #4b6ba3) */}
        <header id="main-header" className="bg-[#4b6ba3] py-2 sm:py-3 border-b-2 border-[#3c5683]">
          <div className="container mx-auto max-w-[1240px] px-3 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
            {/* 3BrosMotor Official Logo with Triple-Click Admin Access */}
            <div id="header-brand-logo" className="flex items-center">
              <h1 className="sr-only">
                3BrosMotor - Quality Cars • Better Journeys | Premier Japanese Car Dealership & Importer in Mwanza & Dar es Salaam, Tanzania
              </h1>
              <Link 
                href="/" 
                onClick={handleLogoClick} 
                className="cursor-pointer select-none" 
                title="3B MOTORS CO. LTD (Triple-click for Admin Access)"
              >
                <Logo width={260} height={78} />
              </Link>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Contact Us button in header */}
              <Link
                id="btn-header-contact"
                href="/contact"
                className="bg-white hover:bg-yellow-400 text-[#4b6ba3] hover:text-black font-extrabold text-xs px-3.5 py-1.5 rounded shadow-sm transition flex items-center gap-1.5 border border-white"
              >
                <Phone size={13} />
                <span>Contact Us</span>
              </Link>

              {/* Official 3BrosMotor Social Accounts (Instagram, Facebook, LinkedIn, TikTok) */}
              <SocialIcons variant="header" />
            </div>
          </div>
        </header>

        {/* Main Container: On desktop (lg:) 2-column layout [210px_1fr], on mobile/tablet (grid-cols-1) where Hero Banner is shown first at top */}
        <main 
          id="main-layout-container" 
          className="container mx-auto max-w-[1240px] px-3 py-3 grid grid-cols-1 lg:grid-cols-[210px_1fr] lg:grid-rows-[max-content_1fr] gap-3 items-start"
        >
          
          {/* Top Section: Hero Banner + Search Vehicles Box
              - On Mobile/Tablet: Rendered 1st, so hero image slider is shown at top of main screen!
              - On Desktop (lg:): Placed in Column 2, Row 1 (Right side top, next to sidebar) */}
          <div id="hero-and-search-section" className="lg:col-start-2 lg:row-start-1 min-w-0 self-start">
            <div className="flex flex-col md:flex-row gap-3">
              {/* 3BrosMotor Banner Collage */}
              <HeroSlider />

              {/* SEARCH VEHICLES Box */}
              <div id="search-vehicles-sidebar-box" className="w-full md:w-[220px] flex-shrink-0 bg-[#4b6ba3] rounded-sm p-2.5 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-white font-bold text-center mb-2 text-sm tracking-wide">
                    SEARCH VEHICLES
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <select 
                      id="select-filter-make"
                      className="w-full p-1.5 border border-gray-300 rounded-sm bg-white text-gray-800"
                      value={filterMake}
                      onChange={e => { setFilterMake(e.target.value); setActivePage(1); }}
                    >
                      <option value="">Make (All)</option>
                      {uniqueMakes.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    
                    <select 
                      id="select-filter-model"
                      className="w-full p-1.5 border border-gray-300 rounded-sm bg-white text-gray-800"
                      value={filterModel}
                      onChange={e => { setFilterModel(e.target.value); setActivePage(1); }}
                    >
                      <option value="">Model (All)</option>
                      {uniqueModels.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>

                    <input 
                      id="input-filter-year"
                      type="text" 
                      placeholder="Year" 
                      className="w-full p-1.5 border border-gray-300 rounded-sm bg-white text-gray-800" 
                      value={filterYear}
                      onChange={e => { setFilterYear(e.target.value); setActivePage(1); }}
                    />

                    <input 
                      id="input-filter-stock"
                      type="text" 
                      placeholder="Search By Stock No" 
                      className="w-full p-1.5 border border-gray-300 rounded-sm bg-white text-gray-800" 
                      value={filterStockNo}
                      onChange={e => { setFilterStockNo(e.target.value); setActivePage(1); }}
                    />

                    <input 
                      id="input-filter-chassis"
                      type="text" 
                      placeholder="Search By Chassis No" 
                      className="w-full p-1.5 border border-gray-300 rounded-sm bg-white text-gray-800" 
                      value={filterChassis}
                      onChange={e => { setFilterChassis(e.target.value); setActivePage(1); }}
                    />
                  </div>
                </div>

                <div className="mt-2 space-y-1.5">
                  <button 
                    id="btn-apply-search"
                    type="button"
                    className="w-full bg-[#1c459c] hover:bg-blue-900 text-white font-bold py-1.5 border border-blue-950 rounded-sm shadow-sm transition-colors text-xs tracking-wider"
                  >
                    SEARCH
                  </button>

                  {hasActiveFilters && (
                    <button
                      id="btn-clear-filters"
                      type="button"
                      onClick={resetFilters}
                      className="w-full bg-white/90 hover:bg-white text-gray-800 text-[11px] font-semibold py-1 rounded-sm flex items-center justify-center gap-1 transition-colors"
                    >
                      <RotateCcw size={11} /> Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Left Sidebar Column (MAKES & BODY TYPES):
              - On Mobile/Tablet: Rendered 2nd, fold in scroll-down buttons that expand to display all!
              - On Desktop (lg:): Placed in Column 1, Rows 1-2 (Permanently open, exactly as before!) */}
          <aside id="sidebar-filters" className="lg:col-start-1 lg:row-start-1 lg:row-span-2 w-full lg:w-[210px] flex flex-col gap-3 self-start">
            
            {/* MAKES Panel */}
            <div id="makes-panel" className="border border-gray-300 shadow-sm">
              <button
                id="btn-toggle-mobile-makes"
                type="button"
                onClick={toggleMobileMakes}
                className="w-full bg-[#4b6ba3] hover:bg-[#3f5d91] lg:hover:bg-[#4b6ba3] text-white font-bold py-2 px-3 flex items-center justify-between text-sm tracking-wider cursor-pointer lg:cursor-default transition-colors select-none"
              >
                <div className="flex items-center gap-2 lg:mx-auto">
                  <span>MAKES</span>
                  {filterMake && (
                    <span className="lg:hidden text-[10px] bg-yellow-400 text-black font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                      {filterMake}
                    </span>
                  )}
                </div>

                {/* Mobile & Tablet Scroll Down / Fold toggle button */}
                <div className="flex items-center gap-1.5 text-xs font-normal lg:hidden">
                  <span className="text-yellow-300 font-bold text-[11px] tracking-normal">
                    {isMobileMakesOpen ? 'Click to Fold' : 'Scroll Down / View All'}
                  </span>
                  {isMobileMakesOpen ? (
                    <ChevronUp size={15} className="text-yellow-300" />
                  ) : (
                    <ChevronDown size={15} className="text-yellow-300" />
                  )}
                </div>
              </button>

              <div 
                id="makes-list-container"
                className={`${isMobileMakesOpen ? 'block' : 'hidden lg:block'} bg-[#505050] text-white text-xs max-h-[460px] lg:max-h-none overflow-y-auto`}
              >
                <button
                  id="make-filter-all"
                  type="button"
                  onClick={() => handleMakeClick('')}
                  className={`w-full text-left border-b border-gray-600 hover:bg-gray-600 cursor-pointer p-2.5 pl-3 transition-colors ${!filterMake ? 'bg-[#3e5b99] font-bold text-white' : 'text-gray-100'}`}
                >
                  All Vehicle Makes
                </button>
                {MAKES_LIST.map((makeName) => {
                  const isSelected = filterMake.toLowerCase() === makeName.toLowerCase();
                  const count = cars.filter(c => c.make.toLowerCase() === makeName.toLowerCase()).length;
                  return (
                    <button
                      key={makeName}
                      id={`make-filter-${makeName.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => handleMakeClick(makeName)}
                      className={`w-full text-left border-b border-gray-600/80 hover:bg-gray-600 cursor-pointer p-2 pl-3 flex items-center justify-between transition-colors ${isSelected ? 'bg-[#3e5b99] font-bold text-white' : 'text-gray-200'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-800 shadow-inner flex-shrink-0">
                          {makeName.slice(0, 1)}
                        </div>
                        <span>{makeName}</span>
                      </div>
                      {count > 0 && (
                        <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-gray-200">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BODY TYPES Panel matching screenshot */}
            <div id="bodytypes-panel" className="border border-gray-300 shadow-sm">
              <button
                id="btn-toggle-mobile-bodytypes"
                type="button"
                onClick={toggleMobileBodyTypes}
                className="w-full bg-[#4b6ba3] hover:bg-[#3f5d91] lg:hover:bg-[#4b6ba3] text-white font-bold py-2 px-3 flex items-center justify-between text-sm tracking-wider cursor-pointer lg:cursor-default transition-colors select-none"
              >
                <div className="flex items-center gap-2 lg:mx-auto">
                  <span>BODY TYPES</span>
                  {filterBodyType && (
                    <span className="lg:hidden text-[10px] bg-yellow-400 text-black font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                      {filterBodyType}
                    </span>
                  )}
                </div>

                {/* Mobile & Tablet Scroll Down / Fold toggle button */}
                <div className="flex items-center gap-1.5 text-xs font-normal lg:hidden">
                  <span className="text-yellow-300 font-bold text-[11px] tracking-normal">
                    {isMobileBodyTypesOpen ? 'Click to Fold' : 'Scroll Down / View All'}
                  </span>
                  {isMobileBodyTypesOpen ? (
                    <ChevronUp size={15} className="text-yellow-300" />
                  ) : (
                    <ChevronDown size={15} className="text-yellow-300" />
                  )}
                </div>
              </button>

              <div 
                id="bodytypes-list-container"
                className={`${isMobileBodyTypesOpen ? 'block' : 'hidden lg:block'} bg-white text-gray-800 text-xs max-h-[420px] lg:max-h-none overflow-y-auto`}
              >
                <button
                  id="bodytype-filter-all"
                  type="button"
                  onClick={() => handleBodyTypeClick('')}
                  className={`w-full text-left border-b border-gray-200 hover:bg-blue-50 cursor-pointer p-2.5 pl-3 transition-colors ${!filterBodyType ? 'bg-[#3e5b99] font-bold text-white hover:bg-[#3e5b99]' : 'text-gray-700'}`}
                >
                  All Body Types
                </button>
                {BODY_TYPES.map((bt) => {
                  const isSelected = filterBodyType.toLowerCase() === bt.name.toLowerCase();
                  const count = cars.filter(c => c.bodyType?.toLowerCase() === bt.name.toLowerCase()).length;
                  return (
                    <button
                      key={bt.name}
                      id={`bodytype-filter-${bt.name.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => handleBodyTypeClick(bt.name)}
                      className={`w-full text-left border-b border-gray-100 hover:bg-blue-50/70 cursor-pointer p-2 pl-3 flex items-center justify-between transition-colors ${isSelected ? 'bg-[#3e5b99] font-bold text-white hover:bg-[#3e5b99]' : 'text-gray-700'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{bt.icon}</span>
                        <span>{bt.name}</span>
                      </div>
                      {count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* Right Main Inventory Section (Yellow Search Bar + Car Table + Pagination)
              - On Mobile/Tablet: Rendered 3rd
              - On Desktop (lg:): Placed in Column 2, Row 2 */}
          <div id="main-inventory-section" className="lg:col-start-2 lg:row-start-2 min-w-0 flex flex-col self-start w-full">

            {/* Yellow Search Vehicles Bar matching screenshot */}
            <div id="global-search-bar" className="flex border border-gray-300 mb-3 h-9 bg-white shadow-sm">
              <div className="bg-[#f0c22c] px-4 flex items-center justify-center font-bold text-black border-r border-gray-300 text-xs sm:text-sm whitespace-nowrap select-none">
                Search Vehicles
              </div>
              <input 
                id="input-global-search"
                type="text" 
                placeholder="Global Search..." 
                className="flex-1 px-3 outline-none w-full text-xs sm:text-sm text-gray-800" 
                value={globalSearch}
                onChange={e => { setGlobalSearch(e.target.value); setActivePage(1); }}
              />
              {globalSearch && (
                <button
                  id="btn-clear-global-search"
                  type="button"
                  onClick={() => setGlobalSearch('')}
                  className="px-2 text-gray-400 hover:text-gray-700 text-xs"
                >
                  Clear
                </button>
              )}
              <button 
                id="btn-submit-global-search" 
                type="button" 
                className="bg-[#1c459c] w-12 flex-shrink-0 flex items-center justify-center text-white hover:bg-blue-900 transition-colors"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Table Header: All Stock ( 361 ) */}
            <div id="stock-count-header" className="bg-[#4b6ba3] text-white font-bold px-3 py-2 text-base mb-2 flex flex-row justify-between items-center">
              <span>All Stock ( {filteredCars.length} )</span>
              {hasActiveFilters && (
                <button
                  id="btn-reset-all-filters"
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-normal underline hover:text-yellow-300 flex items-center gap-1 text-white"
                >
                  <RotateCcw size={11} /> Reset filters
                </button>
              )}
            </div>

            {/* Top Pagination Controls */}
            <div id="pagination-top" className="flex flex-col sm:flex-row justify-between items-center gap-1.5 mb-1.5 text-xs text-gray-600">
              <div className="flex gap-1">
                <button 
                  id="btn-page-prev" 
                  type="button" 
                  disabled={safeActivePage <= 1}
                  onClick={() => setActivePage(p => Math.max(1, p - 1))}
                  className={`border border-gray-300 px-2.5 py-0.5 ${safeActivePage <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-100 cursor-pointer'}`}
                >
                  &laquo; Previous
                </button>
                <button 
                  id="btn-page-next" 
                  type="button" 
                  disabled={safeActivePage >= totalPages}
                  onClick={() => setActivePage(p => Math.min(totalPages, p + 1))}
                  className={`border border-gray-300 px-2.5 py-0.5 ${safeActivePage >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-100 cursor-pointer'}`}
                >
                  Next &raquo;
                </button>
              </div>
              <div className="text-center font-medium">
                Showing {startCount} to {endCount} of {filteredCars.length} results
              </div>
            </div>

            {/* Pagination Number Strip */}
            <div className="flex mb-3 text-xs flex-wrap gap-1">
              {safeActivePage > 1 && (
                <button 
                  onClick={() => setActivePage(p => Math.max(1, p - 1))}
                  className="border border-gray-300 bg-white px-2 py-0.5 text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  &lsaquo;
                </button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button 
                  key={n}
                  onClick={() => setActivePage(n)}
                  className={`border border-gray-300 px-2.5 py-0.5 font-semibold cursor-pointer ${safeActivePage === n ? 'bg-[#4b6ba3] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                  {n}
                </button>
              ))}
              {safeActivePage < totalPages && (
                <button 
                  onClick={() => setActivePage(p => Math.min(totalPages, p + 1))}
                  className="border border-gray-300 bg-white px-2 py-0.5 text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  &rsaquo;
                </button>
              )}
            </div>

            {/* Vehicle Table */}
            <div id="vehicle-inventory-table" className="w-full border border-gray-300 shadow-sm">
              {/* Table Head (Steel Blue) */}
              <div className="hidden md:flex bg-[#4b6ba3] text-white font-bold text-xs text-center border-b border-gray-400">
                <div className="w-36 p-2 border-r border-gray-400 flex flex-col justify-center">Chassis No<br/>Location</div>
                <div className="w-32 p-2 border-r border-gray-400 flex items-center justify-center">Photo</div>
                <div className="w-20 p-2 border-r border-gray-400 flex items-center justify-center">Price</div>
                <div className="flex-1 p-2 border-r border-gray-400 flex items-center justify-center">Make/Model</div>
                <div className="w-24 p-2 border-r border-gray-400 flex flex-col justify-center">Year<br/>Engine</div>
                <div className="w-24 p-2 border-r border-gray-400 flex items-center justify-center">Mileage</div>
                <div className="w-20 p-2 flex flex-col justify-center">Trans<br/>Steering</div>
              </div>

              {/* Table Body */}
              {!isLoaded ? (
                <div className="p-8 text-center text-gray-500">Loading inventory...</div>
              ) : filteredCars.length === 0 ? (
                <div id="empty-state-notice" className="p-8 text-center text-gray-500 bg-white">
                  <p className="font-semibold text-gray-700">No vehicles match your search criteria.</p>
                  <button
                    id="btn-empty-reset"
                    type="button"
                    onClick={resetFilters}
                    className="mt-3 text-xs text-blue-600 hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : displayedCars.map((car, index) => (
                <div 
                  key={car.id} 
                  id={`car-row-${car.id}`}
                  className={`flex flex-col md:flex-row border-b border-gray-300 text-xs hover:bg-amber-100/40 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#fcf8e3]'}`}
                >
                  
                  {/* --- MOBILE VIEW CARD --- */}
                  <div className="flex flex-col md:hidden p-3 gap-2">
                    <div className="flex justify-between items-start">
                      <div 
                        onClick={() => setDetailModalCar(car)}
                        className="cursor-pointer group flex-1 pr-2"
                      >
                        <div className="text-blue-700 group-hover:underline font-bold text-base leading-tight">
                          {car.make} <span className="text-blue-600">{car.model}</span>
                        </div>
                        <div className="text-gray-600 text-xs mt-0.5">{car.year} • {car.engine} • {car.location}</div>
                      </div>
                      <button
                        onClick={() => whatsappInquire(car)}
                        className="flex items-center gap-1 bg-[#25D366] hover:bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-full text-xs shadow flex-shrink-0 cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <span className="text-sm">💬</span> WhatsApp
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <div 
                        onClick={() => setDetailModalCar(car)}
                        className="w-1/3 max-w-[120px] aspect-[4/3] bg-gray-200 rounded overflow-hidden flex-shrink-0 relative cursor-pointer group shadow-xs"
                      >
                        {car.photo ? (
                          <Image 
                            src={car.photo} 
                            alt={`${car.make} ${car.model}`} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-[10px] text-gray-500 font-bold bg-gray-200 w-full h-full flex items-center justify-center">No Photo</div>
                        )}
                        {/* Multiple photos badge indicator */}
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                          <Layers size={10} className="text-yellow-400" />
                          <span>{getVehicleImages(car).length}</span>
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                        <div><span className="font-semibold text-gray-500">Chassis:</span><br/>{car.chassis}</div>
                        <div><span className="font-semibold text-gray-500">Mileage:</span><br/>{car.mileage}</div>
                        <div><span className="font-semibold text-gray-500">Color:</span><br/><span className="text-red-600 font-bold">{car.color}</span></div>
                        <div><span className="font-semibold text-gray-500">Status:</span><br/><span className="text-emerald-700 font-bold">{car.status || 'In Stock'}</span></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 text-xs bg-white/70 p-1.5 rounded border border-gray-200 text-gray-700">
                      <div className="truncate flex-1">
                        <span className="font-semibold text-gray-600">Features:</span> {car.features}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDetailModalCar(car)}
                        className="text-[#4b6ba3] hover:underline font-bold text-[11px] flex items-center gap-1 flex-shrink-0 cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Photos & Specs</span>
                      </button>
                    </div>
                  </div>

                  {/* --- DESKTOP VIEW ROW (EXACT REPLICA OF SCREENSHOT) --- */}
                  <div className="hidden md:flex w-full items-stretch">
                    
                    {/* 1. Chassis No & Location */}
                    <div className="w-36 border-r border-gray-300 flex flex-col items-center justify-center p-2 text-center">
                      <div className="text-gray-800 font-medium text-xs break-all">{car.chassis}</div>
                      <div className="w-4/5 border-t border-red-500 my-1"></div>
                      <div className="text-gray-600 text-[11px] font-semibold">{car.location}</div>
                    </div>

                    {/* 2. Photo with Multiple Angles Click Trigger */}
                    <div 
                      onClick={() => setDetailModalCar(car)}
                      className="w-32 border-r border-gray-300 p-1 flex items-center justify-center cursor-pointer group"
                      title="Click to view all photos and specifications"
                    >
                      <div className="w-full aspect-[4/3] bg-gray-200 rounded-sm flex items-center justify-center overflow-hidden relative border border-gray-200 group-hover:border-[#4b6ba3]">
                        {car.photo ? (
                          <Image 
                            src={car.photo} 
                            alt={`${car.make} ${car.model}`} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-200" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-xs text-gray-500 font-bold">No Photo</div>
                        )}
                        {/* Multiple photos badge indicator */}
                        <div className="absolute bottom-1 right-1 bg-black/80 group-hover:bg-[#4b6ba3] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors shadow">
                          <Layers size={10} className="text-yellow-400 group-hover:text-white" />
                          <span>{getVehicleImages(car).length} Photos</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Inquire / WhatsApp Button */}
                    <div className="w-20 border-r border-gray-300 flex flex-col items-center justify-center p-2">
                      <button
                        id={`btn-whatsapp-${car.id}`}
                        type="button"
                        onClick={() => whatsappInquire(car)}
                        title="Inquire on WhatsApp"
                        className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center text-white shadow-md hover:scale-110 transition-all cursor-pointer group"
                      >
                        {/* WhatsApp SVG Icon */}
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                      </button>
                      <div className="text-[10px] text-emerald-600 font-bold mt-1 text-center">
                        INQUIRE
                      </div>
                    </div>

                    {/* 4. Make/Model Details with Click Trigger */}
                    <div className="flex-1 border-r border-gray-300 p-2 text-xs">
                      <div 
                        onClick={() => setDetailModalCar(car)}
                        className="text-blue-700 hover:underline font-bold text-sm mb-0.5 cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>{car.make}</span> <span className="text-blue-600">{car.model}</span>
                        <span className="text-[10px] bg-blue-50 text-[#4b6ba3] px-1.5 py-0.2 rounded border border-blue-200 font-normal">
                          View Photos &rarr;
                        </span>
                      </div>
                      <div className="font-bold text-red-600 mb-0.5">
                        Color: {car.color}
                      </div>
                      <div className="text-gray-700 mb-0.5">
                        {car.fuel} fuel type, {car.doors} doors, {car.seats} seats
                      </div>
                      <div className="text-gray-600 line-clamp-2 text-[11px]">
                        {car.features}
                      </div>
                    </div>

                    {/* 5. Year / Engine */}
                    <div className="w-24 border-r border-gray-300 flex flex-col items-center justify-center p-2 text-center">
                      <div className="text-gray-800 font-bold">{car.year}</div>
                      <div className="w-3/4 border-t border-red-500 my-1"></div>
                      <div className="text-gray-700 text-[11px]">{car.engine}</div>
                    </div>

                    {/* 6. Mileage */}
                    <div className="w-24 border-r border-gray-300 flex items-center justify-center p-2 text-center text-gray-800 font-medium">
                      {car.mileage}
                    </div>

                    {/* 7. Trans / Steering */}
                    <div className="w-20 flex flex-col items-center justify-center p-2 text-center">
                      <div className="text-gray-800 font-semibold">{car.trans}</div>
                      <div className="w-3/4 border-t border-red-500 my-1"></div>
                      <div className="text-gray-700 text-[11px]">{car.steering}</div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Pagination Controls */}
            <div id="pagination-bottom" className="flex flex-col sm:flex-row justify-between items-center gap-1.5 mt-3 mb-1.5 text-xs text-gray-600">
              <div className="flex gap-1">
                <button 
                  id="btn-page-prev-bottom" 
                  type="button" 
                  disabled={safeActivePage <= 1}
                  onClick={() => setActivePage(p => Math.max(1, p - 1))}
                  className={`border border-gray-300 px-2.5 py-0.5 ${safeActivePage <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-100 cursor-pointer'}`}
                >
                  &laquo; Previous
                </button>
                <button 
                  id="btn-page-next-bottom" 
                  type="button" 
                  disabled={safeActivePage >= totalPages}
                  onClick={() => setActivePage(p => Math.min(totalPages, p + 1))}
                  className={`border border-gray-300 px-2.5 py-0.5 ${safeActivePage >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-100 cursor-pointer'}`}
                >
                  Next &raquo;
                </button>
              </div>
              <div className="text-center font-medium">
                Showing {startCount} to {endCount} of {filteredCars.length} results
              </div>
            </div>

            <div className="flex mb-6 text-xs flex-wrap gap-1">
              {safeActivePage > 1 && (
                <button 
                  onClick={() => setActivePage(p => Math.max(1, p - 1))}
                  className="border border-gray-300 bg-white px-2 py-0.5 text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  &lsaquo;
                </button>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button 
                  key={n}
                  onClick={() => setActivePage(n)}
                  className={`border border-gray-300 px-2.5 py-0.5 font-semibold cursor-pointer ${safeActivePage === n ? 'bg-[#4b6ba3] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                  {n}
                </button>
              ))}
              {safeActivePage < totalPages && (
                <button 
                  onClick={() => setActivePage(p => Math.min(totalPages, p + 1))}
                  className="border border-gray-300 bg-white px-2 py-0.5 text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  &rsaquo;
                </button>
              )}
            </div>

          </div>
        </main>

        {/* High-ranking SEO Authority & FAQ Section */}
        {/* <DealershipSeoSection /> */}
      </div>

      {/* FOOTER matching screenshot */}
      <footer id="main-footer" className="mt-8">
        {/* Copyright & Follow Us Bar */}
        <div className="bg-[#2a3854] text-white py-2 text-xs border-t border-gray-400">
          <div className="container mx-auto max-w-[1240px] px-3 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              &copy; {new Date().getFullYear()} 3BROS MOTOR. All Rights Reserved.
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-200">Follow Us</span>
              <SocialIcons variant="footer" />
            </div>
          </div>
        </div>

        {/* Bottom Detailed Info Box matching screenshot */}
        <div className="bg-[#191d24] text-white py-6 border-t border-gray-800">
          <div className="container mx-auto max-w-[1240px] px-3 flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Left: 3BrosMotor Logo */}
            <div className="flex items-center">
              <Logo width={220} height={70} />
            </div>

            {/* Middle: Dealership Information */}
            <div className="text-xs space-y-1 text-center md:text-left">
              <div className="font-bold text-sm text-white uppercase tracking-wide">3BROS MOTOR</div>
              <div className="text-gray-300">
                <span className="text-blue-400 font-semibold">Location:</span> {DEALERSHIP_INFO.address}
              </div>
              <div className="text-gray-300">
                <span className="text-blue-400 font-semibold">Email:</span> {DEALERSHIP_INFO.email}
              </div>
              <div className="text-gray-300 flex flex-wrap gap-x-3 gap-y-1 justify-center md:justify-start pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="text-gray-400">Tel:</span>
                  <a href={PRIMARY_PHONE.tel} className="hover:underline text-white font-medium">{PRIMARY_PHONE.display}</a>
                  <a href={PRIMARY_PHONE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 ml-0.5" title={`WhatsApp ${PRIMARY_PHONE.display}`}>💬</a>
                </span>
                <span className="text-gray-600 hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span className="text-gray-400">Tel:</span>
                  <a href={SECONDARY_PHONE.tel} className="hover:underline text-white font-medium">{SECONDARY_PHONE.display}</a>
                  <a href={SECONDARY_PHONE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 ml-0.5" title={`WhatsApp ${SECONDARY_PHONE.display}`}>💬</a>
                </span>
              </div>
            </div>

            {/* Right: Contact Us Button */}
            <div>
              <Link
                id="btn-footer-contact"
                href="/contact"
                className="bg-white hover:bg-yellow-400 hover:text-black text-gray-900 font-bold px-5 py-2 rounded shadow text-xs uppercase tracking-wider transition inline-block border border-gray-300"
              >
                Contact Us Page
              </Link>
            </div>

          </div>
        </div>
      </footer>

      {/* Vehicle Inquiry Choice Modal (Calls & WhatsApp on Both Lines) */}
      <VehicleInquiryModal 
        car={inquiryModalCar} 
        onClose={() => setInquiryModalCar(null)} 
      />

      {/* Vehicle Multi-Image Gallery & Full Details Modal */}
      <VehicleDetailModal
        car={detailModalCar}
        onClose={() => setDetailModalCar(null)}
        onOpenInquiry={(car) => {
          setDetailModalCar(null);
          setInquiryModalCar(car);
        }}
      />
    </div>
  );
}
