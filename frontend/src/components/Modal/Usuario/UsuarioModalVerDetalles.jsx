import { BaseModal } from '../ModalUtils'
import FormField from '../../Form/FormField'
import { useEffect, useState } from 'react'
import { useUsuarioModalStore } from '../../../stores/Modal/useUsuarioModalStore'
import { useUsuarioStore } from '../../../stores/useUsuarioStore'

export default function UsuarioModalVerDetalles() {
  const { verDetalles, row, closeModal } = useUsuarioModalStore()
  const { currentUsuario, usuario, getUsuario, isFetchingUsuario, updateUsuario, isUpdatingUsuario } = useUsuarioStore()

  const [formData, setFormData] = useState({
    usuarioId: '',
    nombres: '',
    apellidos: '',
    email: '',
    celular: '',
    duiDelante: null,
    duiAtras: null,
    password: '',
    direccion: '',
  })

  useEffect(() => {
    const userId = row?.original?.id
    if (userId) {
      setFormData({
        usuarioId: '',
        nombres: '',
        apellidos: '',
        email: '',
        celular: '',
        duiDelante: null,
        duiAtras: null,
        password: '',
        direccion: '',
      })
      getUsuario(userId)
    }
  }, [row])

  useEffect(() => {
    if (row) {
      if (usuario) {
        // use the fetched user
        setFormData({
          usuarioId: usuario.id ?? '',
          nombres: usuario.nombres ?? '',
          apellidos: usuario.apellidos ?? '',
          email: usuario.email ?? '',
          celular: usuario.celular ?? '',
          duiDelante: usuario.duiDelante ?? null,
          duiAtras: usuario.duiAtras ?? null,
          password: '',
          direccion: usuario.direccion ?? '',
        })
      }
    } else if (currentUsuario) {
      // use the logged-in user
      setFormData({
        usuarioId: currentUsuario.id ?? '',
        nombres: currentUsuario.nombres ?? '',
        apellidos: currentUsuario.apellidos ?? '',
        email: currentUsuario.email ?? '',
        celular: currentUsuario.celular ?? '',
        duiDelante: currentUsuario.duiDelante ?? null,
        duiAtras: currentUsuario.duiAtras ?? null,
        password: '',
        direccion: currentUsuario.direccion ?? '',
      })
    }
  }, [usuario, currentUsuario, row])

  const handleSubmit = async () => {
    await updateUsuario(formData);

    setFormData({
      usuarioId: '',
      nombres: '',
      apellidos: '',
      email: '',
      celular: '',
      duiDelante: null,
      duiAtras: null,
      password: '',
      direccion: '',
    })

    closeModal('verDetalles');
  };

  const handleChange = e => {
    const { name, type, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }))
  }

  return (
    <BaseModal
      isOpen={verDetalles}
      onConfirm={handleSubmit}
      onClose={() => closeModal('verDetalles')}
      customWidth={800}
      title={row?.original?.usuario
        ? 'Detalles de usuario ' + row?.original?.usuario
        : 'Edita tu cuenta'
      }
      confirmText="GUARDAR CAMBIOS"
    >
      <div style={{width: '100%'}} className="modal-content">
        <div className="form-container">
          <div style={{display: 'flex', minHeight: 500, justifyContent: 'center', alignItems: 'center'}} className="form-section">
            {isFetchingUsuario
              ?
              <div className="spinner large"/>
              :
              <div className="form-section-content">
                <FormField
                  classNames="primary half"
                  label="Nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                />

                <FormField
                  classNames="primary half"
                  label="Apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                />

                <FormField
                  classNames="primary half"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <FormField
                  classNames="primary half"
                  label="Celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  required
                />

                <FormField
                  classNames="full"
                  label="Dirección"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />

                <FormField
                  classNames="primary half"
                  label="DUI Delante"
                  name="duiDelante"
                  type="file"
                  preview={formData.duiDelante}
                  onChange={handleChange}
                  required
                />

                <FormField
                  classNames="primary half"
                  label="DUI Atras"
                  name="duiAtras"
                  type="file"
                  preview={formData.duiAtras}
                  onChange={handleChange}
                  required
                />

                <FormField
                  classNames="full"
                  label="Nueva contraseña"
                  type='password'
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Aquí puedes introducir una nueva contraseña para este usuario"
                />
              </div>
            }
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
