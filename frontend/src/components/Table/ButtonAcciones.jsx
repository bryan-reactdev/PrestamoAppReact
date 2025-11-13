import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import { BaseModal } from "../Modal/ModalUtils";
import { Button } from "../ui/button";

export default function ButtonAcciones({ acciones, row, open: controlledOpen, setOpen: setControlledOpen, hideButton, containerRef, modalMode = false}) {
  const {currentUsuario} = useUsuarioStore();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;
  
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => setOpen(!open);
  const closeDropdown = () => setOpen(false);

  // Calculate dropdown position after render
  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !dropdownRef.current || modalMode) {
      return;
    }

    const calculatePosition = () => {
      if (!buttonRef.current || !dropdownRef.current) return;
      
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Get dropdown dimensions - use getBoundingClientRect first, fallback to offsetHeight
      const dropdownHeight = dropdownRect.height > 0 
        ? dropdownRect.height 
        : dropdownRef.current.offsetHeight;
      
      // If dropdown doesn't have dimensions yet, skip calculation
      if (dropdownHeight <= 0) return;
      
      // Calculate space available
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // Determine vertical position
      let top;
      if (spaceBelow >= dropdownHeight) {
        // Enough space below - position below button
        top = buttonRect.bottom;
      } else if (spaceAbove >= dropdownHeight) {
        // Not enough space below but enough above - position above button
        top = buttonRect.top - dropdownHeight;
      } else {
        // Not enough space in either direction - position where there's more space
        if (spaceBelow > spaceAbove) {
          top = buttonRect.bottom;
        } else {
          top = buttonRect.top - dropdownHeight;
        }
      }
      
      // Ensure dropdown doesn't go off top or bottom of viewport
      top = Math.max(0, Math.min(top, viewportHeight - dropdownHeight));
      
      // Calculate horizontal position (right-aligned to button)
      let right = viewportWidth - buttonRect.right;
      
      // Ensure dropdown doesn't go off right edge
      if (right < 0) {
        right = viewportWidth - buttonRect.left;
      }
      
      setDropdownPosition({ top, right });
    };

    calculatePosition();

    // Update on scroll and resize
    const handleScroll = () => calculatePosition();
    const handleResize = () => calculatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
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
    // Filter out undefined/null values
    if (!Btn) return false;
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
      className="dropdown"
      style={{
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`,
        zIndex: 20
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
        <Button
          ref={buttonRef}
          onClick={toggleDropdown}
          aria-label="Más acciones"
          variant="outline"
        >
          ACCIONES <i className="fas fa-sort-down"></i>
        </Button>
      )}

      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}
