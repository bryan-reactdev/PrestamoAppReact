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
  })

  useEffect(() => {
    const userId = row?.original?.id
    if (userId) {
      getUsuario(userId)
    }
  }, [row?.original?.id, currentUsuario.id, getUsuario])

  useEffect(() => {
    if (usuario) {
      setFormData(prev => ({
        ...prev,
        usuarioId: (usuario.id || currentUsuario.id )?? '',
        nombres: (usuario.nombres || currentUsuario.nombres) ?? '',
        apellidos: (usuario.apellidos || currentUsuario.apellidos) ?? '',
        email: (usuario.email || currentUsuario.email) ?? '',
        celular: (usuario.celular || currentUsuario.celular) ?? '',
        duiDelante: (usuario.duiDelante || currentUsuario.duiDelante) ?? null,
        duiAtras: (usuario.duiAtras || currentUsuario.duiAtras) ?? null,
      }))
    }
  }, [usuario])

  if (!row || !row.original) return null

  const handleSubmit = async () => {
    const data = new FormData();

    // Append simple fields
    data.append('usuarioId', formData.usuarioId);
    data.append('nombres', formData.nombres);
    data.append('apellidos', formData.apellidos);
    data.append('email', formData.email);
    data.append('celular', formData.celular);
    data.append('password', formData.password);

    // Append files only if they exist and are File objects
    if (formData.duiDelante instanceof File)
      data.append('duiDelante', formData.duiDelante);

    if (formData.duiAtras instanceof File)
      data.append('duiAtras', formData.duiAtras);

    // Then send it
    await updateUsuario(data);

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
      title={`Detalles de usuario ${row?.original?.usuario || currentUsuario.nombres + ' ' + currentUsuario.apellidos}`}
      confirmText="GUARDAR CAMBIOS"
    >
      <div className="modal-content">
        <div className="form-container">
          <div className="form-section">
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Aquí puedes introducir una nueva contraseña para este usuario"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
