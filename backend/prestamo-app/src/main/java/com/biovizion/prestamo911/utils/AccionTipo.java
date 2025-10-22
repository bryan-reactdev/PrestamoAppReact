package com.biovizion.prestamo911.utils;

public enum AccionTipo {
    // Creado Admin
    CREADO_USUARIO_ADMIN("Registró el usuario: "),
    CREADO_TRABAJADOR_ADMIN("Registró el trabajador: "),
    CREADO_CREDITO_ADMIN("Creó un credito para: "),
    REGISTRADO_INGRESO_ADMIN("Registró un ingreso"),
    REGISTRADO_GASTO_ADMIN("Registró un gasto"),

    // PDF Admin
    DESCARGADO_PDF_ADMIN("Descargó documentos de un crédito de: "),
    DESCARGADO_USUARIO_PDF_ADMIN("Descargó un informe de: "),
    DESCARGADO_REPORTE_PDF_ADMIN("Descargó un reporte diario"),
    DESCARGADO_CUOTAS_PDF_ADMIN("Descargó las cuotas de un crédito de: "),

    // Editado Admin
    EDITADO_CREDITO_ADMIN("Editó un credito de: "),
    EDITADO_CUOTA_ADMIN("Editó una cuota de: "),
    MARCADO_COMO_LEIDO_MENSAJE("Marcó un mensaje como leido"),
    MARCADO_COMO_NO_LEIDO_MENSAJE("Marcó un mensaje como no leido"),

    // Credito Admin
    DESEMBOLSADO_CREDITO_ADMIN("Marcó como desembolsado un credito de: "),
    REVERTIR_DESEMBOLSADO_CREDITO_ADMIN("Revirtió el desembolso de un credito de: "),
    ACEPTADO_CREDITO_ADMIN("Aceptó un credito de: "),
    RECHAZADO_CREDITO_ADMIN("Rechazó un credito de: "),
    EDITABLE_CREDITO_ADMIN("Hizo un credito descargable para: "),
    DESCARGABLE_CREDITO_ADMIN("Hizo un credito editable para: "),
    DESEMBOLSABLE_CREDITO_ADMIN("Hizo un credito desembolsable para: "),
    
    // Cuota Admin
    MARCADO_PAGADO_CUOTA_ADMIN("Marco como pagada una cuota de: "),
    REVISADO_CUOTA_ADMIN("Confirmó el pago de una cuota de: "),
    ABONO_CUOTA("Registro un abono a una cuota de: "),

    // Creado Usuario
    SOLICITUD_CREADO("Hizo una solicitud"),
    
    // Editado Usuario
    USUARIO_EDITADO("Editó su usuario"),
    CREDITO_EDITADO("Editó un credito");

    private final String descripcion;

    AccionTipo(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}

