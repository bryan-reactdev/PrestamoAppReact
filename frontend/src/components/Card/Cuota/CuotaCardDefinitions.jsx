import { useState, useRef } from "react";
import ButtonAcciones from "../../Table/ButtonAcciones";
import { DateTimeToDate } from "../../../utils/dateUtils";
import { cuotasPendientesAcciones, cuotasPagadasAcciones } from "../../Table/Cuota/CuotaTableDefinitions";

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
