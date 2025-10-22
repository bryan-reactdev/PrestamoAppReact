import { useModalStore } from "../../../stores/Modal/useModalStore";
import { DateTimeToDate } from "../../../utils/dateUtils";
import { creditosAceptadosAcciones, creditosDefaultAcciones, creditosPendientesAcciones } from "../../Table/Credito/CreditoTableDefinitions";

export const CreditosAceptadosCard = ({row}) => {
    if (!row) return;
    const { openAccionesModal } = useModalStore();

    return (
        <div className={`card ${row.original.estado}`} onClick={() => openAccionesModal(row, creditosAceptadosAcciones)}>
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
        </div>
    )
}

export const CreditosPendientesCard = ({row}) => {
    if (!row) return;
    const { openAccionesModal } = useModalStore();

    return (
        <div className={`card ${row.original.estado}`} onClick={() => openAccionesModal(row, creditosPendientesAcciones)}>
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
        </div>
    )
}

export const CreditosDefaultCard = ({row}) => {
    if (!row) return;
    const { openAccionesModal } = useModalStore();

    return (
        <div className={`card ${row.original.estado}`} onClick={() => openAccionesModal(row, creditosDefaultAcciones)}>
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
        </div>
    )
}
