import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import { BaseModal } from "../Modal/ModalUtils";

export default function ButtonAcciones({ acciones, row, open: controlledOpen, setOpen: setControlledOpen, hideButton, containerRef, modalMode = false}) {
  const {currentUsuario} = useUsuarioStore();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;
  
  const [dropUp, setDropUp] = useState(false); // new state
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => setOpen(!open);
  const closeDropdown = () => setOpen(false);

  // --- Calculate dropdown position based on button position ---
  useEffect(() => {
    if (open && buttonRef.current && !modalMode) {
      const updatePosition = () => {
        if (buttonRef.current && dropdownRef.current) {
          const buttonRect = buttonRef.current.getBoundingClientRect();
          const dropdownHeight = dropdownRef.current.offsetHeight;
          const spaceBelow = window.innerHeight - buttonRect.bottom;
          const spaceAbove = buttonRect.top;
          
          // Determine if we should drop up or down
          const shouldDropUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
          setDropUp(shouldDropUp);
          
          // Calculate position
          if (shouldDropUp) {
            setDropdownPosition({
              top: buttonRect.top - dropdownHeight,
              right: window.innerWidth - buttonRect.right
            });
          } else {
            setDropdownPosition({
              top: buttonRect.bottom,
              right: window.innerWidth - buttonRect.right
            });
          }
        } else if (buttonRef.current) {
          // Initial position estimate before dropdown is rendered
          const buttonRect = buttonRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: buttonRect.bottom,
            right: window.innerWidth - buttonRect.right
          });
        }
      };
      
      // Initial position
      updatePosition();
      
      // Recalculate after a short delay to get actual dropdown height
      const timeoutId = setTimeout(() => {
        updatePosition();
      }, 0);
      
      // Update position on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open, modalMode]);

  // --- Detect click outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      const containerElement = containerRef?.current || buttonRef.current;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        containerElement &&
        !containerElement.contains(event.target)
      ) {
        closeDropdown();
      }
    };

    if (open && !modalMode) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, containerRef, modalMode]);

  const filteredAcciones = acciones.filter((Btn) => {
    const roleOk = !Btn.allowedRoles || Btn.allowedRoles.includes(currentUsuario.rol);
    const visibleOk = !Btn.visibleIf || Btn.visibleIf(row, currentUsuario.rol);
    return roleOk && visibleOk;
  });

  // Modal mode - render as full modal using portal
  if (modalMode) {
    const modalContent = (
      <BaseModal
        isOpen={open}
        onClose={closeDropdown}
        customWidth={300}
        title={`Acciones`}
      >
        <div className="modal-content">
          <div className="acciones-list">
            {filteredAcciones.map((Btn, index) => (
              <Btn key={index} row={row} />
            ))}
          </div>
        </div>
      </BaseModal>
    );

    // Always render the portal, but BaseModal handles the open/close logic
    return createPortal(modalContent, document.body);
  }

  // Dropdown mode - render dropdown via portal with fixed positioning
  const dropdownContent = open && (
    <div
      ref={dropdownRef}
      className={`dropdown ${dropUp ? "drop-up" : ""}`}
      style={{
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`,
        zIndex: 1000
      }}
    >
      {filteredAcciones.map((Btn, index) => (
        <Btn key={index} row={row} />
      ))}
    </div>
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {!hideButton && (
        <button
          ref={buttonRef}
          className="btn-acciones"
          onClick={toggleDropdown}
          aria-label="Más acciones"
        >
          ACCIONES <i className="fas fa-sort-down"></i>
        </button>
      )}

      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}
