import { useState, useRef } from 'react';
import api from '../api/client';

const scoreSummary = (score) => {
  if (score >= 10) return 'Excellent — every key document is present.';
  if (score >= 8) return 'Almost there — one document still needs attention.';
  if (score >= 6) return 'Good progress — a couple of documents are missing.';
  if (score >= 4) return 'Getting started — more than half the required documents are missing.';
  return "This submission isn't ready yet — most required documents are missing.";
};

function DocumentAuditor() {
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setResult(null);
    setError('');
    setIsScanning(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/audit/check', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
    } catch (err) {
      setError("I couldn't read that document. Please try a PDF, PNG, or JPG.");
    } finally {
      setIsScanning(false);
      event.target.value = '';
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setFileName('');
  };

  return (
    <div className="document-auditor">
      <h2 className="document-auditor__heading">BIS Document Auditor</h2>
      <p className="document-auditor__intro">
        Attach a compliance document and I'll check it against what's
        expected — missing items, formatting issues, and an overall
        readiness score.
      </p>

      {!result && (
        <div className="document-auditor__upload">
          <button
            type="button"
            className="document-auditor__attach-btn"
            onClick={handleAttachClick}
            disabled={isScanning}
          >
            📎 {fileName ? 'Attach a different document' : 'Attach a document'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelected}
            style={{ display: 'none' }}
          />

          {fileName && !isScanning && !error && (
            <p className="document-auditor__filename">📄 {fileName}</p>
          )}

          {isScanning && (
            <div className="chat-preview__bubble chat-preview__bubble--bot chat-preview__scanning">
              <span className="chat-preview__scanning-dot" />
              Scanning document...
            </div>
          )}

          {error && <p className="document-auditor__error">{error}</p>}
        </div>
      )}

      {result && (
        <>
          <AuditResultCard result={result} />
          <button
            type="button"
            className="document-auditor__reset-btn"
            onClick={handleReset}
          >
            Check another document
          </button>
        </>
      )}
    </div>
  );
}

function AuditResultCard({ result }) {
  const { readiness_score, findings } = result;
  const percentage = (readiness_score / 10) * 100;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="chat-preview__bubble chat-preview__audit-card">
      <div className="audit-card__gauge">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} className="audit-card__gauge-track" />
          <circle
            cx="40" cy="40" r={radius}
            className="audit-card__gauge-fill"
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <span className="audit-card__gauge-score">{readiness_score}/10</span>
      </div>

      <div className="audit-card__body">
        <p className="audit-card__summary">{scoreSummary(readiness_score)}</p>
        <ul className="audit-card__findings">
          {findings.map((finding, i) => (
            <li
              key={i}
              className={`audit-card__finding audit-card__finding--${finding.status}`}
            >
              <span className="audit-card__finding-icon">
                {finding.status === 'pass' ? '✓' : '✕'}
              </span>
              {finding.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DocumentAuditor;