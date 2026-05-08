import { useRef, useState, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import GovernmentForm from './GovernmentForm.jsx';
import { INITIAL_STATE, validateForm, mapPdfTextToState } from './FormState.js';
import './form.css';

export default function App() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [validationErrors, setValidationErrors] = useState([]);
  const [toast, setToast] = useState(null);
  const printRef = useRef(null);
  const jsonInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  function showToast(msg, isError = false) {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  }

  const onChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors.some(e => e.fieldId === field)) {
      setValidationErrors(prev => prev.filter(e => e.fieldId !== field));
    }
  }, [validationErrors]);

  /* ── PDF Export ── */
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Request_${formData.officerName || 'Draft'}_${formData.date}`,
    pageStyle: `
      @page { size: A4; margin: 15mm 20mm; }
      @media print {
        .no-print, .app-toolbar, .dynamic-table-actions, .btn-row, .validation-banner { display: none !important; }
        body { font-size: 10pt; }
        tbody { page-break-inside: avoid; }
        tr { page-break-inside: avoid; }
      }
    `,
  });

  function handleExportPdf() {
    const errors = validateForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      const firstEl = document.getElementById(errors[0].fieldId);
      if (firstEl) firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setValidationErrors([]);
    handlePrint();
  }

  /* ── Save JSON ── */
  function handleSaveJson() {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form_${(formData.officerName || 'draft').replace(/\s+/g, '_')}_${formData.date || 'undated'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Form data saved as JSON.');
  }

  /* ── Load JSON ── */
  function handleLoadJson(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const loaded = JSON.parse(ev.target.result);
        setFormData({ ...INITIAL_STATE, ...loaded });
        setValidationErrors([]);
        showToast('Form loaded successfully.');
      } catch {
        showToast('Could not parse JSON file.', true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  /* ── Load PDF ── */
  async function handleLoadPdf(e) {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    showToast('Extracting PDF text…');

    try {
      const pdfjsLib = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const textItems = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        content.items.forEach(item => {
          if (item.str && item.str.trim()) textItems.push(item.str.trim());
        });
      }

      const mapped = mapPdfTextToState(textItems);
      setFormData(mapped);
      setValidationErrors([]);
      showToast('PDF imported — please verify all fields for accuracy.');
    } catch (err) {
      console.error('PDF load error:', err);
      showToast('PDF extraction failed. Try loading a JSON file instead.', true);
    }
  }

  /* ── Reset ── */
  function handleReset() {
    if (!window.confirm('Clear all form data and start fresh?')) return;
    setFormData(INITIAL_STATE);
    setValidationErrors([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      {/* Toolbar */}
      <div className="app-toolbar">
        <h1>📋 Request to the Department of the Public Service</h1>

        <button className="toolbar-btn primary" onClick={handleExportPdf}>
          🖨️ Export PDF
        </button>

        <div className="toolbar-separator" />

        <button className="toolbar-btn" onClick={handleSaveJson}>
          💾 Save JSON
        </button>

        <button className="toolbar-btn" onClick={() => jsonInputRef.current.click()}>
          📂 Load JSON
        </button>
        <input
          ref={jsonInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleLoadJson}
        />

        <button className="toolbar-btn" onClick={() => pdfInputRef.current.click()}>
          📄 Load PDF
        </button>
        <input
          ref={pdfInputRef}
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handleLoadPdf}
        />

        <div className="toolbar-separator" />

        <button className="toolbar-btn" onClick={handleReset} style={{ borderColor: '#e74c3c', color: '#ffaaaa' }}>
          🗑️ New Form
        </button>
      </div>

      {/* Validation banner */}
      {validationErrors.length > 0 && (
        <div className="validation-banner">
          Please complete the following required fields before exporting:
          <ul>
            {validationErrors.map(e => <li key={e.fieldId}>{e.label}</li>)}
          </ul>
        </div>
      )}

      {/* Form */}
      <GovernmentForm
        formData={formData}
        onChange={onChange}
        validationErrors={validationErrors}
        printRef={printRef}
      />

      {/* Toast */}
      {toast && (
        <div className={`toast${toast.isError ? ' error' : ''}`}>{toast.msg}</div>
      )}
    </>
  );
}

/* Lazy-load pdf.js (legacy UMD build) from CDN */
let _pdfjsLib = null;
async function loadPdfJs() {
  if (_pdfjsLib) return _pdfjsLib;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    // Use the legacy build which exposes window.pdfjsLib
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const lib = window.pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        _pdfjsLib = lib;
        resolve(lib);
      } else {
        reject(new Error('pdf.js did not expose window.pdfjsLib'));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
