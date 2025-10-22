import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import BaseTable from '../../components/Table/BaseTable'

import { useEffect } from 'react'
import { useUsuarioStore } from '../../stores/useUsuarioStore'
import { usuariosTodosColumns } from '../../components/Table/Usuario/UsuarioTableDefinitions'
import { UsuariosCard } from '../../components/Card/Usuario/UsuarioCardDefinitions'
import AccionesModal from '../../components/Card/AccionesModal'
import UsuarioModalVerDetalles from '../../components/Modal/Usuario/UsuarioModalVerDetalles'

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
    <div className="page">
      <Navbar/>
      <Sidebar activePage={'usuarios'}/>

      <AccionesModal/>
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
        />
      </div>
      
    </div>
  )
}