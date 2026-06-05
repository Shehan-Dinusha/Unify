import React from "react";
import { ImagePlus } from "lucide-react";

const ImageUploader = ({ images, isDragging, setIsDragging, fileInputRef, handleFiles, removeImage }) => (
  <div>
    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">Photos</label>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*"
        onChange={(e) => handleFiles(e.target.files)} />
      <div onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`aspect-[4/3] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-colors cursor-pointer group ${isDragging ? 'border-primary-blue bg-primary-blue/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
        <div className="w-10 h-10 rounded-xl bg-primary-blue/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
          <ImagePlus className="text-primary-blue w-5 h-5" />
        </div>
        <p className="text-white text-[11px] font-medium mb-1 text-center">Drag & drop or click</p>
        <p className="text-text-secondary text-[9px] text-center uppercase tracking-wider">Max. 10MB</p>
      </div>
      {images.map((img) => (
        <div key={img.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-white/10">
          <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <button onClick={() => removeImage(img.id)}
              className="text-red-400 font-bold text-[10px] bg-red-400/20 px-2.5 py-1.5 rounded-lg border border-red-400/30 hover:bg-red-400/30 transition-colors">Remove</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ImageUploader;
