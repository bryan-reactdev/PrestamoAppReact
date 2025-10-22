package com.biovizion.prestamo911.DTOs.Cuota;

import static com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.mapearACreditoDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.CreditoDTO;
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
        
        @JsonBackReference  // child → parent
        private List<NotaEntity> notas;

        // @JsonBackReference  // child → parent
        // private List<AbonoDTO> abonos;

        @JsonBackReference  // child → parent
        private CreditoDTO credito;
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
        private LocalDateTime fechaVencimiento;
        private LocalDateTime fechaPagado;
        private BigDecimal monto;
        private BigDecimal mora;
        private BigDecimal abono;
        private BigDecimal total;
        
        private BigDecimal credito;
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

            cuota.getNotas(),
            mapearACreditoDTO(cuota.getCredito())
        );
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
                cuota.getFechaVencimiento(),
                cuota.getFechaPago(),
                cuota.getMonto(),
                cuota.getPagoMora(),
                cuota.getAbono(),
                cuota.getTotal(),
                cuota.getCredito().getMonto()
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
}