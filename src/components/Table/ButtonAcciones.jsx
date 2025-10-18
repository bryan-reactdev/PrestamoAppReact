import { useState, useEffect, useRef } from "react";

export default function ButtonAcciones({ acciones, row }) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false); // new state
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => setOpen(!open);
  const closeDropdown = () => setOpen(false);

  // --- Detect click outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // --- Check if dropdown fits below, otherwise flip ---
  useEffect(() => {
    if (open && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - buttonRect.bottom;

      setDropUp(spaceBelow < dropdownHeight);
    }
  }, [open]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={buttonRef}
        className="btn-acciones"
        onClick={toggleDropdown}
        aria-label="Más acciones"
      >
        ACCIONES <i className="fas fa-sort-down"></i>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={`dropdown ${dropUp ? "drop-up" : ""}`}
        >
          {acciones.map((Btn, index) => (
            <Btn key={index} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}
