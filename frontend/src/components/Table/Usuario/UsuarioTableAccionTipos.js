import { ButtonVerDetallesUsuario, ButtonCrearCreditoUsuario, ButtonVerCreditosUsuario, ButtonBloquearUsuario, ButtonDesbloquearUsuario, ButtonDescargarPDFInforme, ButtonVerDetallesCobroUsuario } from "./UsuarioTableButtons";

const UsuarioTableAccionTipos = {
  DESCARGAR_PDF_INFORME: ButtonDescargarPDFInforme,
  VER_DETALLES: ButtonVerDetallesUsuario,
  CREAR_CREDITO: ButtonCrearCreditoUsuario,
  VER_CREDITOS: ButtonVerCreditosUsuario,
  BLOQUEAR: ButtonBloquearUsuario,
  DESBLOQUEAR: ButtonDesbloquearUsuario,
  VER_DETALLES_COBRO: ButtonVerDetallesCobroUsuario,
};

export default UsuarioTableAccionTipos;