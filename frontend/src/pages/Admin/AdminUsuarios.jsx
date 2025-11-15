import BaseTable from '../../components/Table/BaseTable'

import { useEffect, useState, useMemo } from 'react'
import { useUsuarioStore } from '../../stores/useUsuarioStore'
import { usuariosTodosColumns } from '../../components/Table/Usuario/UsuarioTableDefinitions'
import { UsuariosCard } from '../../components/Card/Usuario/UsuarioCardDefinitions'
import UsuarioModalVerDetalles from '../../components/Modal/Usuario/UsuarioModalVerDetalles'
import { Link } from 'react-router-dom'
import Layout from '../../Layout'

export default function AdminUsuarios(){
    const {usuarios, isFetchingUsuarios, getUsuarios, getUsuariosByEnabledStatus} = useUsuarioStore();
    
    const [currentTab, setCurrentTab] = useState('Usuarios Activos');

    // --- Get de los usuarios la PRIMERA vez que se inicializa esta página ---
    useEffect(() => {
        if (usuarios.length === 0) {
            getUsuarios();
        }
    }, [getUsuarios, usuarios.length]);
    
    // ⭐ Definición de Pestañas con Icono y Conteo
    const tabs = useMemo(() => {
        const usuariosActivos = getUsuariosByEnabledStatus(true) ?? [];
        const usuariosInactivos = getUsuariosByEnabledStatus(false) ?? [];
        
        return [
            { 
                label: 'Usuarios Activos', 
                icon: 'fas fa-user-check',
                iconBgColor: 'accent-light',
                value: usuariosActivos.length,
                text: usuariosActivos.length,
                data: usuariosActivos,
                isLoading: isFetchingUsuarios
            },
            { 
                label: 'Usuarios Inactivos', 
                icon: 'fas fa-user-times',
                iconBgColor: 'accent-light',
                value: usuariosInactivos.length,
                text: usuariosInactivos.length,
                data: usuariosInactivos,
                isLoading: isFetchingUsuarios
            },
            { 
                label: 'Todos', 
                icon: 'fas fa-users',
                iconBgColor: 'accent-light',
                value: usuarios.length,
                text: usuarios.length,
                data: usuarios,
                isLoading: isFetchingUsuarios
            }
        ];
    }, [usuarios, getUsuariosByEnabledStatus, isFetchingUsuarios]);


    const centered = ['calificacion', 'dui', 'celular', 'accion']

    return(
        <Layout>
            <UsuarioModalVerDetalles/>

            <div className="content">
                <BaseTable 
                    data={usuarios} 
                    columns={usuariosTodosColumns} 
                    card={UsuariosCard}
                    centered={centered} 
                    flexable='usuario' 
                    loading={isFetchingUsuarios}
                    customHeaderHeight={50}
                    tabs={tabs}
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                    isCardTabs={true}
                    showTabsAtTop={true}
                >
                    <Link className='btn-glass'to={'/admin/usuarios/crear'}><i className='fas fa-user'/> REGISTRAR USUARIO</Link>
                </BaseTable>
            </div>
            
        </Layout>
    )
}