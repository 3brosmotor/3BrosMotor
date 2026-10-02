'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardView from './components/DashboardView';
import AddVehicleView from './components/AddVehicleView';
import VehiclesView from './components/VehiclesView';
import SoldVehiclesView from './components/SoldVehiclesView';
import ExpensesView from './components/ExpensesView';
import VehiclesManagementView from './components/VehiclesManagementView';
import CalendarView from './components/CalendarView';
import RemindersView from './components/RemindersView';
import NotesView from './components/NotesView';
import DocumentsView from './components/DocumentsView';
import SettingsView from './components/SettingsView';

import { 
  getStoredCars, 
  saveCar, 
  updateCar, 
  deleteCar, 
  INVENTORY_EVENT,
  initCarStoreSync
} from '../lib/carStore';

import {
  getExpenses,
  addExpense,
  deleteExpense,
  getSoldVehicles,
  addSoldVehicle,
  updateSoldVehicle,
  deleteSoldVehicle,
  getCalendarEvents,
  addCalendarEvent,
  deleteCalendarEvent,
  getReminders,
  toggleReminder,
  addReminder,
  deleteReminder,
  getNotes,
  addNote,
  deleteNote,
  getDealershipSettings,
  initAdminStoreSync,
  ADMIN_EVENT
} from '../lib/adminStore';

import { 
  isUserAuthenticated, 
  authenticateAdmin, 
  authenticateWithFirebaseEmail, 
  authenticateWithFirebaseGoogle,
  logoutAdmin, 
  subscribeToAuthChanges,
  getAdminUser,
  DEMO_ADMIN_CREDENTIALS 
} from '../lib/auth';
import { ShieldCheck, LogIn, Lock, CheckCircle2, Car } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  // Authentication & Layout States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data States
  const [cars, setCars] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [soldList, setSoldList] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [adminSettings, setAdminSettings] = useState(() => getDealershipSettings());

  // Login form state (if unauthenticated fallback)
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Load all admin data
  const refreshAllData = () => {
    setCars(getStoredCars());
    setExpenses(getExpenses());
    setSoldList(getSoldVehicles());
    setCalendarEvents(getCalendarEvents());
    setReminders(getReminders());
    setNotes(getNotes());
    setAdminSettings(getDealershipSettings());
  };

  useEffect(() => {
    // Check initial authentication with 24-hour expiry enforcement
    const authStatus = isUserAuthenticated();
    if (authStatus) {
      setIsAuthenticated(true);
      initCarStoreSync();
      initAdminStoreSync();
      refreshAllData();
    } else {
      setIsAuthenticated(false);
    }

    // Periodic 24-hour session validation (checks every 30 seconds & whenever browser tab regains focus)
    const validateSession = () => {
      if (!isUserAuthenticated()) {
        setIsAuthenticated(false);
      }
    };

    const sessionTimer = setInterval(validateSession, 30000);
    window.addEventListener('focus', validateSession);

    // Subscribe to real-time Firebase Auth state updates
    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      if (user && isUserAuthenticated()) {
        setIsAuthenticated(true);
        initCarStoreSync();
        initAdminStoreSync();
        refreshAllData();
      } else {
        setIsAuthenticated(false);
      }
    });

    setIsCheckingAuth(false);

    // Listen to inventory and admin store updates
    const handleInvUpdate = () => setCars(getStoredCars());
    const handleAdminUpdate = () => {
      setExpenses(getExpenses());
      setSoldList(getSoldVehicles());
      setCalendarEvents(getCalendarEvents());
      setReminders(getReminders());
      setNotes(getNotes());
      setAdminSettings(getDealershipSettings());
    };

    window.addEventListener(INVENTORY_EVENT, handleInvUpdate);
    window.addEventListener(ADMIN_EVENT, handleAdminUpdate);

    return () => {
      clearInterval(sessionTimer);
      window.removeEventListener('focus', validateSession);
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
      window.removeEventListener(INVENTORY_EVENT, handleInvUpdate);
      window.removeEventListener(ADMIN_EVENT, handleAdminUpdate);
    };
  }, []);

  // Handlers for Inventory
  const handleSaveNewCar = (carData) => {
    saveCar(carData);
    setActiveTab('vehicles');
  };

  const handleUpdateCar = (carData) => {
    updateCar(carData);
  };

  const handleDeleteCar = (id, carName) => {
    if (confirm(`Are you sure you want to remove ${carName || 'this vehicle'} from active stock?`)) {
      deleteCar(id);
    }
  };

  const handleMarkSold = (car) => {
    const salePrice = Number(String(car.price).replace(/[^0-9]/g, '')) || 25000;
    const purchaseCost = Math.round(salePrice * 0.82);
    
    addSoldVehicle({
      carId: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      chassis: car.chassis,
      customerName: 'Showroom Client',
      customerPhone: '+255 7XX XXX XXX',
      salePrice: salePrice,
      purchaseCost: purchaseCost,
      profit: salePrice - purchaseCost,
      saleDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer'
    });

    deleteCar(car.id);
    setActiveTab('sold-vehicles');
  };

  // Handlers for Expenses
  const handleAddExpense = (expenseData) => {
    addExpense(expenseData);
  };

  const handleDeleteExpense = (id) => {
    deleteExpense(id);
  };

  // Handlers for Sales
  const handleAddSold = (saleData) => {
    addSoldVehicle(saleData);
  };

  const handleUpdateSold = (saleData) => {
    updateSoldVehicle(saleData);
  };

  const handleDeleteSold = (id) => {
    deleteSoldVehicle(id);
  };

  // Handlers for Calendar
  const handleAddEvent = (evtData) => {
    addCalendarEvent(evtData);
  };

  const handleDeleteEvent = (id) => {
    deleteCalendarEvent(id);
  };

  // Handlers for Reminders
  const handleToggleReminder = (id) => {
    toggleReminder(id);
  };

  const handleAddReminder = (remData) => {
    addReminder(remData);
  };

  const handleDeleteReminder = (id) => {
    deleteReminder(id);
  };

  // Handlers for Notes
  const handleAddNote = (noteData) => {
    addNote(noteData);
  };

  const handleDeleteNote = (id) => {
    deleteNote(id);
  };

  // Logout Handler
  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  // Handle Manual Login
  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await authenticateWithFirebaseEmail(loginUsername, loginPassword);
    if (res.success) {
      setIsAuthenticated(true);
      refreshAllData();
    } else {
      setLoginError(res.error || 'Authentication failed');
    }
  };

  // If loading or unauthenticated
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#3e68f3] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-gray-500">Loading 3BrosMotor .LTD Dealership Portal...</span>
        </div>
      </div>
    );
  }

  // If logged out, render clean login card
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Logo width={230} height={72} variant="light" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">3BrosMotor .LTD</h1>
            <p className="text-xs text-gray-500 mt-1">Authorized Dealership Management Portal</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {loginError}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                placeholder="admin@3brosmotor.com"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#111827] hover:bg-black text-white font-bold py-3 rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Main Content View Switcher
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            cars={cars}
            setActiveTab={setActiveTab}
            expensesCount={expenses.length}
            salesCount={soldList.length}
            purchasesCount={0}
          />
        );

      case 'add-vehicle':
        return (
          <AddVehicleView
            onSaveCar={handleSaveNewCar}
            onCancel={() => setActiveTab('dashboard')}
          />
        );

      case 'vehicles':
        return (
          <VehiclesView
            cars={cars}
            onDeleteCar={handleDeleteCar}
            onUpdateCar={handleUpdateCar}
            onMarkSold={handleMarkSold}
            onAddNew={() => setActiveTab('add-vehicle')}
          />
        );

      case 'sold-vehicles':
        return (
          <SoldVehiclesView
            soldList={soldList}
            onAddSold={handleAddSold}
            onUpdateSold={handleUpdateSold}
            onDeleteSold={handleDeleteSold}
          />
        );

      case 'expenses':
        return (
          <ExpensesView
            expensesList={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );

      case 'management':
        return (
          <VehiclesManagementView
            cars={cars}
            onUpdateCar={handleUpdateCar}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            events={calendarEvents}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );

      case 'reminders':
        return (
          <RemindersView
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        );

      case 'notes':
        return (
          <NotesView
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        );

      case 'documents':
        return <DocumentsView />;

      case 'settings':
      case 'settings-makes':
      case 'settings-bodytypes':
      case 'settings-locations':
      case 'settings-currency':
        return <SettingsView subTab={activeTab} />;

      default:
        return (
          <DashboardView
            cars={cars}
            setActiveTab={setActiveTab}
            expensesCount={expenses.length}
            salesCount={soldList.length}
            purchasesCount={0}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-gray-900 font-sans flex">
      {/* 1. Left Sidebar Navigation matching screenshot */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        vehicleCount={cars.length}
        calendarCount={calendarEvents.length}
        remindersCount={reminders.length}
        notesCount={notes.length}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* 2. Main Content Canvas */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Header bar with greeting "Hi, Hammad Riaz", mobile menu, fullscreen, globe, avatar */}
        <div className="sticky top-0 z-30 bg-[#f4f6f9]/80 backdrop-blur-md border-b border-gray-200/60">
          <AdminHeader
            adminName={adminSettings?.directorName || "Hammad Riaz"}
            adminAvatar={adminSettings?.adminAvatar}
            onLogout={handleLogout}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />
        </div>

        {/* Dynamic Body Content */}
        <main className="p-3 sm:p-5 lg:p-7 flex-1">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
