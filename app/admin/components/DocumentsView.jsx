'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  UploadCloud, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Building2,
  Calendar,
  Hash,
  FolderOpen
} from 'lucide-react';
import { getDocuments, addDocument, deleteDocument, ADMIN_EVENT } from '../../lib/adminStore';

const CATEGORIES = [
  'Bill of Lading',
  'Customs Declaration (TRA/SAD)',
  'Inspection (JEVIC / TBS)',
  'Commercial Invoice',
  'Sales Agreement',
  'Port Clearance & Wharfage',
  'Insurance Policy',
  'Other'
];

export default function DocumentsView({ cars = [] }) {
  const [documents, setDocuments] = useState(() => getDocuments());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);

  // Upload Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Bill of Lading');
  const [chassis, setChassis] = useState('');
  const [authority, setAuthority] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileType, setFileType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadSuccessToast, setUploadSuccessToast] = useState('');

  const fileInputRef = useRef(null);

  // Sync with admin store
  useEffect(() => {
    const handleUpdate = () => {
      setDocuments(getDocuments());
    };
    window.addEventListener(ADMIN_EVENT, handleUpdate);
    return () => window.removeEventListener(ADMIN_EVENT, handleUpdate);
  }, []);

  // Format bytes to readable size
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setFormError('File exceeds 15 MB limit. Please select a smaller document or compressed PDF.');
      return;
    }

    setFormError('');
    setFileName(file.name);
    setFileSize(formatBytes(file.size));
    setFileType(file.type);

    // Auto fill title if empty
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileData(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  // Open Upload Modal
  const openUploadModal = () => {
    setTitle('');
    setCategory('Bill of Lading');
    setChassis('');
    setAuthority('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setFileData(null);
    setFileName('');
    setFileSize('');
    setFileType('');
    setFormError('');
    setIsUploadModalOpen(true);
  };

  // Handle Submit Document
  const handleSaveDocument = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a document title.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newDoc = {
        title: title.trim(),
        type: category,
        chassis: chassis.trim() || 'General / Stock',
        authority: authority.trim() || '3BrosMotor Registry',
        date: date || new Date().toISOString().split('T')[0],
        size: fileSize || 'Custom Record',
        fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
        fileType: fileType || 'application/pdf',
        fileData: fileData || null,
        notes: notes.trim()
      };

      addDocument(newDoc);
      setDocuments(getDocuments());
      setIsUploadModalOpen(false);
      setUploadSuccessToast(`"${title}" was uploaded successfully.`);
      setTimeout(() => setUploadSuccessToast(''), 4000);
    } catch {
      setFormError('Failed to save document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Real Download
  const handleDownload = (doc) => {
    if (doc.fileData) {
      const link = document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.fileName || `${doc.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Create a printable text/certificate summary if no raw binary was attached
      const content = `3BrosMotor .LTD - Dealership Document Record\n\nTitle: ${doc.title}\nCategory: ${doc.type}\nChassis/VIN: ${doc.chassis}\nIssuing Authority: ${doc.authority}\nDate: ${doc.date}\nFile Size: ${doc.size}\nNotes: ${doc.notes || 'N/A'}\n\nVerified Record ID: ${doc.id}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.title.replace(/\s+/g, '_')}_Record.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Handle Delete Confirmation
  const confirmDelete = () => {
    if (!docToDelete) return;
    deleteDocument(docToDelete.id);
    setDocuments(getDocuments());
    if (previewDoc?.id === docToDelete.id) {
      setPreviewDoc(null);
    }
    setDocToDelete(null);
  };

  // Filter documents
  const filtered = documents.filter(d => {
    const matchesSearch = 
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.chassis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.authority.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || d.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {uploadSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-lg flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{uploadSuccessToast}</span>
          </div>
          <button 
            type="button"
            onClick={() => setUploadSuccessToast('')}
            className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FileText size={22} className="text-[#3e68f3]" />
            <span>Vehicle Import Documents & Legal Records</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage Bills of Lading (BL), JEVIC roadworthiness certificates, TRA Customs clearances, and ownership logbooks.
          </p>
        </div>

        <button
          type="button"
          onClick={openUploadModal}
          className="bg-[#111827] hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents by title, chassis / VIN, authority, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-500 whitespace-nowrap font-medium">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-2.5 py-2 text-xs outline-none focus:border-blue-600 bg-white cursor-pointer w-full md:w-auto"
          >
            <option value="All">All Categories ({documents.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <FolderOpen size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {documents.length === 0 ? 'No Documents Uploaded Yet' : 'No Matching Documents Found'}
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-5 leading-relaxed">
            {documents.length === 0 
              ? 'Your document repository is ready and clean. Upload vehicle Bills of Lading, JEVIC roadworthiness certificates, TRA Single Administrative Documents (SAD), or commercial invoices.'
              : 'No documents match your search criteria. Try modifying your search keywords or switching category filters.'}
          </p>
          {documents.length === 0 ? (
            <button
              type="button"
              onClick={openUploadModal}
              className="bg-[#111827] hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus size={15} />
              <span>Upload First Document</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium px-4 py-2 rounded-lg inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Chassis / VIN</th>
                  <th className="py-3 px-4">Issuing Authority</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                          <FileSpreadsheet size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{doc.title}</div>
                          {doc.fileName && (
                            <div className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">
                              {doc.fileName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-semibold text-[10px]">
                        {doc.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-gray-700 text-[11px]">
                      {doc.chassis}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      {doc.authority}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {doc.date}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap">
                      {doc.size}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                          title="Download Document"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition cursor-pointer"
                          title="View / Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDocToDelete(doc)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
            <span>Showing {filtered.length} of {documents.length} document record(s)</span>
            <span className="text-[11px] text-gray-400">All documents stored securely for 3BrosMotor .LTD</span>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-xl w-full max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UploadCloud size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Upload New Document</h3>
                  <p className="text-[11px] text-gray-500">Add import certificates, Bill of Lading, or customs paperwork</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDocument} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* File Upload Zone */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  Select Document File (PDF, Image, or Scanned Doc)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition ${
                    fileName 
                      ? 'border-emerald-300 bg-emerald-50/30' 
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/20'
                  }`}
                >
                  {fileName ? (
                    <div className="flex items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <FileCheck size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 truncate max-w-[280px]">{fileName}</div>
                          <div className="text-[11px] text-gray-500">{fileSize} • Ready to save</div>
                        </div>
                      </div>
                      <span className="text-xs text-blue-600 hover:underline font-semibold">Change File</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud size={30} className="text-gray-400 mb-2" />
                      <span className="font-bold text-gray-800">Click to browse file</span>
                      <span className="text-[11px] text-gray-400 mt-1">
                        Supports PDF, PNG, JPG, WEBP, DOCX (Up to 15MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Title */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bill of Lading: MSC Nicole (Prado TX)"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Document Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 bg-white cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Issue / Filing Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Chassis Number & Quick Vehicle Association */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Chassis / VIN Number
                  </label>
                  <input
                    type="text"
                    value={chassis}
                    onChange={(e) => setChassis(e.target.value)}
                    placeholder="e.g. GDJ150-0042189 or Multiple"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 font-mono"
                  />
                </div>

                {cars.length > 0 && (
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Link from Inventory
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) setChassis(e.target.value);
                      }}
                      defaultValue=""
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600 bg-white cursor-pointer"
                    >
                      <option value="">-- Choose Car (Optional) --</option>
                      {cars.map((car) => (
                        <option key={car.id} value={car.chassisNumber || car.stockNumber || car.title}>
                          {car.year} {car.make} {car.model} {car.chassisNumber ? `(${car.chassisNumber})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Issuing Authority */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Issuing Authority / Agency
                </label>
                <input
                  type="text"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  placeholder="e.g. Tanzania Revenue Authority (TRA), MSC Line, JEVIC Japan"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Notes / Filing Reference (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes, tracking numbers, or verification remarks..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-600"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#111827] hover:bg-black text-white font-bold px-5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Plus size={15} />
                      <span>Save Document</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{previewDoc.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.2 rounded">
                      {previewDoc.type}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">{previewDoc.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(previewDoc)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Content / Embedded Preview */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Hash size={11} /> Chassis / VIN
                  </div>
                  <div className="font-mono font-bold text-gray-800 mt-0.5 truncate">{previewDoc.chassis}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Building2 size={11} /> Authority
                  </div>
                  <div className="font-semibold text-gray-800 mt-0.5 truncate">{previewDoc.authority}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                    <Calendar size={11} /> Filing Date
                  </div>
                  <div className="font-semibold text-gray-800 mt-0.5">{previewDoc.date}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                    <FileText size={11} /> File Size
                  </div>
                  <div className="font-semibold text-gray-800 mt-0.5">{previewDoc.size}</div>
                </div>
              </div>

              {/* Visual preview if image */}
              {previewDoc.fileData && previewDoc.fileData.startsWith('data:image/') ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center p-2 max-h-[380px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewDoc.fileData}
                    alt={previewDoc.title}
                    className="max-h-[360px] object-contain rounded"
                  />
                </div>
              ) : previewDoc.fileData && previewDoc.fileData.startsWith('data:application/pdf') ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100 h-[360px]">
                  <iframe
                    src={previewDoc.fileData}
                    title={previewDoc.title}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <FileText size={38} className="text-gray-400 mx-auto mb-2" />
                  <div className="font-bold text-gray-800 text-sm">{previewDoc.fileName || previewDoc.title}</div>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Verified electronic record archived for 3BrosMotor .LTD vehicle tracking. Click Download to retrieve the file.
                  </p>
                </div>
              )}

              {previewDoc.notes && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                  <strong className="block mb-0.5 font-bold">Notes / Record Details:</strong>
                  <span>{previewDoc.notes}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setDocToDelete(previewDoc);
                }}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete Record</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold cursor-pointer transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-sm w-full p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">Delete Document?</h4>
            <p className="text-xs text-gray-500 mb-4">
              Are you sure you want to delete <strong className="text-gray-800">&ldquo;{docToDelete.title}&rdquo;</strong>? This cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
