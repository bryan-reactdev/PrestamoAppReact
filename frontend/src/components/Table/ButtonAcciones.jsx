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
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => setOpen(!open);
  const closeDropdown = () => setOpen(false);

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

  // --- Check if dropdown fits below, otherwise flip ---
  useEffect(() => {
    if (open && dropdownRef.current && !modalMode) {
      const containerElement = containerRef?.current || buttonRef.current;
      if (containerElement) {
        const containerRect = containerElement.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const spaceBelow = window.innerHeight - containerRect.bottom;

        setDropUp(spaceBelow < dropdownHeight);
      }
    }
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

  // Dropdown mode - original behavior
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

      {open && (
        <div
          ref={dropdownRef}
          className={`dropdown ${dropUp ? "drop-up" : ""}`}
        >
          {filteredAcciones.map((Btn, index) => (
            <Btn key={index} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}
