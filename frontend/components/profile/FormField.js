'use client';

export default function FormField({ label, icon, hint, children, className = '' }) {
  return (
    <div className={`form-field-group ${className}`}>
      <label className="form-field-label">
        {icon && <i className={`pi ${icon} form-field-icon`} />}
        {label}
      </label>
      {children}
      {hint && <p className="form-field-hint">{hint}</p>}
    </div>
  );
}
