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

        // Get credito monto from first active credito
        BigDecimal creditoMonto = creditosActivos.stream()
                .findFirst()
                .map(CreditoEntity::getMonto)
                .orElse(BigDecimal.ZERO);

        // Count pending and vencidas cuotas
        int cuotasPendientesCount = cuotasPendientes.size();
        int cuotasVencidasCount = cuotasVencidas.size();

        // Get referencias and parentesco from UsuarioSolicitud
        String referencias = "";
        String referenciasCelular = "";
        String parentesco = "";
        if (!creditosActivos.isEmpty() && creditosActivos.get(0).getUsuarioSolicitud() != null) {
            var solicitud = creditosActivos.get(0).getUsuarioSolicitud();
            
            // Build referencias string: "nombre1\nnombre2"
            StringBuilder refs = new StringBuilder();
            if (solicitud.getReferencia1() != null && !solicitud.getReferencia1().trim().isEmpty()) {
                refs.append(solicitud.getReferencia1());
            }
            if (solicitud.getReferencia2() != null && !solicitud.getReferencia2().trim().isEmpty()) {
                if (refs.length() > 0) refs.append(";\n");
                refs.append(solicitud.getReferencia2());
            }
            referencias = refs.toString();
            
            // Build referenciasCelular string: "telefono1;\ntelefono2"
            StringBuilder refsCelular = new StringBuilder();
            if (solicitud.getTelefonoReferencia1() != null && !solicitud.getTelefonoReferencia1().trim().isEmpty()) {
                refsCelular.append(solicitud.getTelefonoReferencia1());
            }
            if (solicitud.getTelefonoReferencia2() != null && !solicitud.getTelefonoReferencia2().trim().isEmpty()) {
                if (refsCelular.length() > 0) refsCelular.append(";\n");
                refsCelular.append(solicitud.getTelefonoReferencia2());
            }
            referenciasCelular = refsCelular.toString();
            
            // Build parentesco string: "parentesco1\nparentesco2"
            StringBuilder parentescos = new StringBuilder();
            if (solicitud.getParentesco1() != null && !solicitud.getParentesco1().trim().isEmpty()) {
                parentescos.append(solicitud.getParentesco1());
            }
            if (solicitud.getParentesco2() != null && !solicitud.getParentesco2().trim().isEmpty()) {
                if (parentescos.length() > 0) parentescos.append(";\n");
                parentescos.append(solicitud.getParentesco2());
            }
            parentesco = parentescos.toString();
        }

        // Get codeudor information from UsuarioSolicitud
        String codeudorNombre = "";
        String codeudorDui = "";
        String codeudorDireccion = "";
        if (!creditosActivos.isEmpty() && creditosActivos.get(0).getUsuarioSolicitud() != null) {
            var solicitud = creditosActivos.get(0).getUsuarioSolicitud();
            if (solicitud.getCodeudorNombre() != null && !solicitud.getCodeudorNombre().trim().isEmpty()) {
                codeudorNombre = solicitud.getCodeudorNombre();
            }
            if (solicitud.getCodeudorDui() != null && !solicitud.getCodeudorDui().trim().isEmpty()) {
                codeudorDui = solicitud.getCodeudorDui();
            }
            if (solicitud.getCodeudorDireccion() != null && !solicitud.getCodeudorDireccion().trim().isEmpty()) {
                codeudorDireccion = solicitud.getCodeudorDireccion();
            }
        }

        // Combine all notas from all cuotas
        List<CreditoCuotaEntity> allCuotas = new java.util.ArrayList<>();
        allCuotas.addAll(cuotasPendientes);
        allCuotas.addAll(cuotasVencidas);
        allCuotas.addAll(cuotasPagadas);
        
        String notas = allCuotas.stream()
                .flatMap(cuota -> cuota.getNotas().stream())
                .map(nota -> nota.getContenido())
                .filter(contenido -> contenido != null && !contenido.trim().isEmpty())
                .collect(Collectors.joining("; "));

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
                creditoMonto,
                cuotasPendientesCount,
                cuotasVencidasCount,
                cobrarPendiente,
                totalPagar,
                totalPagadas,
                referencias,
                referenciasCelular,
                parentesco,
                notas,
                codeudorNombre,
                codeudorDui,
                codeudorDireccion,
                CreditoDTOs.mapearACreditoDTOs(creditosActivos)
        );
    }

    public List<UsuarioCuotasDTO> mapearAUsuarioCuotasDTOs(List<UsuarioEntity> usuarios) {
        return usuarios.stream()
                .map(this::mapearAUsuarioCuotasDTO)
                .collect(Collectors.toList());
    }
}