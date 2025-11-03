import { useState, useEffect, useRef } from 'react';
import { API_BASE_IP } from '../../utils/axiosWrapper';
import WhatsAppIcon from '../Elements/WhatsAppIcon';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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
  const isFile = type === 'file';
  const isMultipleFiles = isFile && props.multiple;
  const [preview, setPreview] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

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

  // --- Cleanup object URLs on unmount ---
  useEffect(() => {
    return () => {
      // Cleanup single preview
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      // Cleanup multiple previews
      previews.forEach(({ preview: previewUrl }) => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
      });
    };
  }, [preview, previews]);

  // --- Handle custom validation for file inputs ---
  useEffect(() => {
    if (isFile && fileInputRef.current) {
      const input = fileInputRef.current;
      
      if (isMultipleFiles) {
        // For multiple files, validate based on our internal state
        if (required) {
          if (previews.length > 0) {
            input.setCustomValidity('');
          } else {
            input.setCustomValidity('Por favor, selecciona al menos una imagen.');
          }
        } else {
          input.setCustomValidity('');
        }
      } else {
        // For single file, validate based on preview state
        if (required) {
          if (preview) {
            input.setCustomValidity('');
          } else {
            input.setCustomValidity('Por favor, selecciona una imagen.');
          }
        } else {
          input.setCustomValidity('');
        }
      }
      
      // Report validity on form submit
      const form = input.form;
      const handleSubmit = (e) => {
        if (!input.validity.valid) {
          input.reportValidity();
        }
      };
      
      if (form) {
        form.addEventListener('submit', handleSubmit);
        return () => {
          form.removeEventListener('submit', handleSubmit);
        };
      }
    }
  }, [isFile, isMultipleFiles, required, preview, previews]);

  // --- Handle file input change ---
  const handleChange = (e) => {
    if (type === 'file') {
      if (isMultipleFiles) {
        // Handle multiple files
        const files = Array.from(e.target.files || []);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length > 0) {
          // Create previews for all new images
          const newPreviews = imageFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: Date.now() + Math.random() // Unique ID for each preview
          }));
          
          // Update state and get accumulated files
          setPreviews(prev => {
            const updated = [...prev, ...newPreviews];
            const allFiles = updated.map(p => p.file);
            
            // Create a synthetic event with all accumulated files
            // Create a FileList-like structure using DataTransfer
            const dataTransfer = new DataTransfer();
            allFiles.forEach(file => {
              if (file instanceof File) {
                dataTransfer.items.add(file);
              }
            });
            
            const syntheticEvent = {
              ...e,
              target: {
                ...e.target,
                type: 'file',
                name: props.name || '',
                files: dataTransfer.files,
                value: ''
              }
            };
            props.onChange?.(syntheticEvent);
            
            // Reset file input to allow re-selecting same files
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            
            return updated;
          });
          
          setSelectedFiles(prev => [...prev, ...imageFiles]);
        }
      } else {
        // Handle single file (existing behavior)
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          setPreview(url);
        } else {
          setPreview(null);
        }
        props.onChange?.(e);
      }
    } else {
      props.onChange?.(e);
    }
  };

  // --- Handle removing a specific image ---
  const handleRemoveImage = (previewId) => {
    setPreviews(prev => {
      const updated = prev.filter(p => p.id !== previewId);
      const removed = prev.find(p => p.id === previewId);
      
      // Revoke object URL to free memory
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      
      // Update selected files
      setSelectedFiles(prevFiles => prevFiles.filter(f => f !== removed?.file));
      
      // Create synthetic event with remaining files
      const remainingFiles = updated.map(p => p.file);
      // Create a FileList-like structure using DataTransfer
      const dataTransfer = new DataTransfer();
      remainingFiles.forEach(file => {
        if (file instanceof File) {
          dataTransfer.items.add(file);
        }
      });
      
      const syntheticEvent = {
        target: {
          type: 'file',
          name: props.name || '',
          files: dataTransfer.files,
          value: ''
        }
      };
      props.onChange?.(syntheticEvent);
      
      return updated;
    });
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
        ) : 
          isPhone ? (
            <PhoneInput
              defaultCountry="SV"
              international
              value={props.value || ''}
              onChange={(val) => {
                props.onChange?.({
                  target: {
                    name: props.name,
                    value: val || '',
                  },
                });
              }}
              required={required}
              disabled={props.disabled}
              readOnly={props.readOnly}
            />
          ) : (
            <input
              type={isPassword && showPassword ? 'text' : isMoney ? 'number' : type}
              step={isMoney ? 0.01 : 1}
              required={required && !isFile}
              pattern={pattern}
              min={min}
              max={max}
              minLength={minLength}
              maxLength={maxLength}
              {...props}
              value={type === 'file' ? '' : props?.value}
              onChange={handleChange}
              ref={isFile ? fileInputRef : undefined}
            />
          )
        }

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

      {/* Single preview (non-multiple files) */}
      {preview && !isMultipleFiles && (
        <img
          className="image-preview"
          src={preview}
          alt="preview"
        />
      )}

      {/* Multiple previews (multiple files) */}
      {isMultipleFiles && previews.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
          {previews.map(({ file, preview: previewUrl, id }) => (
            <div
              key={id}
              style={{
                position: 'relative',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                width: '120px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f9fafb'
              }}
            >
              <img
                src={previewUrl}
                alt={file.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(id)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(239, 68, 68, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  padding: 0
                }}
                title="Eliminar imagen"
              >
                <i className="fas fa-times"></i>
              </button>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  fontSize: '10px',
                  padding: '4px',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={file.name}
              >
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
