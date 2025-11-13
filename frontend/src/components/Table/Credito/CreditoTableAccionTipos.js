import { 
  ButtonAceptarCredito, 
  ButtonDesembolsarCredito, 
  ButtonEditarCredito, 
  ButtonGenerarDocumentosCredito, 
  ButtonRechazarCredito, 
  ButtonVerCuotasCredito,
  ButtonVerDocumentoCredito
} from "./CreditoTableButtons";

const CreditoTableAccionTipos = {
  DESEMBOLSAR: ButtonDesembolsarCredito,
  VER_CUOTAS: ButtonVerCuotasCredito,
  ACEPTAR: ButtonAceptarCredito,
  RECHAZAR: ButtonRechazarCredito,
  GENERAR_DOCUMENTOS: ButtonGenerarDocumentosCredito,
  EDITAR: ButtonEditarCredito,
  VER_DOCUMENTO: ButtonVerDocumentoCredito,
};

export default CreditoTableAccionTipos;