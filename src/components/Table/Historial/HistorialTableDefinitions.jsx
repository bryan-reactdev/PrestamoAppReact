// --- Columnas del historial ---
export const historialColumns = [
  {
    accessorKey: 'usuario',
    header: "Usuario",
    size: 150,
    cell: (props) => <p>{props.getValue()}</p>
  },
  {
    accessorKey: 'accion',
    header: "Acción",
    cell: (props) => <p>{props.getValue()}</p>  
  },
  {
    accessorKey: 'fechaAccion',
    header: "Fecha de Acción",
    size: 190,
    cell: (props) => {
      const value = props.getValue();
      if (!value) return <p>N/A</p>;

      const date = new Date(value);
      const formatted = date.toLocaleString('es-SV', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      return <p>{formatted.replace(',', '')}</p>;
    }
  }
]