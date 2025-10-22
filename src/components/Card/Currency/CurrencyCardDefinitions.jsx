import { DateTimeToDate } from "../../../utils/dateUtils";

export const IngresoEgresoCard = ({row}) => {
    if (!row) return;

    return (
        <div className={`card ${row.original.estado}`}>    
            <div className="card-header">
                <div className="card-user">
                    <strong>{row.original.motivo}</strong> 
                </div>

                <div className="card-date">
                    <i className='fas fa-calendar'/>
                    {DateTimeToDate(row.original.fecha)}
                </div>
            </div>

            <div className="card-content">
                <div className="card-monto">
                    <i className='fas fa-dollar-sign'/>
                    {row.original.monto}
                </div>
            </div>
        </div>
    )
}
