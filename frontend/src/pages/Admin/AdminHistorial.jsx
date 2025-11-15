import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import ContentTitle from '../../components/Content/ContentTitle'
import { useEffect, useState } from 'react'

import { useHistorialStore } from '../../stores/useHistorialStore'
import { historialColumns } from '../../components/Table/Historial/HistorialTableDefinitions'
import { HistorialCard } from '../../components/Card/Historial/HistorialCardDefinitions'
import BaseTable from '../../components/Table/BaseTable'
import Layout from '../../Layout'

export default function AdminHistorial(){
  const [currentTab, setCurrentTab] = useState('Todos'); // Default to 'Todos'

  const { historial, getHistorial, isFetchingHistorial } = useHistorialStore();
  const [historialHoy, setHistorialHoy] = useState([]);
  const [historialSemana, setHistorialSemana] = useState([]);
  const [historialMes, setHistorialMes] = useState([]);

  useEffect(() => {
    if (historial?.length === 0) {
      getHistorial();
    }
  }, [getHistorial]);

  // --- Calcular Hoy, Semana y Mes cuando historial cambia inicialmente ---
  useEffect(() => {
    if (!historial?.length) return;

    const now = new Date();
    const hoy = now.getFullYear() + '-' +
          String(now.getMonth() + 1).padStart(2, '0') + '-' +
          String(now.getDate()).padStart(2, '0');

    setHistorialHoy(
      historial.filter(a => {
        return a.fechaAccion && a.fechaAccion.startsWith(hoy)
      })
    );
  }, [historial]);

  const centered = ['fechaAccion']
  const tabs = [
    { label: 'Todos'},
    { label: 'Hoy', data: historialHoy},
  ];

  return(
    <Layout>
      <div className="content">

        
        <BaseTable 
          data={historial}
          card={HistorialCard}
          columns={historialColumns} 
          centered={centered} 
          flexable='accion' 
          loading={isFetchingHistorial}
          customHeaderHeight={50}
          tabs={tabs} 
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />
      </div>
    </Layout>
  )
}