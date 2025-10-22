import { DateTimeToDate } from "../../../utils/dateUtils";
import { cuotasPendientesAcciones } from "../../Table/Cuota/CuotaTableDefinitions";

export const CuotasPendientesCard = ({row}) => {
    if (!row) return;

    return (
        <div className={`card ${row.original.estado}`} onClick={() => openAccionesModal(row, cuotasPendientesAcciones)}>    
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
