import { useState, useEffect } from 'react';
import { API_BASE_IP } from '../../utils/axiosWrapper';
import WhatsAppIcon from '../Elements/WhatsAppIcon';

export default function FormField({
  classNames,
  style,
  label,
  type = 'text',
  preview: initialPreview = null,
  required = false,
  pattern,
  min,
  max,
  minLength,
  maxLength,
  ...props
}) {
  const isMoney = type === 'money';
  const isPassword = type === 'password';
  const isPhone = type === 'phone';
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // --- Initialize preview if prop provided ---
  useEffect(() => {
    if (initialPreview) {
      if (typeof initialPreview === 'string') {
        setPreview(`${API_BASE_IP}${initialPreview}`);
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

      <div className="form-field-input-container" style={{ position: 'relative' }}>
        {isMoney && <i className="fas fa-dollar-sign"></i>}

        {type === 'textarea' ? (
          <textarea 
            required={required}
            pattern={pattern}
            minLength={minLength}
            maxLength={maxLength}
            {...props}
          ></textarea>
        ) : (
          <input
            type={isPassword && showPassword ? 'text' : isMoney ? 'number' : type}
            step={isMoney ? 0.01 : 1}
            required={required}
            pattern={pattern}
            min={min}
            max={max}
            minLength={minLength}
            maxLength={maxLength}
            {...props}
            value={type === 'file' ? '' : props?.value}
            onChange={handleChange}
          />
        )}

        {isPassword && (
          <i
            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            onClick={() => setShowPassword(prev => !prev)}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#555',
              fontSize: '0.95rem',
            }}
          />
        )}

        {isPhone && (props.readOnly || props.disabled) && (
          <WhatsAppIcon
            phoneNumber={props.value}
            style={{
              position: 'absolute',
              right: isPassword ? '2.5rem' : '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        )}
      </div>

      {preview && (
        <img
          className="image-preview"
          src={preview}
          alt="preview"
        />
      )}
    </div>
  );
}
