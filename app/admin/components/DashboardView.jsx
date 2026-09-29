'use client';

import Link from 'next/link';
import Image from 'next/image';
import DateFilterBar from './DateFilterBar';
import DashboardCards from './DashboardCards';
import StockChart from './StockChart';
import { Plus, ArrowRight, Eye, Tag, Calendar, MapPin } from 'lucide-react';

export default function DashboardView({ 
  cars = [], 
  setActiveTab,
  expensesCount = 0,
  salesCount = 0,
  purchasesCount = 0
}) {
  const latestArrivals = cars.slice(0, 6);
  const inTransitCount = cars.filter(c => c.status === 'In Transit').length;
  const inYardCount = cars.filter(c => !c.status || c.status === 'Available' || c.status === 'In Stock').length;

  return (
    <div>
      {/* 1. Date Range Search Filter Bar */}
      <DateFilterBar />

      {/* 2. The 4 Signature KPI Cards matching screenshot */}
      <DashboardCards
        purchaseCount={purchasesCount}
        expensesCount={expensesCount}
        salesCount={salesCount}
        vehiclesCount={cars.length}
        onCardClick={(tab) => setActiveTab(tab)}
      />

      {/* 3. STOCK CHART matching screenshot */}
      <StockChart cars={cars} />

      {/* 4. Latest Fleet Arrivals & Quick Dealership Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Latest Stock Inflow Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 sm:mb-4 gap-2 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm tracking-wide">
                RECENT FLEET ADDITIONS
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500">
                Latest vehicles logged into 3B MOTORS stock
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('vehicles')}
              className="text-xs font-bold text-[#4b6ba3] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>View All {cars.length} Vehicles</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto -mx-3.5 sm:mx-0 px-3.5 sm:px-0">
            <table className="w-full text-left text-xs min-w-135">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                  <th className="py-2.5 px-3">Vehicle</th>
                  <th className="py-2.5 px-3">Chassis No.</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {latestArrivals.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-2.5 px-3 flex items-center gap-2.5">
                      <div className="w-10 h-7 rounded overflow-hidden relative bg-gray-100 shrink-0 border border-gray-200">
                        <Image 
                          src={car.photo} 
                          alt={car.model} 
                          fill 
                          className="object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {car.year} {car.make} {car.model}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {car.bodyType} • {car.fuel}
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-gray-600 text-[11px]">
                      {car.chassis}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 flex items-center gap-1">
                      <MapPin size={11} className="text-gray-400" />
                      <span>{car.location || 'Mwanza'}</span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-gray-900 font-mono">
                      ${Number(String(car.price).replace(/[^0-9]/g, '')).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        car.status === 'In Transit' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {car.status || 'In Stock'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveTab('vehicles')}
                        className="text-gray-500 hover:text-black font-semibold text-[11px] underline cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations Panel */}
        <div className="space-y-4">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 sm:p-5">
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm tracking-wide mb-3">
              QUICK ACTIONS
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveTab('add-vehicle')}
                className="w-full bg-[#111827] hover:bg-black text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Plus size={16} />
                <span>Add New Vehicle to Stock</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('expenses')}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Tag size={15} className="text-gray-600" />
                <span>Log Vehicle Clearance & Transport</span>
              </button>

              <Link
                href="/"
                className="w-full bg-blue-50 hover:bg-blue-100 text-[#4b6ba3] font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition"
              >
                <Eye size={15} />
                <span>Open Public Vehicle Catalog</span>
              </Link>
            </div>
          </div>

          {/* Dealership Yard Location Summary */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-3.5 sm:p-5 text-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                Fleet Distribution
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
                {cars.length} {cars.length === 1 ? 'Unit' : 'Units'}
              </span>
            </div>
            <div className="text-sm font-bold mt-1">3BrosMotor .LTD</div>
            <div className="text-xs text-gray-300 mt-2 space-y-1.5">
              <div className="flex justify-between items-center">
                <span>📍 Showroom Yard / In Stock:</span>
                <strong className="text-white">{inYardCount} {inYardCount === 1 ? 'Unit' : 'Units'}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span>🚢 Port / In Transit:</span>
                <strong className="text-amber-400">{inTransitCount} {inTransitCount === 1 ? 'Unit' : 'Units'}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <span>🇯🇵 Japan USS Auction Pipeline:</span>
                <strong className="text-emerald-400">3 Pending</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
