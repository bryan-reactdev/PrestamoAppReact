import { DateTimeToDate } from "../../../utils/dateUtils";

export const CuotasPendientesCard = ({row}) => {
    if (!row) return;

    return (
        <div className={`card ${row.original.estado}`}>
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
        </div>
    )
}

export const CreditosRechazadosCard = ({row}) => {
    if (!row) return;

    return (
        <div className={`card ${row.original.estado}`}>
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
