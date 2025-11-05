import ContentTitle from '../../components/Content/ContentTitle'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect } from 'react'
import { useUsuarioStore } from '../../stores/useUsuarioStore'
import { usuariosTodosColumns } from '../../components/Table/Usuario/UsuarioTableDefinitions'
import { UsuariosCard } from '../../components/Card/Usuario/UsuarioCardDefinitions'
import UsuarioModalVerDetalles from '../../components/Modal/Usuario/UsuarioModalVerDetalles'
import { Link } from 'react-router-dom'
import Layout from '../../Layout'

export default function AdminUsuarios(){
  const {usuarios, isFetchingUsuarios, getUsuarios} = useUsuarioStore();

  // --- Get de los créditos la PRIMERA vez que se inicializa esta página ---
  useEffect(() => {
    if (usuarios.length === 0) {
      getUsuarios();
    }
  }, [getUsuarios]);
  
  // Definición de las columnas que estarán centradas
  const centered = ['calificacion', 'dui', 'celular', 'accion']

  return(
    <Layout>
      <UsuarioModalVerDetalles/>

      <div className="content">
        <ContentTitle title={'Usuarios'} subtitle={'Gestión de Usuarios'}/>

        <BaseTable 
          data={usuarios} 
          columns={usuariosTodosColumns} 
          card={UsuariosCard}
          centered={centered} 
          flexable='usuario' 
          loading={isFetchingUsuarios}
          customHeaderHeight={50}
        >
          <Link className='btn-primary'to={'/admin/usuarios/crear'}><i className='fas fa-user'/>REGISTRAR USUARIO</Link>
        </BaseTable>
      </div>
      
    </Layout>
  )
}