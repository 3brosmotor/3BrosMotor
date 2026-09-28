'use client';

import { useState } from 'react';
import { Search, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

export default function DateFilterBar({ onFilterChange }) {
  // Matching screenshot dates: From 08/23/2026 To 09/23/2026
  const [fromDate, setFromDate] = useState('2026-08-23');
  const [toDate, setToDate] = useState('2026-09-23');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    if (onFilterChange) {
      onFilterChange({ fromDate, toDate });
    }
    setTimeout(() => setIsSearching(false), 300);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6">
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3 sm:gap-4 lg:gap-6">
        
        {/* From Date */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-bold text-gray-700 whitespace-nowrap">
            From Date:
          </label>
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white shadow-xs focus:ring-2 focus:ring-[#00a299] focus:border-[#00a299] outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* To Date */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label className="text-xs sm:text-sm font-bold text-gray-700 whitespace-nowrap">
            To Date:
          </label>
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-gray-800 bg-white shadow-xs focus:ring-2 focus:ring-[#00a299] focus:border-[#00a299] outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Search Button matching the teal-cyan button in screenshot */}
        <button
          type="submit"
          disabled={isSearching}
          className="w-full sm:w-auto bg-[#00a299] hover:bg-[#008f87] active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-2 rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span>Search</span>
          )}
        </button>

        {/* Quick presets for convenience */}
        <div className="hidden xl:flex items-center gap-2 ml-auto text-xs text-gray-500">
          <span className="font-semibold text-gray-400">Quick:</span>
          <button
            type="button"
            onClick={() => {
              setFromDate('2026-09-01');
              setToDate('2026-09-23');
            }}
            className="hover:text-[#00a299] hover:underline"
          >
            This Month
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setFromDate('2026-08-23');
              setToDate('2026-09-23');
            }}
            className="hover:text-[#00a299] hover:underline font-bold text-[#00a299]"
          >
            Last 30 Days
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setFromDate('2026-01-01');
              setToDate('2026-09-23');
            }}
            className="hover:text-[#00a299] hover:underline"
          >
            Year to Date
          </button>
        </div>
      </form>
    </div>
  );
}
