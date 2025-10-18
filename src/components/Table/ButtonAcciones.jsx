import { useState, useEffect, useRef, useMemo } from "react";

export default function ButtonAcciones({ acciones, row }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen(!open);
  const closeDropdown = () => setOpen(false);

  // --- Cerrar dropdown al clickear fuera ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Mini optimización
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button className="btn-acciones" onClick={toggleDropdown} aria-label="Más acciones">
        ACCIONES <i className="fas fa-sort-down"></i>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            zIndex: 1,
          }}
        >
          {acciones.map((Btn, index) => (
            <div key={index} style={{ padding: '5px 10px' }}>
              <Btn row={row} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}