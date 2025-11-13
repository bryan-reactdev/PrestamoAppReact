import { 
  ButtonAceptarCredito, 
  ButtonDesembolsarCredito, 
  ButtonEditarCredito, 
  ButtonGenerarDocumentosCredito, 
  ButtonRechazarCredito, 
  ButtonVerCuotasCredito,
  ButtonVerDocumentoCredito,
  ButtonNotasCredito
} from "./CreditoTableButtons";

const CreditoTableAccionTipos = {
  DESEMBOLSAR: ButtonDesembolsarCredito,
  VER_CUOTAS: ButtonVerCuotasCredito,
  ACEPTAR: ButtonAceptarCredito,
  RECHAZAR: ButtonRechazarCredito,
  GENERAR_DOCUMENTOS: ButtonGenerarDocumentosCredito,
  EDITAR: ButtonEditarCredito,
  VER_DOCUMENTO: ButtonVerDocumentoCredito,
  NOTAS: ButtonNotasCredito,
};

export default CreditoTableAccionTipos;