package com.biovizion.prestamo911.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs;
import com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.UsuarioCuotasDTO;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.repository.UsuarioRepository;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.UsuarioService;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioImpl implements UsuarioService {

    @Autowired
    private CreditoService creditoService;

    @Autowired
    private CreditoCuotaService cuotaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<UsuarioEntity> obtenerUsuariosPorRol(String rolNombre) {
        return usuarioRepository.findByRolNombre(rolNombre);
    }

    @Override
    public List<UsuarioEntity> findAll() {
        return usuarioRepository.findAll();
    }
    @Override
    public UsuarioEntity save(UsuarioEntity usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public void cambiarContrasena(Long usuarioId, String nuevaContrasena) {
        UsuarioEntity usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setPassword(passwordEncoder.encode(nuevaContrasena));
        usuarioRepository.save(usuario);
    }

    @Override
    public Optional<UsuarioEntity> findById(Long id) {
        return usuarioRepository.findById(id);
    }


    @Override
    public Optional<UsuarioEntity> findByDui(String dui) {
        return usuarioRepository.findByDui(dui);
    }

    @Override
    public Optional<UsuarioEntity> get(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public void update(UsuarioEntity usuario) {
        usuarioRepository.save(usuario);

    }

    @Override
    public void delete(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public boolean existsByCodigo(String codigo) {
        return usuarioRepository.existsByCodigo(codigo);
    }

    @Override
    public List<UsuarioEntity> findByIdIn(Collection<Long> ids) {
        return usuarioRepository.findByIdIn(ids);
    }

    @Override
    public List<UsuarioCuotasDTO> findAllConCuotasVencidas() {
        List<UsuarioEntity> usuarios = usuarioRepository.findAllWithVencidos();

        return mapearAUsuarioCuotasDTOs(usuarios);
    }

    @Override
    public List<UsuarioCuotasDTO> findAllConCuotas() {
        List<UsuarioEntity> usuarios = usuarioRepository.findAllWithCuotas();

        return mapearAUsuarioCuotasDTOs(usuarios);
    }

    public UsuarioCuotasDTO mapearAUsuarioCuotasDTO(UsuarioEntity usuario) {
        String usuarioNombre = usuario.getNombre().trim() + " " + usuario.getApellido().trim();

        List<CreditoEntity> creditosActivos = creditoService.findAceptadosByUsuarioId(usuario.getId());
        List<CreditoCuotaEntity> cuotasPendientes = cuotaService.findAllByEstadoAndUsuarioId("Pendiente", usuario.getId());
        List<CreditoCuotaEntity> cuotasVencidas = cuotaService.findAllByEstadoAndUsuarioId("Vencido", usuario.getId());
        List<CreditoCuotaEntity> cuotasPagadas = cuotaService.findAllByEstadoAndUsuarioId("Pagado", usuario.getId());

        BigDecimal cobrarPendiente = cuotasVencidas.stream()
                .map(CreditoCuotaEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPendiente = cuotasPendientes.stream()
                .map(CreditoCuotaEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);


        BigDecimal totalPagadas = cuotasPagadas.stream()
                .map(CreditoCuotaEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPagar = cobrarPendiente.add(totalPendiente);

        CreditoCuotaEntity oldestCuota = cuotasVencidas.stream()
                .min(Comparator.comparing(CreditoCuotaEntity::getFechaVencimiento))
                .orElse(null);

        if (oldestCuota == null){
            oldestCuota = cuotasPendientes.stream()
                                        .min(Comparator.comparing(CreditoCuotaEntity::getFechaVencimiento))
                                        .orElse(null);
        } 

        return new UsuarioCuotasDTO(
                usuario.getId(),
                usuario.getCalificacion(),
                usuarioNombre,
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getCelular(),
                usuario.getDireccion(),
                oldestCuota != null ? oldestCuota.getFechaVencimiento().toLocalDate() : null,
                oldestCuota != null ? oldestCuota.getMonto() : BigDecimal.ZERO,
                oldestCuota != null ? oldestCuota.getPagoMora() : BigDecimal.ZERO,
                oldestCuota != null ? oldestCuota.getAbono() : BigDecimal.ZERO,
                oldestCuota != null ? oldestCuota.getTotal() : BigDecimal.ZERO,
                cobrarPendiente,
                totalPagar,
                totalPagadas,
                CreditoDTOs.mapearACreditoDTOs(creditosActivos)
        );
    }

    public List<UsuarioCuotasDTO> mapearAUsuarioCuotasDTOs(List<UsuarioEntity> usuarios) {
        return usuarios.stream()
                .map(this::mapearAUsuarioCuotasDTO)
                .collect(Collectors.toList());
    }
}