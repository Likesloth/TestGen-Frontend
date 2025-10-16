import React, { useCallback, useId, useRef, useState } from 'react';
import { useToast } from './ToastProvider';

export default function FileInput({
  label = 'Upload file',
  name,
  accept = '.xml',
  required = false,
  maxSizeBytes = 5 * 1024 * 1024,
  hint,
  onPreview, // async (fileText) => void
  className = '',
}) {
  const inputId = useId();
  const toast = useToast();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const acceptExts = accept
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const validate = useCallback(
    (f) => {
      if (!f) return { ok: !required };
      if (f.size > maxSizeBytes) {
        toast.error(`File is too large. Max ${(maxSizeBytes / (1024 * 1024)).toFixed(1)} MB.`);
        return { ok: false };
      }
      if (acceptExts.length) {
        const lower = f.name.toLowerCase();
        const ok = acceptExts.some((ext) => lower.endsWith(ext.replace('*', '')));
        if (!ok) {
          toast.error(`Invalid file type. Allowed: ${acceptExts.join(', ')}`);
          return { ok: false };
        }
      }
      return { ok: true };
    },
    [acceptExts, maxSizeBytes, required, toast]
  );

  const handleFiles = useCallback(
    (files) => {
      const f = files && files[0];
      const { ok } = validate(f);
      if (!ok) {
        // Clear invalid selection
        if (inputRef.current) inputRef.current.value = '';
        setFile(null);
        return;
      }
      setFile(f || null);
      if (inputRef.current && f) {
        try {
          const dt = new DataTransfer();
          dt.items.add(f);
          inputRef.current.files = dt.files;
        } catch {}
      }
    },
    [validate]
  );

  const onChange = (e) => handleFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);

  const triggerBrowse = () => inputRef.current?.click();

  const handlePreview = async () => {
    if (!file) return;
    try {
      const text = await file.text();
      if (onPreview) onPreview(text);
    } catch (e) {
      toast.error('Could not read file for preview.');
    }
  };

  return (
    <div className={className}>
      <label htmlFor={inputId} className="block mb-1 font-medium text-ink-900">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {hint && (
        <p id={`${inputId}-hint`} className="text-sm text-ink-500 mb-2">
          {hint}
        </p>
      )}
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        required={required}
        onChange={onChange}
        className="sr-only"
        aria-describedby={hint ? `${inputId}-hint` : undefined}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={triggerBrowse}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && triggerBrowse()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={[
          'w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer select-none',
          dragOver ? 'border-primary-600 bg-gray-50' : 'border-ink-300 hover:border-primary-600',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
        ].join(' ')}
        aria-label={`${label}. ${file ? 'File selected' : 'Browse or drop file'}`}
      >
        {!file ? (
          <>
            <div className="text-sm text-ink-700">Drag & drop XML here</div>
            <div className="text-sm text-ink-500">or click to choose a file</div>
            <div className="mt-2 inline-flex px-3 py-1.5 rounded-md bg-primary-700 text-white text-sm">Choose file</div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <div className="text-sm font-medium text-ink-900">{file.name}</div>
            <div className="text-xs text-ink-500">{(file.size / 1024).toFixed(1)} KB</div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={(e) => { e.stopPropagation(); triggerBrowse(); }}
                onKeyDown={(e) => { e.stopPropagation(); }}
              >
                Change file
              </button>
              {onPreview && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={(e) => { e.stopPropagation(); handlePreview(); }}
                  onKeyDown={(e) => { e.stopPropagation(); }}
                >
                  Preview XML
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
