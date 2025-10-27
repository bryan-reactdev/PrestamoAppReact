import { useState, useRef } from "react";
import ButtonAcciones from "../../Table/ButtonAcciones";
import { DateTimeToDate } from "../../../utils/dateUtils";
import { creditosAceptadosAcciones, creditosDefaultAcciones, creditosPendientesAcciones } from "../../Table/Credito/CreditoTableDefinitions";

export const CreditosAceptadosCard = ({row, disableModal = false, selectedRowId, onRowSelect}) => {
    if (!row) return;
    const [modalOpen, setModalOpen] = useState(false);
    const cardRef = useRef(null);

    const handleCardClick = () => {
        if (disableModal) {
            // In refinanciar context, just select the row
            onRowSelect?.(row.original);
        } else {
            // In regular context, toggle modal
            setModalOpen(!modalOpen);
        }
    };

    const isSelected = row.id === selectedRowId;

    return (
        <div 
            ref={cardRef}
            className={`card ${row.original.estado} ${isSelected ? 'selected-row' : ''}`}
            onClick={handleCardClick}
            style={{ cursor: disableModal ? (onRowSelect ? 'pointer' : 'default') : 'pointer' }}
        >
            <div className="card-header">
                <div className="card-user">
                    <strong>{row.original.nombres} <br /> {row.original.apellidos}</strong> 
                </div>

                <div className="card-date">
                    <i className='fas fa-calendar'/>
                    {row.original.estado === 'Aceptado' 
                        ? DateTimeToDate(row.original.fechaAceptado) 
                        : 'No aceptado'
                    }
                </div>

                <div className="card-frecuencia">
                    <i className='fas fa-clock'/>
                    {row.original.frecuencia}
                </div>
            </div>

            <div className="card-content">
                <div className="card-monto" style={{color: `var(--color-${row.original.desembolsado ? 'success' : 'primary'})`}}>
                    <i className='fas fa-dollar-sign'/>
                    {row.original.refinanciado ? row.original.montoDesembolsar : row.original.monto}
                </div>

                <div className="card-desembolso">
                    <p className={`badge ${!row.original.desembolsado ? 'Pendiente' : 'Realizado' }`}>{!row.original.desembolsado ? 'PENDIENTE' : 'REALIZADO' }</p>
                </div>
            </div>

            {!disableModal && (
                <ButtonAcciones 
                    acciones={creditosAceptadosAcciones} 
                    row={row} 
                    open={modalOpen}
                    setOpen={setModalOpen}
                    hideButton={true}
                    containerRef={cardRef}
                    modalMode={true}
                />
            )}
        </div>
    )
}

export const CreditosPendientesCard = ({row}) => {
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
                    {row.original.estado === 'Aceptado' 
                        ? DateTimeToDate(row.original.fechaAceptado) 
                        : 'No aceptado'
                    }
                </div>

                <div className="card-frecuencia">
                    <i className='fas fa-clock'/>
                    {row.original.frecuencia}
                </div>
            </div>
            
            <div className="card-content">
                <div className="card-monto" style={{color: `var(--color-${row.original.desembolsado ? 'success' : 'primary'})`}}>
                    <i className='fas fa-dollar-sign'/>
                    {row.original.refinanciado ? row.original.montoDesembolsar : row.original.monto}
                </div>
            </div>

            <ButtonAcciones 
                acciones={creditosPendientesAcciones} 
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

export const CreditosDefaultCard = ({row}) => {
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
                    {row.original.estado === 'Aceptado' 
                        ? DateTimeToDate(row.original.fechaAceptado) 
                        : 'No aceptado'
                    }
                </div>

                <div className="card-frecuencia">
                    <i className='fas fa-clock'/>
                    {row.original.frecuencia}
                </div>
            </div>
            <div className="card-content">
                <div className="card-monto" style={{color: `var(--color-${row.original.desembolsado ? 'success' : 'primary'})`}}>
                    <i className='fas fa-dollar-sign'/>
                    {row.original.refinanciado ? row.original.montoDesembolsar : row.original.monto}
                </div>
            </div>

            <ButtonAcciones 
                acciones={creditosDefaultAcciones} 
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
