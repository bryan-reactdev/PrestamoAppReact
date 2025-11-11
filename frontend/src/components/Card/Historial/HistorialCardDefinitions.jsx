import { DateTimeToDate } from "../../../utils/dateUtils";

export const HistorialCard = ({row}) => {
    if (!row) return;

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-user">
                    <strong>{row.original.usuario}</strong>
                </div>

                <div className="card-date">
                    <i className='fas fa-calendar'/>
                    {row.original.fechaAccion ? DateTimeToDate(row.original.fechaAccion) : 'N/A'}
                </div>
            </div>

            <div className="card-content">
                <p className="p-2 text-sm text-left">{row.original.accion}</p>
            </div>
        </div>
    )
}

