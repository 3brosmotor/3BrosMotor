'use client';

import { useState } from 'react';
import { FileText, Download, Eye, Search, Plus, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function DocumentsView() {
  const [searchTerm, setSearchTerm] = useState('');

  const sampleDocuments = [
    { id: 'doc-1', title: 'Bill of Lading: MSC Nicole (5 Units)', type: 'Bill of Lading', chassis: 'Multiple', date: '2026-09-18', size: '2.4 MB', authority: 'MSC Line / TPA' },
    { id: 'doc-2', title: 'TRA Single Administrative Document (SAD) - Hilux', type: 'Customs Declaration', chassis: 'GUN125-3940215', date: '2026-09-15', size: '1.1 MB', authority: 'Tanzania Revenue Authority' },
    { id: 'doc-3', title: 'JEVIC Pre-Export Roadworthiness Certificate - Prado', type: 'Inspection', chassis: 'GDJ150-0042189', date: '2026-09-10', size: '850 KB', authority: 'JEVIC Japan / TBS' },
    { id: 'doc-4', title: 'Commercial Export Invoice - SCANIA R450', type: 'Invoice', chassis: 'YS2R4X2000-5421', date: '2026-09-08', size: '640 KB', authority: 'Japan Auto Shippers' },
    { id: 'doc-5', title: 'Vehicle Sales Deed & Ownership Transfer (Mr. Mwita)', type: 'Sales Agreement', chassis: 'GDJ150-1092834', date: '2026-09-05', size: '1.8 MB', authority: '3B MOTORS Legal' },
  ];

  const filtered = sampleDocuments.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.chassis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (doc) => {
    alert(`Downloading ${doc.title} (${doc.size}). Verified authentic document copy.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FileText size={22} className="text-blue-600" />
            <span>Vehicle Import Documents & Legal Records</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Bill of Lading (BL), JEVIC export inspection, TRA Customs clearance certificates and contracts
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Document upload modal: Upload Bill of Lading or JEVIC certificate')}
          className="bg-[#111827] hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search document by title, vehicle chassis, or document type (BL, TRA, JEVIC)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#4b6ba3]"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
              <th className="py-3 px-4">Document Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Chassis Number</th>
              <th className="py-3 px-4">Issuing Authority</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">File Size</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                  <FileSpreadsheet size={16} className="text-red-600 flex-shrink-0" />
                  <span>{doc.title}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-semibold text-[10px]">
                    {doc.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-gray-600 text-[11px]">
                  {doc.chassis}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {doc.authority}
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {doc.date}
                </td>
                <td className="py-3 px-4 font-mono text-gray-500">
                  {doc.size}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="p-1 text-gray-600 hover:text-blue-600 rounded transition cursor-pointer"
                      title="Download PDF"
                    >
                      <Download size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Opening preview of ${doc.title}`)}
                      className="p-1 text-gray-600 hover:text-black rounded transition cursor-pointer"
                      title="Preview Document"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
