package com.biovizion.prestamo911.service;

import com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.UsuarioCuotasDTO;
import com.biovizion.prestamo911.entities.AbonoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.HistorialCobrosEntity;
import com.biovizion.prestamo911.entities.HistorialGastoEntity;
import com.biovizion.prestamo911.entities.HistorialSaldoEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.temporal.ChronoUnit;
import java.math.RoundingMode;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URL;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PdfService {

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Autowired
    private BalanceService balanceService;

    public void generarFacturaPDF(CreditoCuotaEntity cuota, HttpServletResponse response) {
        try {
            // Preparar contexto de Thymeleaf
            Context context = new Context();
            context.setVariable("cuota", cuota);

            // Logo dentro del JAR
            URL logoResource = getClass().getClassLoader().getResource("static/img/logo.jpg");
            if (logoResource != null) {
                context.setVariable("logoUrl", logoResource.toExternalForm());
            }

            // Renderizar HTML desde la plantilla
            String htmlContent = templateEngine.process("fragments/pdf_factura", context);

            // Configurar la respuesta
            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=factura-cuota-" + cuota.getId() + ".pdf");

            try (OutputStream os = response.getOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.useFastMode();
                builder.withHtmlContent(htmlContent, null);
                builder.toStream(os);
                builder.run();
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF desde HTML: " + e.getMessage(), e);
        }
    }

    public void generarUsuarioSolicitudPDF(UsuarioSolicitudEntity usuarioSolicitud,
                                           UsuarioEntity usuario,
                                           CreditoEntity credito,
                                           String pdfNombre,
                                           HttpServletResponse response) {
        try {
            Context context = new Context();
            context.setVariable("usuarioSolicitud", usuarioSolicitud);
            context.setVariable("credito", credito);
            context.setVariable("usuario", usuario); // añadimos UsuarioEntity

            // Ruta base donde se guardan las fotos
            String rutaBase = "/opt/prestamo911";

            // Dui usuario
            if (usuario.getDuiDelante() != null)
                usuario.setDuiDelante("file://" + rutaBase + usuario.getDuiDelante());
            if (usuario.getDuiAtras() != null)
                usuario.setDuiAtras("file://" + rutaBase + usuario.getDuiAtras());

            // Dui codeudor
            if (usuarioSolicitud.getDuiDelanteCodeudor() != null)
                usuarioSolicitud.setDuiDelanteCodeudor("file://" + rutaBase + usuarioSolicitud.getDuiDelanteCodeudor());
            if (usuarioSolicitud.getDuiAtrasCodeudor() != null)
                usuarioSolicitud.setDuiAtrasCodeudor("file://" + rutaBase + usuarioSolicitud.getDuiAtrasCodeudor());

            // Recibo
            if (usuarioSolicitud.getFotoRecibo() != null)
                usuarioSolicitud.setFotoRecibo("file://" + rutaBase + usuarioSolicitud.getFotoRecibo());


                // Logo dentro del JAR
            URL logoResource = getClass().getClassLoader().getResource("static/img/logo.jpg");
            if (logoResource != null) {
                context.setVariable("logoUrl", logoResource.toExternalForm());
            }

            pdfNombre = "fragments/" + pdfNombre;
            String htmlContent = templateEngine.process(pdfNombre, context);

            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=usuario-solicitud-" + usuarioSolicitud.getId() + ".pdf");

            try (OutputStream os = response.getOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.useFastMode();
                builder.withHtmlContent(htmlContent, null);
                builder.toStream(os);
                builder.run();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF de solicitud: " + e.getMessage(), e);
        }
    }

    
    public void generarUsuarioInformePDF(UsuarioEntity usuario,
                                        List<CreditoEntity> creditos,
                                        HttpServletResponse response) {
        try {
            CreditoEntity ultimoCredito = creditos.stream()
                .max(Comparator.comparing(c -> c.getUsuarioSolicitud().getFechaSolicitud()))
                .orElse(null); // or throw an exception if you expect at least one

            for (CreditoEntity credito : creditos) {
                for (CreditoCuotaEntity cuota : credito.getCuotas()) {
                    String observacion = calcularObservaciones(cuota);
                    cuota.setObservaciones(observacion);
                }
            }
                
            Context context = new Context();
            context.setVariable("credito", ultimoCredito);
            context.setVariable("usuario", usuario);
            context.setVariable("creditos", creditos);
            context.setVariable("usuarioSolicitud",
                ultimoCredito != null ? ultimoCredito.getUsuarioSolicitud() : null);


            // Ruta base donde se guardan las fotos
            String rutaBase = "/opt/prestamo911";

            // Dui usuario
            if (usuario.getDuiDelante() != null)
                usuario.setDuiDelante("file://" + rutaBase + usuario.getDuiDelante());
            if (usuario.getDuiAtras() != null)
                usuario.setDuiAtras("file://" + rutaBase + usuario.getDuiAtras());

            // Logo dentro del JAR
            URL logoResource = getClass().getClassLoader().getResource("static/img/logo.jpg");
            if (logoResource != null) {
                context.setVariable("logoUrl", logoResource.toExternalForm());
            }

            String htmlContent = templateEngine.process("fragments/PDFUsuarioInforme", context);

            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=usuario-informe-" + usuario.getId() + ".pdf");

            try (OutputStream os = response.getOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.useFastMode();
                builder.withHtmlContent(htmlContent, null);
                builder.toStream(os);
                builder.run();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF de solicitud: " + e.getMessage(), e);
        }
    }

    public void generarReporteDiarioIngreso(BigDecimal saldo, List<CreditoCuotaEntity> cuotas, List<AbonoCuotaEntity> abonos, List<HistorialSaldoEntity> ingresos, LocalDate fecha, HttpServletResponse response) {
        try {
            // 🔢 Calculate totals            
            BigDecimal totalCuotas = cuotas.stream()
            .map(CreditoCuotaEntity::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal totalAbonos = abonos.stream()
            .map(AbonoCuotaEntity::getMonto)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalIngresos = ingresos.stream()
                    .map(HistorialSaldoEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<HistorialSaldoEntity> ingresosCapitales = ingresos.stream()
                                                            .filter(i -> "Capital".equals(i.getTipo()))
                                                            .collect(Collectors.toList());


            List<HistorialSaldoEntity> ingresosVarios = ingresos.stream()
                                                            .filter(i -> "Varios".equals(i.getTipo()))
                                                            .collect(Collectors.toList());

            Context context = new Context();
            context.setVariable("saldo", saldo);
            context.setVariable("ingresosCapitales", ingresosCapitales);
            context.setVariable("ingresosVarios", ingresosVarios);
            context.setVariable("cuotas", cuotas);
            context.setVariable("abonos", abonos);
            context.setVariable("totalIngresos", totalIngresos);
            context.setVariable("totalCuotas", totalCuotas);
            context.setVariable("totalAbonos", totalAbonos);
            context.setVariable("fecha", fecha);

            // Logo dentro del JAR
            URL logoResource = getClass().getClassLoader().getResource("static/img/logo.jpg");
            if (logoResource != null) {
                context.setVariable("logoUrl", logoResource.toExternalForm());
            }

            String htmlContent = templateEngine.process("fragments/PDFReporteDiarioIngreso", context);

            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=reporte-diario-" + fecha.toString() + ".pdf");

            try (OutputStream os = response.getOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.useFastMode();
                builder.withHtmlContent(htmlContent, null);
                builder.toStream(os);
                builder.run();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF de Reporte Diario: " + e.getMessage(), e);
        }
    }
    
    public void generarReporteDiarioEgreso(BigDecimal saldo, List<CreditoEntity> creditos, List<HistorialGastoEntity> gastos, LocalDate fecha, HttpServletResponse response) {
        try {
            // 🔢 Calculate totals
            BigDecimal totalCreditos = creditos.stream()
                    .map(CreditoEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalGastos = gastos.stream()
                    .map(HistorialGastoEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<HistorialGastoEntity> gastosEmpresa = gastos.stream()
                                                        .filter(i -> "Empresa".equals(i.getTipo()))
                                                        .collect(Collectors.toList());

            List<HistorialGastoEntity> gastosVarios = gastos.stream()
                                                        .filter(i -> "Varios".equals(i.getTipo()))
                                                        .collect(Collectors.toList());

            List<HistorialGastoEntity> pagoPlanillas = gastos.stream()
                                                            .filter(i -> "Pago de Planillas".equals(i.getTipo()))
                                                            .collect(Collectors.toList());

            List<HistorialGastoEntity> retiros = gastos.stream()
                                                        .filter(i -> "Retiro de Cuotas".equals(i.getTipo()))
                                                        .collect(Collectors.toList());
            Context context = new Context();
            context.setVariable("saldo", saldo);
            context.setVariable("creditos", creditos);
            context.setVariable("gastosEmpresa", gastosEmpresa);
            context.setVariable("gastosVarios", gastosVarios);
            context.setVariable("pagoPlanillas", pagoPlanillas);
            context.setVariable("retiros", retiros);
            context.setVariable("totalCreditos", totalCreditos);
            context.setVariable("totalGastos", totalGastos);
            context.setVariable("fecha", fecha);

            // Logo dentro del JAR
            URL logoResource = getClass().getClassLoader().getResource("static/img/logo.jpg");
            if (logoResource != null) {
                context.setVariable("logoUrl", logoResource.toExternalForm());
            }

            String htmlContent = templateEngine.process("fragments/PDFReporteDiarioEgreso", context);

            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=reporte-diario-" + fecha.toString() + ".pdf");

            try (OutputStream os = response.getOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.useFastMode();
                builder.withHtmlContent(htmlContent, null);
                builder.toStream(os);
                builder.run();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF de Reporte Diario: " + e.getMessage(), e);
        }
    }

    public void generarReporteDiarioCompleto(
            BigDecimal saldo,
            List<CreditoCuotaEntity> cuotas,
            List<AbonoCuotaEntity> abonos,
            List<HistorialSaldoEntity> ingresos,
            List<CreditoEntity> creditos,
            List<HistorialGastoEntity> gastos,
            List<CreditoEntity> creditosOtorgados,
            List<CreditoEntity> creditosDenegados,
            LocalDate fecha,
            List<CreditoCuotaEntity> cuotasPendientesDia,
            List<CreditoCuotaEntity> cuotasVencidasDia,
            List<CreditoCuotaEntity> cuotasPagadasDia,
            List<CreditoCuotaEntity> cuotasPendientesGlobal,
            List<CreditoCuotaEntity> cuotasVencidasGlobal,
            List<CreditoCuotaEntity> cuotasPagadasGlobal,
            List<HistorialCobrosEntity> historialCobros,
            BigDecimal totalIngresosCapitalesGlobal,
            BigDecimal totalCuotasPagadasGlobalValue,
            HttpServletResponse response) {
        try {
            // 🔢 Calculate totals for ingresos
            BigDecimal totalCuotas = cuotas.stream()
                .map(CreditoCuotaEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal totalAbonos = abonos.stream()
                .map(AbonoCuotaEntity::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalIngresos = ingresos.stream()
                    .map(HistorialSaldoEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<HistorialSaldoEntity> ingresosCapitales = ingresos.stream()
                                                                .filter(i -> "Capital".equals(i.getTipo()))
                                                                .collect(Collectors.toList());

            List<HistorialSaldoEntity> ingresosVarios = ingresos.stream()
                                                                .filter(i -> "Varios".equals(i.getTipo()))
                                                                .collect(Collectors.toList());

            // 🔢 Calculate totals for egresos
            BigDecimal totalCreditos = creditos.stream()
                    .map(CreditoEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalGastos = gastos.stream()
                    .map(HistorialGastoEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<HistorialGastoEntity> gastosEmpresa = gastos.stream()
                                                            .filter(i -> "Empresa".equals(i.getTipo()))
                                                            .collect(Collectors.toList());

            List<HistorialGastoEntity> gastosVarios = gastos.stream()
                                                            .filter(i -> "Varios".equals(i.getTipo()))
                                                            .collect(Collectors.toList());

            List<HistorialGastoEntity> pagoPlanillas = gastos.stream()
                                                            .filter(i -> "Pago de Planillas".equals(i.getTipo()))
                                                            .collect(Collectors.toList());

            List<HistorialGastoEntity> retiros = gastos.stream()
                                                        .filter(i -> "Retiro de Cuotas".equals(i.getTipo()))
                                                        .collect(Collectors.toList());

            BigDecimal totalIngresosVarios = ingresosVarios.stream()
                    .map(HistorialSaldoEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalGastosVarios = gastosVarios.stream()
                    .map(HistorialGastoEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalPagoPlanillas = pagoPlanillas.stream()
                    .map(HistorialGastoEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalRetiros = retiros.stream()
                    .map(HistorialGastoEntity::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalIngresosGeneral = totalCuotas.add(totalAbonos).add(totalIngresos);
            BigDecimal totalEgresosGeneral = totalCreditos.add(totalGastos);

            Context context = new Context();
            context.setVariable("saldo", saldo);
            
            // Ingresos
            context.setVariable("cuotas", cuotas);
            context.setVariable("abonos", abonos);
            context.setVariable("ingresosCapitales", ingresosCapitales);
            context.setVariable("ingresosVarios", ingresosVarios);
            context.setVariable("totalCuotas", totalCuotas);
            context.setVariable("totalAbonos", totalAbonos);
            context.setVariable("totalIngresos", totalIngresos);
            context.setVariable("totalIngresosVarios", totalIngresosVarios);
            
            // Egresos
            context.setVariable("creditos", creditos);
            context.setVariable("gastosEmpresa", gastosEmpresa);
            context.setVariable("gastosVarios", gastosVarios);
            context.setVariable("pagoPlanillas", pagoPlanillas);
            context.setVariable("retiros", retiros);
            context.setVariable("totalCreditos", totalCreditos);
            context.setVariable("totalGastos", totalGastos);
            context.setVariable("totalGastosVarios", totalGastosVarios);
            context.setVariable("totalPagoPlanillas", totalPagoPlanillas);
            context.setVariable("totalRetiros", totalRetiros);
            
            // Totals
            context.setVariable("totalIngresosGeneral", totalIngresosGeneral);
            context.setVariable("totalEgresosGeneral", totalEgresosGeneral);
            context.setVariable("fecha", fecha);
            
            // Creditos Otorgados y Denegados
            context.setVariable("creditosOtorgados", creditosOtorgados);
            context.setVariable("creditosDenegados", creditosDenegados);

            // Cuotas del día - calcular totals y cantidades
            BigDecimal totalCuotasPendientesDia = cuotasPendientesDia.stream()
                    .map(CreditoCuotaEntity::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            int cantidadCuotasPendientesDia = cuotasPendientesDia.size();

            BigDecimal totalCuotasVencidasDia = cuotasVencidasDia.stream()
                    .map(CreditoCuotaEntity::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            int cantidadCuotasVencidasDia = cuotasVencidasDia.size();

            BigDecimal totalCuotasPagadasDia = cuotasPagadasDia.stream()
                    .map(CreditoCuotaEntity::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            int cantidadCuotasPagadasDia = cuotasPagadasDia.size();

            context.setVariable("cuotasPendientesDia", cuotasPendientesDia);
            context.setVariable("cuotasVencidasDia", cuotasVencidasDia);
            context.setVariable("cuotasPagadasDia", cuotasPagadasDia);
            context.setVariable("totalCuotasPendientesDia", totalCuotasPendientesDia);
            context.setVariable("totalCuotasVencidasDia", totalCuotasVencidasDia);
            context.setVariable("totalCuotasPagadasDia", totalCuotasPagadasDia);
            context.setVariable("cantidadCuotasPendientesDia", cantidadCuotasPendientesDia);
            context.setVariable("cantidadCuotasVencidasDia", cantidadCuotasVencidasDia);
            context.setVariable("cantidadCuotasPagadasDia", cantidadCuotasPagadasDia);

            // Cuotas globales - calcular totals y cantidades
            // Check if we have historical data or current data
            BigDecimal totalCuotasPendientesGlobal = BigDecimal.ZERO;
            BigDecimal totalCuotasVencidasGlobal = BigDecimal.ZERO;
            BigDecimal totalCuotasPagadasGlobal = BigDecimal.ZERO;
            int cantidadCuotasPendientesGlobal = 0;
            int cantidadCuotasVencidasGlobal = 0;
            int cantidadCuotasPagadasGlobal = 0;
            boolean hasHistorialCobros = false;

            if (historialCobros != null && !historialCobros.isEmpty()) {
                // Use historical data
                hasHistorialCobros = true;
                for (HistorialCobrosEntity historial : historialCobros) {
                    if ("Pendientes".equals(historial.getTipo())) {
                        totalCuotasPendientesGlobal = historial.getMonto();
                        cantidadCuotasPendientesGlobal = historial.getCantidad();
                    } else if ("Vencidas".equals(historial.getTipo())) {
                        totalCuotasVencidasGlobal = historial.getMonto();
                        cantidadCuotasVencidasGlobal = historial.getCantidad();
                    } else if ("Pagadas".equals(historial.getTipo())) {
                        totalCuotasPagadasGlobal = historial.getMonto();
                        cantidadCuotasPagadasGlobal = historial.getCantidad();
                    }
                }
            } else if (cuotasPendientesGlobal != null && cuotasVencidasGlobal != null && cuotasPagadasGlobal != null) {
                // Use current global data
                totalCuotasPendientesGlobal = cuotasPendientesGlobal.stream()
                        .map(CreditoCuotaEntity::getTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                cantidadCuotasPendientesGlobal = cuotasPendientesGlobal.size();

                totalCuotasVencidasGlobal = cuotasVencidasGlobal.stream()
                        .map(CreditoCuotaEntity::getTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                cantidadCuotasVencidasGlobal = cuotasVencidasGlobal.size();

                totalCuotasPagadasGlobal = cuotasPagadasGlobal.stream()
                        .map(CreditoCuotaEntity::getTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                cantidadCuotasPagadasGlobal = cuotasPagadasGlobal.size();
            }

            context.setVariable("totalCuotasPendientesGlobal", totalCuotasPendientesGlobal);
            context.setVariable("totalCuotasVencidasGlobal", totalCuotasVencidasGlobal);
            context.setVariable("totalCuotasPagadasGlobal", totalCuotasPagadasGlobal);
            context.setVariable("cantidadCuotasPendientesGlobal", cantidadCuotasPendientesGlobal);
            context.setVariable("cantidadCuotasVencidasGlobal", cantidadCuotasVencidasGlobal);
            context.setVariable("cantidadCuotasPagadasGlobal", cantidadCuotasPagadasGlobal);
            context.setVariable("hasHistorialCobros", hasHistorialCobros);

            BigDecimal totalACobrar = totalCuotasPendientesGlobal.add(totalCuotasVencidasGlobal);
            BigDecimal porRecuperar = totalIngresosCapitalesGlobal.subtract(totalCuotasPagadasGlobalValue);
            BigDecimal gananciaProyectada = totalACobrar.subtract(porRecuperar);
            BigDecimal gananciaReal = totalCuotasPagadasGlobalValue.subtract(totalIngresosCapitalesGlobal);
            BigDecimal roiPorcentaje = null;
            if (totalIngresosCapitalesGlobal.compareTo(BigDecimal.ZERO) > 0) {
                roiPorcentaje = gananciaReal
                        .divide(totalIngresosCapitalesGlobal, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));
            }

            context.setVariable("totalIngresosCapitalesGlobal", totalIngresosCapitalesGlobal);
            context.setVariable("totalCuotasPagadasGlobalValue", totalCuotasPagadasGlobalValue);
            context.setVariable("totalACobrar", totalACobrar);
            context.setVariable("porRecuperar", porRecuperar);
            context.setVariable("gananciaProyectada", gananciaProyectada);
            context.setVariable("gananciaReal", gananciaReal);
            context.setVariable("roiPorcentaje", roiPorcentaje);

            // Logo dentro del JAR
            URL logoResource = getClass().getClassLoader().getResource("static/img/logo.jpg");
            if (logoResource != null) {
                context.setVariable("logoUrl", logoResource.toExternalForm());
            }

            String htmlContent = templateEngine.process("fragments/PDFReporteDiario", context);

            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=reporte-diario-completo-" + fecha.toString() + ".pdf");

            try (OutputStream os = response.getOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.useFastMode();
                builder.withHtmlContent(htmlContent, null);
                builder.toStream(os);
                builder.run();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF de Reporte Diario Completo: " + e.getMessage(), e);
        }
    }

  public void generarCuotasPDF(List<CreditoCuotaEntity> cuotas, Boolean mostrarEstado, Boolean mostrarObservaciones, HttpServletResponse response) {
    try {
        if (cuotas == null || cuotas.isEmpty()) {
            throw new IllegalArgumentException("No hay cuotas en este crédito.");
        }

        for (CreditoCuotaEntity cuota : cuotas) {
            String observacion = calcularObservaciones(cuota);
            cuota.setObservaciones(observacion);
        }

        CreditoCuotaEntity firstCuota = cuotas.get(0);
        UsuarioEntity usuario = firstCuota.getCredito().getUsuario();

        Context context = new Context();
        context.setVariable("mostrarEstado", mostrarEstado);
        context.setVariable("mostrarObservaciones", mostrarObservaciones);
        context.setVariable("usuario", usuario);
        context.setVariable("cuotas", cuotas);

        // Logo dentro del JAR
        URL logoResource = getClass().getClassLoader().getResource("static/img/logo.jpg");
        if (logoResource != null) {
            context.setVariable("logoUrl", logoResource.toExternalForm());
        }

        String htmlContent = templateEngine.process("fragments/PDFCuotasUsuario", context);
        String nombreCompleto = usuario.getNombre() + " " + usuario.getApellido();

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=cuotas-" + nombreCompleto + ".pdf");

        try (OutputStream os = response.getOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.useFastMode();
                builder.withHtmlContent(htmlContent, null);
                builder.toStream(os);
                builder.run();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF de Cuotas del Usuario. " + e.getMessage(), e);
        }
    }

  public void generarUsuarioVencidas(List<UsuarioCuotasDTO> usuarios, HttpServletResponse response) {
    try {
        if (usuarios == null || usuarios.isEmpty()) {
            throw new IllegalArgumentException("No hay usuarios con cuotas vencidas.");
        }

        Context context = new Context();
        context.setVariable("usuarios", usuarios);

        // Logo dentro del JAR
        URL logoResource = getClass().getClassLoader().getResource("static/img/logo.jpg");
        if (logoResource != null) {
            context.setVariable("logoUrl", logoResource.toExternalForm());
        }

        String htmlContent = templateEngine.process("fragments/PDFUsuariosVencidas", context);

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=usuarios-con-vencidas-" + LocalDate.now() + ".pdf");

        try (OutputStream os = response.getOutputStream()) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                builder.useFastMode();
                builder.withHtmlContent(htmlContent, null);
                builder.toStream(os);
                builder.run();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF de Usuarios con cuotas vencidas. " + e.getMessage(), e);
        }
    }

    private String calcularObservaciones(CreditoCuotaEntity cuota){
        String observacion = ""; 
        String estadoNormalizado = cuota.getEstado() != null ? cuota.getEstado().trim() : "";

        // --- CASO 1: PAGADO (Puntual/Anticipado/Tardío) ---
        if ("Pagado".equalsIgnoreCase(estadoNormalizado) && cuota.getFechaPago() != null) {
            
            long diasDiferencia = ChronoUnit.DAYS.between(
                cuota.getFechaVencimiento().toLocalDate(), 
                cuota.getFechaPago().toLocalDate()
            );

            if (diasDiferencia == 0) {
                observacion = "Puntual";
            } else if (diasDiferencia < 0) {
                // Pago Anticipado: X días antes
                observacion = Math.abs(diasDiferencia) + " días antes";
            } else { 
                // Pago Tardío: X días después
                observacion = diasDiferencia + " días después"; 
            }
        } 
        // --- CASO 2: VENCIDO (X días de atraso) ---
        else if ("Vencido".equalsIgnoreCase(estadoNormalizado)) {
            // Calculamos los días de atraso hasta hoy
            long diasAtraso = ChronoUnit.DAYS.between(
                cuota.getFechaVencimiento().toLocalDate(), 
                LocalDate.now()
            );
            // Mostrar solo los días (ej. "5 días")
            if (diasAtraso > 0) {
                observacion = diasAtraso + " días";
            }
        } 

        // --- CASO 3: PENDIENTE (Días restantes para el pago) ---
        else if ("Pendiente".equalsIgnoreCase(estadoNormalizado)) {
            // Días restantes = Días entre hoy y la fecha de vencimiento
            long diasRestantes = ChronoUnit.DAYS.between(
                LocalDate.now(), 
                cuota.getFechaVencimiento().toLocalDate()
            );
            
            if (diasRestantes > 0) {
                observacion = diasRestantes + " días para pago";
            } else if (diasRestantes == 0) {
                observacion = "Hoy es la fecha límite";
            } else {
                observacion = "Pago atrasado"; 
            }
        }
        
        return observacion;
    }
}