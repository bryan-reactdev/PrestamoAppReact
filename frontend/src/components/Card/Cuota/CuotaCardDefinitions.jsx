import { useState, useRef } from "react";
import ButtonAcciones from "../../Table/ButtonAcciones";
import { DateTimeToDate } from "../../../utils/dateUtils";
import { cuotasPendientesAcciones, cuotasPagadasAcciones, cuotasCobrosAcciones } from "../../Table/Cuota/CuotaTableDefinitions";
import WhatsAppIcon from "../../Elements/WhatsAppIcon";
import { formatCurrencySV } from "../../../utils/currencyUtils";

export const CuotasPendientesCard = ({row}) => {
    if (!row) return;
    const [modalOpen, setModalOpen] = useState(false);
    const cardRef = useRef(null);

    const handleCardClick = () => {
        setModalOpen(!modalOpen);
    };

    return (
        <div 
            ref={cardRef}
            className={`card ${row.original.estado}`}
            onClick={handleCardClick}
        >    
            <div className="card-header">
                <div className="card-user">
                    <strong>{row.original.nombres} <br /> {row.original.apellidos}</strong> 
                </div>

                <div className="card-date">
                    <i className='fas fa-calendar'/>
                    {DateTimeToDate(row.original.fechaVencimiento)}
                </div>
            </div>

            <div className="card-content">
                <div className="card-monto" style={{color: `var(--color-${row.original.desembolsado ? 'success' : 'primary'})`}}>
                    <i className='fas fa-dollar-sign'/>
                    {row.original.total}
                </div>

                {/* <div className="card-desembolso">
                    <p className={`badge ${!row.original.desembolsado ? 'Pendiente' : 'Realizado' }`}>{!row.original.desembolsado ? 'PENDIENTE' : 'REALIZADO' }</p>
                </div> */}
            </div>

            <ButtonAcciones 
                acciones={cuotasPendientesAcciones} 
                row={row} 
                open={modalOpen}
                setOpen={setModalOpen}
                hideButton={true}
                containerRef={cardRef}
                modalMode={true}
            />
        </div>
    )
}

export const CuotasPagadasCard = ({row}) => {
    if (!row) return;
    const [modalOpen, setModalOpen] = useState(false);
    const cardRef = useRef(null);

    const handleCardClick = () => {
        setModalOpen(!modalOpen);
    };

    return (
        <div 
            ref={cardRef}
            className={`card ${row.original.estado}`}
            onClick={handleCardClick}
        >    
            <div className="card-header">
                <div className="card-user">
                    <strong>{row.original.nombres} <br /> {row.original.apellidos}</strong> 
                </div>

                <div className="card-date">
                    <i className='fas fa-calendar'/>
                    {DateTimeToDate(row.original.fechaPagado)}
                </div>
            </div>

            <div className="card-content">
                <div className="card-monto" style={{color: `var(--color-success)`}}>
                    <i className='fas fa-dollar-sign'/>
                    {row.original.total}
                </div>
            </div>

            <ButtonAcciones 
                acciones={cuotasPagadasAcciones} 
                row={row} 
                open={modalOpen}
                setOpen={setModalOpen}
                hideButton={true}
                containerRef={cardRef}
                modalMode={true}
            />
        </div>
    )
}

export const CuotasCobrosCard = ({row}) => {
    if (!row) return;
    const [modalOpen, setModalOpen] = useState(false);
    const cardRef = useRef(null);

    const handleCardClick = () => {
        setModalOpen(!modalOpen);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const estadoDisplay = row.original.estado === 'EnRevision' ? 'En Revisión' : row.original.estado;

    return (
        <div 
            ref={cardRef}
            className={`card ${row.original.estado}`}
            onClick={handleCardClick}
        >    
            <div className="card-header">
                <div className="card-user">
                    <strong>{row.original.usuario}</strong>
                    {row.original.celular && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <span style={{ fontSize: '0.9em', color: 'var(--color-text-secondary)' }}>
                                {row.original.celular}
                            </span>
                        </div>
                    )}
                </div>

                <div className="card-date">
                    <i className='fas fa-calendar'/>
                    {formatDate(row.original.cuotaVencimiento)}
                </div>
            </div>

            <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="card-monto" style={{color: `var(--color-${row.original.estado === 'Pagada' ? 'success' : row.original.estado === 'Vencida' ? 'danger' : 'primary'})`}}>
                        <i className='fas fa-dollar-sign'/>
                        {formatCurrencySV(row.original.cuotaTotal || row.original.totalPagar)}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <p className={`badge ${row.original.estado}`} style={{ margin: 0 }}>
                            {estadoDisplay}
                        </p>
                        {row.original.cuotasPendientes !== null && row.original.cuotasPendientes !== undefined && (
                            <span style={{ fontSize: '0.85em', color: 'var(--color-text-secondary)' }}>
                                <i className='fas fa-list' style={{ marginRight: '4px' }} />
                                {row.original.cuotasPendientes} pendiente{row.original.cuotasPendientes !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <ButtonAcciones 
                acciones={cuotasCobrosAcciones} 
                row={row} 
                open={modalOpen}
                setOpen={setModalOpen}
                hideButton={true}
                containerRef={cardRef}
                modalMode={true}
            />
        </div>
    )
}
