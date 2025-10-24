package com.biovizion.prestamo911.utils;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoFullDTO;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoSolicitudRequest;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.UsuarioService;
import com.biovizion.prestamo911.service.UsuarioSolicitudService;

@Component
public class CreditoUtils {
    @Autowired
    private CreditoService creditoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioSolicitudService usuarioSolicitudService;

    public void CreateRequestCredito(CreditoSolicitudRequest request, UsuarioEntity usuario) throws IOException{
        try {
            if (request.getMonto().compareTo(new BigDecimal("50")) < 0) {
                throw new IllegalArgumentException(
                    "No es posible solicitar un crédito con un monto menor a $50 (USD)"
                );
            }

            CreditoEntity credito = new CreditoEntity();
            UsuarioSolicitudEntity usuarioSolicitud = new UsuarioSolicitudEntity();
            
            // --- CreditoEntity ---
            if (request.getMonto().compareTo(new BigDecimal("200")) < 0) {
                credito.setTipo("rapi-cash");
            }
            else{
                credito.setTipo("prendario");
            }

            credito.setMonto(request.getMonto());
            credito.setPlazoFrecuencia(request.getFrecuenciaPago());
            credito.setDestino(request.getFinalidadCredito());
            credito.setFormaDePago(request.getFormaPago());
            credito.setTienePropiedad(request.getPropiedadANombre());
            credito.setTieneVehiculo(request.getVehiculoANombre());

            // --- UsuarioEntity ---
            usuario.setDui(request.getDui());
            usuario.setNombre(request.getNombres());
            usuario.setApellido(request.getApellidos());
            usuario.setEmail(request.getEmail());
            usuario.setCelular(request.getCelular());
            usuario.setDireccion(request.getDireccion());
            usuario.setOcupacion(request.getOcupacion());
            usuario.setTiempoResidencia(request.getTiempoResidencia());
            usuario.setEstadoCivil(request.getEstadoCivil());
            usuario.setFechaNacimiento(request.getFechaNacimiento());
            usuario.setGastosMensuales(request.getGastosMensuales());
            usuario.setFuenteConocimiento(request.getComoConocio());
            usuario.setConoceAlguien(request.getConoceAlguien());
            usuario.setPerfilRedSocial(request.getEnlaceRedSocial());

            // --- UsuarioSolicitudEntity ---
            usuarioSolicitud.setFechaSolicitud(LocalDate.now());
            usuarioSolicitud.setReferencia1(request.getNombreReferencia1());
            usuarioSolicitud.setTelefonoReferencia1(request.getCelularReferencia1());
            usuarioSolicitud.setParentesco1(request.getParentescoReferencia1());
            usuarioSolicitud.setReferencia2(request.getNombreReferencia2());
            usuarioSolicitud.setTelefonoReferencia2(request.getCelularReferencia2());
            usuarioSolicitud.setParentesco2(request.getParentescoReferencia2());
            usuarioSolicitud.setDeudas(request.getCobrosAnteriormente());
            usuarioSolicitud.setCodeudorNombre(request.getNombreCodeudor());
            usuarioSolicitud.setCodeudorDui(request.getDuiCodeudor());
            usuarioSolicitud.setCodeudorDireccion(request.getDireccionCodeudor());
            usuarioSolicitud.setIngresoMensualCodeudor(request.getIngresosMensualesCodeudor());
            usuarioSolicitud.setSolicitado(request.getSolicitadoAnteriormente());
            usuarioSolicitud.setAtrasos(request.getAtrasosAnteriormente());
            usuarioSolicitud.setReportado(request.getReportadoAnteriormente());
            usuarioSolicitud.setOtrasDeudas(request.getDeudasActualmente());
            usuarioSolicitud.setEmpleado(request.getEmpleo());

            // --- Fotos ---
            FileUtils.tryUploadFotoSolicitud(usuarioSolicitud, "delante", request.getDuiDelanteCodeudor());
            FileUtils.tryUploadFotoSolicitud(usuarioSolicitud, "atras", request.getDuiAtrasCodeudor());
            FileUtils.tryUploadFotoSolicitud(usuarioSolicitud, "foto", request.getFotoRecibo());
            
            // --- Set relationships ---
            credito.setUsuario(usuario);
            credito.setUsuarioSolicitud(usuarioSolicitud);

            // --- Save entities ---
            usuarioService.save(usuario);
            usuarioSolicitudService.save(usuarioSolicitud);
            creditoService.save(credito);
        } catch (Exception e) {
            throw e;
        }
    }

    public void UpdateCredito(Long id, CreditoFullDTO request) throws IOException{
        try {
            if (request.getMonto().compareTo(new BigDecimal("50")) < 0) {
                throw new IllegalArgumentException(
                    "No es posible solicitar un crédito con un monto menor a $50 (USD)"
                );
            }

            CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crédito no encontrado"));
            UsuarioEntity usuario = credito.getUsuario();
            UsuarioSolicitudEntity usuarioSolicitud = credito.getUsuarioSolicitud();

            // --- CreditoEntity ---
            if (request.getMonto().compareTo(new BigDecimal("200")) < 0) {
                credito.setTipo("rapi-cash");
            }
            else{
                credito.setTipo("prendario");
            }

            credito.setMonto(request.getMonto());
            credito.setPlazoFrecuencia(request.getFrecuenciaPago());
            credito.setDestino(request.getFinalidadCredito());
            credito.setFormaDePago(request.getFormaPago());
            credito.setTienePropiedad(request.getPropiedadANombre());
            credito.setTieneVehiculo(request.getVehiculoANombre());
            if (credito.getFechaAceptado() != null) {
                credito.setFechaAceptado(request.getFechaAceptado().atStartOfDay());
            }


            // --- UsuarioEntity ---
            usuario.setDui(request.getDui());
            usuario.setNombre(request.getNombres());
            usuario.setApellido(request.getApellidos());
            usuario.setEmail(request.getEmail());
            usuario.setCelular(request.getCelular());
            usuario.setDireccion(request.getDireccion());
            usuario.setOcupacion(request.getOcupacion());
            usuario.setTiempoResidencia(request.getTiempoResidencia());
            usuario.setEstadoCivil(request.getEstadoCivil());
            usuario.setFechaNacimiento(request.getFechaNacimiento());
            usuario.setGastosMensuales(request.getGastosMensuales());
            usuario.setFuenteConocimiento(request.getComoConocio());
            usuario.setConoceAlguien(request.getConoceAlguien());
            usuario.setPerfilRedSocial(request.getEnlaceRedSocial());

            // --- UsuarioSolicitudEntity ---
            usuarioSolicitud.setFechaSolicitud(LocalDate.now());
            usuarioSolicitud.setReferencia1(request.getNombreReferencia1());
            usuarioSolicitud.setTelefonoReferencia1(request.getCelularReferencia1());
            usuarioSolicitud.setParentesco1(request.getParentescoReferencia1());
            usuarioSolicitud.setReferencia2(request.getNombreReferencia2());
            usuarioSolicitud.setTelefonoReferencia2(request.getCelularReferencia2());
            usuarioSolicitud.setParentesco2(request.getParentescoReferencia2());
            usuarioSolicitud.setDeudas(request.getCobrosAnteriormente());
            usuarioSolicitud.setCodeudorNombre(request.getNombreCodeudor());
            usuarioSolicitud.setCodeudorDui(request.getDuiCodeudor());
            usuarioSolicitud.setCodeudorDireccion(request.getDireccionCodeudor());
            usuarioSolicitud.setIngresoMensualCodeudor(request.getIngresosMensualesCodeudor());
            usuarioSolicitud.setSolicitado(request.getSolicitadoAnteriormente());
            usuarioSolicitud.setAtrasos(request.getAtrasosAnteriormente());
            usuarioSolicitud.setReportado(request.getReportadoAnteriormente());
            usuarioSolicitud.setOtrasDeudas(request.getDeudasActualmente());
            usuarioSolicitud.setEmpleado(request.getEmpleo());

            // --- Fotos ---
            FileUtils.tryUploadFotoSolicitud(usuarioSolicitud, "delante", request.getDuiDelanteCodeudor());
            FileUtils.tryUploadFotoSolicitud(usuarioSolicitud, "atras", request.getDuiAtrasCodeudor());
            FileUtils.tryUploadFotoSolicitud(usuarioSolicitud, "foto", request.getFotoRecibo());
            
            // --- Save entities ---
            usuarioService.save(usuario);
            usuarioSolicitudService.save(usuarioSolicitud);
            creditoService.save(credito);
        } catch (Exception e) {
            throw e;
        }
    }
}
