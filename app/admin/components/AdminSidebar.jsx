'use client';

import { useState } from 'react';
import Link from 'next/link';
import SidebarLogo from './SidebarLogo';
import { 
  Gauge, 
  Plus, 
  Car, 
  DollarSign, 
  SlidersHorizontal, 
  Calendar, 
  Bookmark, 
  Bell, 
  FileText, 
  Settings, 
  ChevronRight, 
  ChevronDown, 
  Globe, 
  LogOut,
  CheckCircle2,
  X
} from 'lucide-react';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed,
  vehicleCount = 0,
  calendarCount = 0,
  remindersCount = 0,
  notesCount = 0,
  onLogout,
  isMobileOpen = false,
  setIsMobileOpen
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Gauge, badge: null },
    { id: 'add-vehicle', label: 'Add Vehicle', icon: Plus, badge: 'New' },
    { id: 'vehicles', label: 'Vehicles', icon: Car, badge: vehicleCount > 0 ? vehicleCount : null },
    { id: 'sold-vehicles', label: 'Sold Vehicles', icon: CheckCircle2, badge: null },
    { id: 'expenses', label: 'Vehicle Expenses', icon: DollarSign, badge: null },
    { id: 'management', label: 'Vehicles Management', icon: SlidersHorizontal, badge: null },
    { id: 'calendar', label: 'Calendar', icon: Calendar, badge: calendarCount > 0 ? calendarCount : null },
    { id: 'reminders', label: 'Reminders', icon: Bookmark, badge: remindersCount > 0 ? remindersCount : null },
    { id: 'notes', label: 'Notes', icon: Bell, badge: notesCount > 0 ? notesCount : null },
    { id: 'documents', label: 'Documents', icon: FileText, badge: null },
  ];

  const settingsSubItems = [
    { id: 'settings-makes', label: 'Makes & Models' },
    { id: 'settings-bodytypes', label: 'Body Types' },
    { id: 'settings-locations', label: 'Yard Locations' },
    { id: 'settings-currency', label: 'Currency & Rates' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#ffffff] border-r border-gray-200/90 transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl lg:shadow-none
          w-72 max-w-[85vw] ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Header inside sidebar with Logo, Desktop Toggle & Mobile Close */}
        <div>
          <div className="h-14 sm:h-16 px-3 sm:px-4 border-b border-gray-100 flex items-center justify-between">
            <Link href="/admin" onClick={() => handleNavClick('dashboard')} className="flex items-center">
              <SidebarLogo collapsed={isCollapsed} />
            </Link>

            <div className="flex items-center gap-1">
              {/* Desktop Collapse/Expand toggle switch */}
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                className="hidden lg:flex w-7 h-4 rounded-full bg-gray-200 hover:bg-gray-300 relative items-center px-0.5 cursor-pointer transition"
              >
                <div 
                  className={`w-3 h-3 rounded-full bg-gray-700 transition-transform ${
                    isCollapsed ? 'translate-x-3 bg-red-600' : 'translate-x-0'
                  }`}
                />
              </button>

              {/* Mobile Close X button */}
              <button
                type="button"
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className="lg:hidden p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
                aria-label="Close Navigation"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="p-2 sm:p-3 space-y-0.5 sm:space-y-1 overflow-y-auto max-h-[calc(100vh-125px)] text-xs sm:text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-2.5 sm:px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer group text-left ${
                    isActive 
                      ? 'bg-gray-100 text-gray-950 font-bold shadow-xs' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`flex-shrink-0 transition-colors ${
                      isActive ? 'text-black' : 'text-gray-700 group-hover:text-black'
                    }`} 
                  />

                  {(!isCollapsed || isMobileOpen) && (
                    <span className="flex-1 truncate tracking-tight text-xs sm:text-[13px]">
                      {item.label}
                    </span>
                  )}

                  {(!isCollapsed || isMobileOpen) && item.badge && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      item.badge === 'New' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Vehicle Settings with Expandable Submenu */}
            <div>
              <button
                type="button"
                onClick={() => {
                  if (isCollapsed) setIsCollapsed(false);
                  setIsSettingsOpen(!isSettingsOpen);
                  setActiveTab('settings');
                }}
                title={isCollapsed ? "Vehicle Settings" : undefined}
                className={`w-full flex items-center gap-3 px-2.5 sm:px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer text-left ${
                  activeTab.startsWith('settings') 
                    ? 'bg-gray-100 text-gray-950 font-bold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Settings size={18} className="flex-shrink-0 text-gray-700" />
                
                {(!isCollapsed || isMobileOpen) && (
                  <>
                    <span className="flex-1 truncate tracking-tight text-xs sm:text-[13px]">Vehicle Settings</span>
                    {isSettingsOpen ? (
                      <ChevronDown size={14} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={14} className="text-gray-500" />
                    )}
                  </>
                )}
              </button>

              {/* Sub-items */}
              {(!isCollapsed || isMobileOpen) && isSettingsOpen && (
                <div className="pl-7 sm:pl-8 pr-2 py-1 space-y-0.5">
                  {settingsSubItems.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleNavClick(sub.id)}
                      className={`w-full text-left text-xs px-2 py-1 rounded transition ${
                        activeTab === sub.id 
                          ? 'bg-blue-50 text-[#4b6ba3] font-bold' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      • {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom Actions: View Live Website & Sign Out */}
        <div className="p-2.5 sm:p-3 border-t border-gray-100 space-y-1 bg-gray-50/50">
          <Link
            href="/"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            title={isCollapsed ? "View Live Website" : undefined}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-white hover:text-gray-900 transition"
          >
            <Globe size={15} className="text-gray-500" />
            {(!isCollapsed || isMobileOpen) && <span>View Live Site</span>}
          </Link>

          <button
            type="button"
            onClick={onLogout}
            title={isCollapsed ? "Log Out" : undefined}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut size={15} className="text-red-500" />
            {(!isCollapsed || isMobileOpen) && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
