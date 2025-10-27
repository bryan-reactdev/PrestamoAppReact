import { useState, useRef } from "react";
import ButtonAcciones from "../../Table/ButtonAcciones";
import { usuarioAcciones } from "../../Table/Usuario/UsuarioTableDefinitions";

export const UsuariosCard = ({row}) => {
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
                    <strong>{row.original.usuario}</strong> 
                </div>

                <div className="card-date">
                    <i className='fas fa-phone'/>
                    {row.original.celular}
                </div>

                <div className="card-frecuencia">
                    <i className='fas fa-envelope'/>
                    {row.original.email}
                </div>
            </div>

            <div className="card-content">
                <div className="card-monto">
                    <p className={row.original.calificacion}>{row.original.calificacion === 'A_PLUS' ? 'A+' : row.original.calificacion }</p>
                </div>

                {/* <div className="card-desembolso">
                    <p className={`badge ${!row.original.desembolsado ? 'Pendiente' : 'Realizado' }`}>{!row.original.desembolsado ? 'PENDIENTE' : 'REALIZADO' }</p>
                </div> */}
            </div>

            <ButtonAcciones 
                acciones={usuarioAcciones} 
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
