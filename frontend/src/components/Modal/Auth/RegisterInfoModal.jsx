import { BaseModal } from '../ModalUtils'
import { useModalStore } from '../../../stores/Modal/useModalStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterInfoModal() {
  const {registerInfo, openModal, closeModal } = useModalStore()

    useEffect(() => {
        openModal('registerInfo');
    }, [])

    return (
        <BaseModal
        isOpen={registerInfo}
        onClose={() => closeModal('registerInfo')}
        customWidth={500}
        title={'Registro de nuevos usuarios'}
        icon={'fas fa-circle-info color-accent'}
        cancelText='ENTIENDO'

        >
        <div className="modal-content">
            <span>Esta pantalla es <strong>solamente para personas que aún no tienen cuenta</strong> y desean crear una nueva.</span>

            <br />
            <br />

            <span><strong>Si ya te registraste anteriormente</strong>, no vuelvas a hacerlo. Ingresa mediante la página de inicio de sesión. </span>

            <br />
            <br />
            <Link className='btn-warning' to={'/login'}>IR A INICIO DE SESIÓN</Link>
        </div>
        </BaseModal>
    )
}