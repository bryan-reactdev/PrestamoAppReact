import { 
  ButtonAceptarCredito, 
  ButtonDescargableCredito, 
  ButtonDesembolsarCredito, 
  ButtonEditableCredito, 
  ButtonEditarCredito, 
  ButtonGenerarDocumentosCredito, 
  ButtonRechazarCredito, 
  ButtonVerCuotasCredito
} from "./CreditoTableButtons";

const CreditoTableAccionTipos = {
  DESEMBOLSAR: ButtonDesembolsarCredito,
  VER_CUOTAS: ButtonVerCuotasCredito,
  ACEPTAR: ButtonAceptarCredito,
  RECHAZAR: ButtonRechazarCredito,
  GENERAR_DOCUMENTOS: ButtonGenerarDocumentosCredito,
  EDITAR: ButtonEditarCredito,
  EDITABLE: ButtonEditableCredito,
  DESCARGABLE: ButtonDescargableCredito,
};

export default CreditoTableAccionTipos;