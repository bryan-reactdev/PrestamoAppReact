import ContentTitle from '../../components/Content/ContentTitle'
import BaseTable from '../../components/Table/BaseTable'
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'

import { useEffect, useState, useMemo } from 'react'
import { useUsuarioStore } from '../../stores/useUsuarioStore'
import { usuariosTodosColumns } from '../../components/Table/Usuario/UsuarioTableDefinitions'
import { UsuariosCard } from '../../components/Card/Usuario/UsuarioCardDefinitions'
import UsuarioModalVerDetalles from '../../components/Modal/Usuario/UsuarioModalVerDetalles'
import { Link } from 'react-router-dom'
import Layout from '../../Layout'

// --- Definición de color para los iconos de las pestañas ---
const getIconBgColor = (iconBgColor) => {
    const colorMap = {
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'accent': 'var(--color-accent)',
        'primary': 'var(--color-primary)'
    };
    return colorMap[iconBgColor] || 'var(--color-primary)';
}

export default function AdminUsuarios(){
    const {usuarios, isFetchingUsuarios, getUsuarios, getUsuariosByEnabledStatus} = useUsuarioStore();
    
    const [activeTab, setActiveTab] = useState('activos');

    // --- Get de los usuarios la PRIMERA vez que se inicializa esta página ---
    useEffect(() => {
        if (usuarios.length === 0) {
            getUsuarios();
        }
    }, [getUsuarios, usuarios.length]);
    
    // ⭐ Lógica de Filtrado 
    const filteredUsers = useMemo(() => {
        if (isFetchingUsuarios || usuarios.length === 0) return [];
        
        switch (activeTab) {
            case 'activos':
                return getUsuariosByEnabledStatus(true);
            case 'inactivos':
                return getUsuariosByEnabledStatus(false);
            case 'todos':
            default:
                return usuarios;
        }
    }, [usuarios, activeTab, isFetchingUsuarios, getUsuariosByEnabledStatus]);
    
    // ⭐ Definición de Pestañas con Icono y Conteo
    const tabDefinitions = useMemo(() => ([
        { 
            label: 'Usuarios Activos', 
            tabId: 'activos',
            icon: 'fas fa-user-check',
            iconBgColor: 'success',
            value: getUsuariosByEnabledStatus(true)?.length ?? 0
        },
        { 
            label: 'Usuarios Inactivos', 
            tabId: 'inactivos',
            icon: 'fas fa-user-times',
            iconBgColor: 'warning',
            value: getUsuariosByEnabledStatus(false)?.length ?? 0
        },
        { 
            label: 'Todos', 
            tabId: 'todos',
            icon: 'fas fa-users',
            iconBgColor: 'primary',
            value: usuarios.length ?? 0
        }
    ]), [usuarios, getUsuariosByEnabledStatus]);


    const centered = ['calificacion', 'dui', 'celular', 'accion']

    return(
        <Layout>
            <UsuarioModalVerDetalles/>

            <div className="content">
      

                {/* --- CONTENEDOR DE PESTAÑAS TIPO TARJETA --- */}
                <div className="w-full flex flex-row gap-2 mb-4">
                    {tabDefinitions.map((tab) => (
                        <Card
                            key={tab.tabId}
                            className={`@container/card tab ${activeTab === tab.tabId ? 'active' : ''} cursor-pointer min-w-[150px] max-w-full flex-1 p-3 transition-all duration-150 relative ${
                                activeTab === tab.tabId 
                                    ? 'scale-[0.975] bg-[var(--color-accent-light)] border-[var(--border-width-sm)] border-[var(--color-accent)]' 
                                    : 'hover:brightness-90'
                            } ${isFetchingUsuarios ? 'opacity-50 pointer-events-none' : ''}`}
                            onClick={() => setActiveTab(tab.tabId)}
                        >
                            <CardHeader className="flex flex-row p-0">
                                <div className="flex items-center gap-2 w-full">
                                    <div 
                                        className='flex items-center justify-center p-3 px-4 rounded-md shrink-0' 
                                        style={{ backgroundColor: getIconBgColor(tab.iconBgColor) }}
                                    >
                                        <i className={`${tab.icon} text-white !text-lg`} />
                                    </div>

                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                        {/* Conteo de Usuarios */}
                                        <CardDescription className={`whitespace-nowrap truncate ${activeTab === tab.tabId ? 'text-white' : ''}`}>
                                            {tab.value} Usuarios
                                        </CardDescription>
                                        
                                        {/* Nombre de la Pestaña */}
                                        <CardTitle className={`text-xl font-semibold m-0 p-0 whitespace-nowrap truncate ${activeTab === tab.tabId ? 'text-white' : ''}`}>
                                            {tab.label}
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                {/* --- FIN CONTENEDOR DE PESTAÑAS TIPO TARJETA --- */}

                <BaseTable 
                    data={filteredUsers} 
                    columns={usuariosTodosColumns} 
                    card={UsuariosCard}
                    centered={centered} 
                    flexable='usuario' 
                    loading={isFetchingUsuarios}
                    customHeaderHeight={50}
                    // Ahora el botón es un CHILD de BaseTable, lo que asegura que se renderice
                >
                    <Link className='btn-primary'to={'/admin/usuarios/crear'}><i className='fas fa-user'/> REGISTRAR USUARIO</Link>
                </BaseTable>
            </div>
            
        </Layout>
    )
}