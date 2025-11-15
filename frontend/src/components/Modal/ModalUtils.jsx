import React, { useRef, useEffect } from 'react'
import { Button } from '../ui/button';

export const setupModalEventHandlers = (open, modalContainerRef, closeModal) => {
    if (!open) return;

    // const handleClickOutsideModal = (event) => {
    //     if (modalContainerRef.current && !modalContainerRef.current.contains(event.target)) {
    //         closeModal();
    //     }
    // };

    // document.addEventListener('mousedown', handleClickOutsideModal);

    const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
        // document.removeEventListener('mousedown', handleClickOutsideModal);
        document.removeEventListener('keydown', handleEscapeKey);
    };
}

export function BaseModal({
  isOpen,
  onConfirm,
  onClose,
  customWidth,
  title,
  icon,
  confirmText = "Confirmar",
  cancelText = "CANCELAR",
  confirmColor = 'primary',
  cancelColor = 'secondary',
  children,
  style={},
  formRef = null, // New prop to accept form reference
}) {
  const modalRef = useRef(null)
  const modalContainerRef = useRef(null)

  const handleCloseModal = () => {
    if (modalContainerRef.current){
      modalRef.current.style.animation = 'grow-out-opacity 250ms ease forwards';
      modalContainerRef.current.style.animation = 'grow-out 250ms ease forwards';
    }

    setTimeout(() => {
      onClose();
    }, 100);
  }

  const handleConfirm = () => {
    // If there's a form ref, validate the form first
    if (formRef && formRef.current) {
      if (formRef.current.checkValidity()) {
        onConfirm();
      } else {
        // Trigger validation messages
        formRef.current.reportValidity();
      }
    } else {
      // No form validation needed
      onConfirm();
    }
  }

  useEffect(() => {
    setupModalEventHandlers(isOpen, modalContainerRef, handleCloseModal)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className='modal-backdrop' ref={modalRef} style={style}>
      <div className={`modal-container`} style={{width: customWidth}} ref={modalContainerRef}>
        {/* --- Titulo & Icono --- */}
        <div className="modal-header mb-2">
          <i className={`${icon} modal-icon`}></i>
          <h1 className='text-2xl font-bold'>{title}</h1>
        </div>

        {/* --- Custom Content --- */}
        {children}

        {/* --- Footer & Botones --- */}
        <div className="modal-footer">
          {onConfirm &&
          <Button variant={"default"} onClick={handleConfirm} autoFocus>
            {confirmText}
          </Button>
          }
          {onClose &&
          <button className={`btn-${cancelColor}`} onClick={handleCloseModal}>
            {cancelText}
          </button>
          }
        </div>
      </div>
    </div>
  )
}