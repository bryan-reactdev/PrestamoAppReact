import { ButtonVerDetallesUsuario, ButtonCrearCreditoUsuario, ButtonVerCreditosUsuario, ButtonBloquearUsuario, ButtonDesbloquearUsuario, ButtonDescargarPDFInforme, ButtonVerCuotasUsuario } from "./UsuarioTableButtons";

const UsuarioTableAccionTipos = {
  DESCARGAR_PDF_INFORME: ButtonDescargarPDFInforme,
  VER_DETALLES: ButtonVerDetallesUsuario,
  CREAR_CREDITO: ButtonCrearCreditoUsuario,
  VER_CUOTAS: ButtonVerCuotasUsuario,
  VER_CREDITOS: ButtonVerCreditosUsuario,
  BLOQUEAR: ButtonBloquearUsuario,
  DESBLOQUEAR: ButtonDesbloquearUsuario,
};

export default UsuarioTableAccionTipos;