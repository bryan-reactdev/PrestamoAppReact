package com.biovizion.prestamo911.DTOs.Cuota;

import static com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.mapearACreditoDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.biovizion.prestamo911.entities.AbonoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.NotaEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class CuotaDTOs {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CuotaDTO{
        private Long id;
        private LocalDate fechaVencimiento;
        private LocalDate fechaPagado;
        
        private String estado;
        private String codigo;
        private String usuario;
        private String nombres;
        private String apellidos;
        
        private BigDecimal monto;
        private BigDecimal mora;
        private BigDecimal abono;
        private BigDecimal total;

        private List<NotaDTO> notas;

        // @JsonBackReference  // child → parent
        // private List<AbonoDTO> abonos;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotaDTO{
        private Long id;
        private String contenido;
        private LocalDate fecha;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AbonoDTO{
        private Long id;
        private LocalDate fecha;
        private LocalDate fechaCuota;

        private BigDecimal monto;

        private String usuario;
        private String nombres;
        private String apellidos;

        private BigDecimal credito;
        
        @JsonBackReference  // child → parent
        private CuotaDTO cuota;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CuotaTablaDTO {
        private Long id;
        private String estado;
        private String codigo;
        private String usuario;
        private String nombres;
        private String apellidos;
        private String celular;
        private LocalDateTime fechaVencimiento;
        private LocalDateTime fechaPagado;
        private BigDecimal monto;
        private BigDecimal mora;
        private BigDecimal abono;
        private BigDecimal total;
        
        private BigDecimal credito;

        private Long userId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CuotaPendienteDTO {
        private Long id;
        private String estado;
        private String usuario;
        private String celular;
        private LocalDate cuotaVencimiento;
        private BigDecimal cuotaTotal;
        private String direccion;
        private BigDecimal creditoMonto;
        private Integer cuotasPendientes;
        private BigDecimal totalPagar;
        private String referencias;
        private String parentesco;
        private String notas;
    }

    public static AbonoDTO mapearAAbonoDTO(AbonoCuotaEntity abono){
        String usuarioNombres = abono.getCreditoCuota().getCredito().getUsuario().getNombre().trim();
        String usuarioApellidos =  abono.getCreditoCuota().getCredito().getUsuario().getApellido().trim();
        String usuario = usuarioNombres + " " + usuarioApellidos;

        return new AbonoDTO(
            abono.getId(),
            abono.getFechaAbono(),
            abono.getCreditoCuota().getFechaVencimiento().toLocalDate(),

            abono.getMonto(),

            usuario,
            usuarioNombres,
            usuarioApellidos,

            abono.getCreditoCuota().getCredito().getMontoDado() != null 
                ? abono.getCreditoCuota().getCredito().getMontoDado() 
                : abono.getCreditoCuota().getCredito().getMonto(),

            mapearACuotaDTO(abono.getCreditoCuota())
        );
    }

    public static NotaDTO mapearANotaDTO(NotaEntity nota){
        return new NotaDTO(
            nota.getId(),
            nota.getContenido(),
            nota.getFecha() != null ? nota.getFecha().toLocalDate() : null
        );
    };

    public static CuotaDTO mapearACuotaDTO(CreditoCuotaEntity cuota){
        String usuarioNombre = cuota.getCredito().getUsuario().getNombre().trim() + " " + cuota.getCredito().getUsuario().getApellido().trim();

        return new CuotaDTO(
            cuota.getId(),

            cuota.getFechaVencimiento() != null ? cuota.getFechaVencimiento().toLocalDate() : null,
            cuota.getFechaPago() != null ? cuota.getFechaPago().toLocalDate() : null,

            cuota.getEstado(),
            cuota.getCodigo(),
            usuarioNombre,
            cuota.getCredito().getUsuario().getNombre().trim(),
            cuota.getCredito().getUsuario().getApellido().trim(),

            cuota.getMonto(),
            cuota.getPagoMora(),
            cuota.getAbono(),
            cuota.getTotal(),

            mapearANotaDTOs(cuota.getNotas())
        );
    }

    public static List<NotaDTO> mapearANotaDTOs(List<NotaEntity> notas) {
        return notas.stream().map(nota -> {
            return mapearANotaDTO(nota);
        }).collect(Collectors.toList());
    }

    public static List<CuotaTablaDTO> mapearACuotaTablaDTOs(List<CreditoCuotaEntity> cuotas) {
        return cuotas.stream().map(cuota -> {
            String usuarioNombre = cuota.getCredito().getUsuario().getNombre().trim() + " " + cuota.getCredito().getUsuario().getApellido().trim();

            return new CuotaTablaDTO(
                cuota.getId(),
                cuota.getEstado(),
                cuota.getCodigo(),
                usuarioNombre,
                cuota.getCredito().getUsuario().getNombre(),
                cuota.getCredito().getUsuario().getApellido(),
                cuota.getCredito().getUsuario().getCelular(),
                cuota.getFechaVencimiento(),
                cuota.getFechaPago(),
                cuota.getMonto(),
                cuota.getPagoMora(),
                cuota.getAbono(),
                cuota.getTotal(),
                cuota.getCredito().getMonto(),
                cuota.getCredito().getUsuario().getId()
            );
        }).collect(Collectors.toList());
    }

    public static List<CuotaDTO> mapearACuotaDTOs(List<CreditoCuotaEntity> cuotas) {
        return cuotas.stream().map(cuota -> {
            return mapearACuotaDTO(cuota);
        }).collect(Collectors.toList());
    }

    public static List<AbonoDTO> mapearAAbonoDTOs(List<AbonoCuotaEntity> abonos) {
        return abonos.stream().map(abono -> {
            return mapearAAbonoDTO(abono);
        }).collect(Collectors.toList());
    }

    public static CuotaPendienteDTO mapearACuotaPendienteDTO(
            CreditoCuotaEntity cuota, 
            List<CreditoCuotaEntity> todasLasCuotasPendientes,
            List<CreditoCuotaEntity> todasLasCuotasVencidas) {
        
        var credito = cuota.getCredito();
        var usuario = credito.getUsuario();
        String usuarioNombre = usuario.getNombre().trim() + " " + usuario.getApellido().trim();

        // Get all pending and overdue cuotas for this user
        Long usuarioId = usuario.getId();
        List<CreditoCuotaEntity> cuotasPendientesUsuario = todasLasCuotasPendientes.stream()
                .filter(c -> c.getCredito().getUsuario().getId().equals(usuarioId))
                .collect(Collectors.toList());
        List<CreditoCuotaEntity> cuotasVencidasUsuario = todasLasCuotasVencidas.stream()
                .filter(c -> c.getCredito().getUsuario().getId().equals(usuarioId))
                .collect(Collectors.toList());

        // Calculate totals
        BigDecimal totalPendientes = cuotasPendientesUsuario.stream()
                .map(CreditoCuotaEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalVencidas = cuotasVencidasUsuario.stream()
                .map(CreditoCuotaEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalPagar = totalPendientes.add(totalVencidas);

        // Get credito monto
        BigDecimal creditoMonto = credito.getMonto();

        // Count pending cuotas
        int cuotasPendientesCount = cuotasPendientesUsuario.size();

        // Get referencias and parentesco from UsuarioSolicitud
        String referencias = "";
        String parentesco = "";
        if (credito.getUsuarioSolicitud() != null) {
            var solicitud = credito.getUsuarioSolicitud();
            
            // Build referencias string: "nombre1\nnombre2"
            StringBuilder refs = new StringBuilder();
            if (solicitud.getReferencia1() != null && !solicitud.getReferencia1().trim().isEmpty()) {
                refs.append(solicitud.getReferencia1());
            }
            if (solicitud.getReferencia2() != null && !solicitud.getReferencia2().trim().isEmpty()) {
                if (refs.length() > 0) refs.append("\n");
                refs.append(solicitud.getReferencia2());
            }
            referencias = refs.toString();
            
            // Build parentesco string: "parentesco1\nparentesco2"
            StringBuilder parentescos = new StringBuilder();
            if (solicitud.getParentesco1() != null && !solicitud.getParentesco1().trim().isEmpty()) {
                parentescos.append(solicitud.getParentesco1());
            }
            if (solicitud.getParentesco2() != null && !solicitud.getParentesco2().trim().isEmpty()) {
                if (parentescos.length() > 0) parentescos.append("\n");
                parentescos.append(solicitud.getParentesco2());
            }
            parentesco = parentescos.toString();
        }

        // Combine all notas from all cuotas for this user
        List<CreditoCuotaEntity> allCuotasUsuario = new java.util.ArrayList<>();
        allCuotasUsuario.addAll(cuotasPendientesUsuario);
        allCuotasUsuario.addAll(cuotasVencidasUsuario);
        
        String notas = allCuotasUsuario.stream()
                .flatMap(c -> c.getNotas().stream())
                .map(nota -> nota.getContenido())
                .filter(contenido -> contenido != null && !contenido.trim().isEmpty())
                .collect(Collectors.joining("; "));

        return new CuotaPendienteDTO(
                cuota.getId(),
                cuota.getEstado(),
                usuarioNombre,
                usuario.getCelular(),
                cuota.getFechaVencimiento() != null ? cuota.getFechaVencimiento().toLocalDate() : null,
                cuota.getTotal(),
                usuario.getDireccion(),
                creditoMonto,
                cuotasPendientesCount,
                totalPagar,
                referencias,
                parentesco,
                notas
        );
    }

    public static List<CuotaPendienteDTO> mapearACuotaPendienteDTOs(
            List<CreditoCuotaEntity> cuotas,
            List<CreditoCuotaEntity> todasLasCuotasPendientes,
            List<CreditoCuotaEntity> todasLasCuotasVencidas) {
        return cuotas.stream().map(cuota -> {
            return mapearACuotaPendienteDTO(cuota, todasLasCuotasPendientes, todasLasCuotasVencidas);
        }).collect(Collectors.toList());
    }
}