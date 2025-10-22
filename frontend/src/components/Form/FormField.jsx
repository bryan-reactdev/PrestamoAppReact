import { useState, useEffect } from 'react';

export default function FormField({
  classNames,
  style,
  label,
  type = 'text',
  preview: initialPreview = null,
  ...props
}) {
  const isMoney = type === 'money';
  const [preview, setPreview] = useState(null);

  // --- Initialize preview if prop provided ---
  useEffect(() => {
    if (initialPreview) {
      if (typeof initialPreview === 'string') {
        setPreview(`http://192.168.0.194:8083${initialPreview}`);
      } else if (initialPreview instanceof File) {
        setPreview(URL.createObjectURL(initialPreview));
      }
    } else {
      setPreview(null);
    }
  }, [initialPreview]);

  // --- Handle file input change ---
  const handleChange = (e) => {
    if (type === 'file') {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    }
    props.onChange?.(e);
  };

  return (
    <div className={`form-field ${classNames || ''}`} style={style}>
      {label && <label>{label}</label>}

      <div className="form-field-input-container">
        {isMoney && <i className="fas fa-dollar-sign"></i>}

        {type === 'textarea' ? (
          <textarea {...props}></textarea>
        ) : (
          <input
            type={isMoney ? 'number' : type}
            step={isMoney ? 0.01 : 1}
            {...props}
            onChange={handleChange}
          />
        )}
      </div>

      {preview && (
        <img
          className="image-preview"
          src={preview}
          alt="preview"
          style={{
            marginTop: '0.5rem',
            maxWidth: '100%',
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        />
      )}
    </div>
  );
}
