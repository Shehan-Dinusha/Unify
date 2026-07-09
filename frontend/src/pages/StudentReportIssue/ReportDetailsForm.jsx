import React from 'react';
import { Upload, FileText, Link as LinkIcon, Trash2 } from 'lucide-react';

const ReportDetailsForm = ({ additionalDetails, setAdditionalDetails, uploadedFiles, handleFileUpload, removeFile, externalLink, setExternalLink }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-6 rounded-full bg-primary-blue flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[12px] font-bold">3</span>
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white font-inter">Provide Report Details</h3>
    </div>

    <div className="mb-5">
      <h4 className="text-sm font-bold text-white font-inter mb-1">
        Additional Comments <span className="text-text-tertiary font-normal text-xs">(Optional)</span>
      </h4>
      <p className="text-[11px] sm:text-xs text-text-secondary font-inter mb-3">
        Describe what happened, who was involved, and the approximate time.
      </p>
      <textarea
        rows={3}
        value={additionalDetails}
        onChange={(e) => setAdditionalDetails(e.target.value)}
        placeholder="Type your detailed report here....."
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-tertiary font-inter outline-none focus:border-primary-blue/50 transition-colors resize-none"
      />
    </div>

    <div>
      <h4 className="text-sm font-bold text-white font-inter mb-1">Supporting Evidence</h4>
      <p className="text-[11px] sm:text-xs text-text-secondary font-inter mb-3">
        Upload screenshots, photos, PDFs, or provide links.
      </p>

      <label className="block w-full border-2 border-dashed border-white/20 rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-primary-blue/40 hover:bg-white/[0.02] transition-all">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <Upload size={16} className="text-primary-blue" />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-white font-inter">Click to upload or drag and drop</p>
        <p className="text-[10px] sm:text-xs text-text-tertiary font-inter mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
        <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
      </label>

      {uploadedFiles.length > 0 && (
        <div className="mt-3">
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider font-inter font-bold block mb-2">UPLOADED FILES</span>
          <div className="flex flex-col gap-2">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-state-error/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-state-error" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-white font-inter truncate">{file.name}</p>
                  <p className="text-[10px] sm:text-xs text-text-tertiary font-inter">{file.size}</p>
                </div>
                <button onClick={() => removeFile(idx)} className="p-1 text-text-secondary hover:text-state-error transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <span className="text-xs font-bold text-white font-inter block mb-2">External Video/Document Links</span>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 gap-2 focus-within:border-primary-blue/50 transition-colors">
            <LinkIcon size={14} className="text-text-secondary flex-shrink-0" />
            <input type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://" className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-text-tertiary outline-none font-inter" />
          </div>
          <button className="h-[38px] sm:h-[42px] px-3 sm:px-5 rounded-xl bg-white/5 text-white border border-white/10 text-xs sm:text-sm font-bold hover:bg-white/10 transition-all duration-200 whitespace-nowrap font-inter">
            Add Link
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ReportDetailsForm;
