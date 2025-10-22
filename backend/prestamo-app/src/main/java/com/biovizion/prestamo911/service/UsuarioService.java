package com.biovizion.prestamo911.service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.UsuarioCuotasDTO;
import com.biovizion.prestamo911.entities.UsuarioEntity;

public interface UsuarioService {

    List<UsuarioEntity> findAll();
    List<UsuarioCuotasDTO> findAllConCuotas();
    List<UsuarioCuotasDTO> findAllConCuotasVencidas();
    UsuarioEntity save(UsuarioEntity usuario);
    void cambiarContrasena(Long usuarioId, String nuevaContrasena);
    Optional<UsuarioEntity> findById(Long id);
    List<UsuarioEntity> findByIdIn(Collection<Long> ids);

    Optional<UsuarioEntity> findByDui(String dui);

    public Optional<UsuarioEntity> get(Long id);
    public void update(UsuarioEntity usuario);
    public void delete(Long id);

    boolean existsByCodigo(String codigo);

    List<UsuarioEntity> obtenerUsuariosPorRol(String rolNombre);
}

