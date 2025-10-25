package com.biovizion.prestamo911.controller;

import static com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.mapearACreditoTablaDTOs;
import static com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.mapearAUsuarioDTO;
import static com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.mapearAUsuarioTablaDTOs;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.biovizion.prestamo911.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.prestamo911.DTOs.GlobalDTOs.GroupDTO;
import com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.CreditoTablaDTO;
import com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.UsuarioCuotasDTO;
import com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.UsuarioDTO;
import com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.UsuarioTablaDTO;
import com.biovizion.prestamo911.DTOs.Usuario.UsuarioRequestDTOs.UsuarioEditRequest;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.PdfService;
import com.biovizion.prestamo911.service.UsuarioService;
import com.biovizion.prestamo911.utils.FileUtils;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@Controller
@RequestMapping("/usuarioTest")
public class UsuarioControllerTest {
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private CreditoService creditoService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private PdfService pdfService;

    @GetMapping("/")
    public ResponseEntity<ApiResponse> getUsuarios() {
        try {
            List<UsuarioEntity> usuarios = usuarioService.findAll();
            List<UsuarioTablaDTO> usuarioDTOs = mapearAUsuarioTablaDTOs(usuarios);
            
            ApiResponse<List<UsuarioTablaDTO>> response = 
                new ApiResponse<>("FETCH Usuarios obtenidos exitosamente", usuarioDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener los usuarios: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @PutMapping(value = "/", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> updateUsuario(@ModelAttribute UsuarioEditRequest request) {
        try {
            Optional<UsuarioEntity> usuarioOpt = usuarioService.findById(request.getUsuarioId());
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body(new ApiResponse<>("Usuario no encontrado"));
            }

            UsuarioEntity usuario = usuarioOpt.get();

            usuario.setNombre(request.getNombres());
            usuario.setApellido(request.getApellidos());
            usuario.setEmail(request.getEmail());
            usuario.setCelular(request.getCelular());

            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(request.getPassword()));
            }

            // --- Use helper for file updates ---
            FileUtils.tryUploadFotoDUI(usuario, "delante", request.getDuiDelante());
            FileUtils.tryUploadFotoDUI(usuario, "atras", request.getDuiAtras());

            usuarioService.update(usuario);

            return ResponseEntity.ok(new ApiResponse<>("Usuario editado exitosamente"));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Error al editar usuario: " + e.getMessage()));
        }
    }

    @GetMapping("/vencidas")
    public ResponseEntity<ApiResponse> getUsuariosConVencidas() {
        try {
            List<UsuarioCuotasDTO> usuarios = usuarioService.findAllConCuotasVencidas();
            
            ApiResponse<List<UsuarioCuotasDTO>> response = 
                new ApiResponse<>("FETCH Usuarios con cuotas vencidas obtenidos exitosamente", usuarios);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener los usuarios con cuotas vencidas: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/cuotas")
    public ResponseEntity<ApiResponse> getUsuariosConCuotas() {
        try {
            List<UsuarioCuotasDTO> usuarios = usuarioService.findAllConCuotas();
            
            ApiResponse<List<UsuarioCuotasDTO>> response = 
                new ApiResponse<>("FETCH Usuarios con cuotas obtenidos exitosamente", usuarios);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener los usuarios con cuotas: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUsuario(@PathVariable Long id) {
        try {
            Optional<UsuarioEntity> usuarioOpt = usuarioService.findById(id);
            if (!usuarioOpt.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Usuario no encontrado");
                return ResponseEntity.status(404).body(response);
            }

            UsuarioDTO usuarioDTO = mapearAUsuarioDTO(usuarioOpt.get());
            
            ApiResponse<UsuarioDTO> response = 
                new ApiResponse<>("FETCH Usuario obtenido exitosamente", usuarioDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener los usuario: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // -- Creditos ---
    @GetMapping("/{id}/creditos")
    public ResponseEntity<ApiResponse> getUsuarioCreditos(@PathVariable Long id) {
        try {
            List<CreditoEntity> creditos = creditoService.findByUsuarioId(id);
            List<CreditoEntity> creditosPendientes = creditoService.findPendientesByUsuarioId(id);
            List<CreditoEntity> creditosAceptados = creditoService.findAceptadosByUsuarioId(id);
            List<CreditoEntity> creditosRechazados = creditoService.findRechazadosByUsuarioId(id);
            List<CreditoEntity> creditosFinalizados = creditoService.findFinalizadosByUsuarioId(id);

            List<CreditoTablaDTO> todosDTOs = mapearACreditoTablaDTOs(creditos);
            List<CreditoTablaDTO> pendientesDTOs = mapearACreditoTablaDTOs(creditosPendientes);
            List<CreditoTablaDTO> aceptadosDTOs = mapearACreditoTablaDTOs(creditosAceptados);
            List<CreditoTablaDTO> rechazadosDTOs = mapearACreditoTablaDTOs(creditosRechazados);
            List<CreditoTablaDTO> finalizadosDTOs = mapearACreditoTablaDTOs(creditosFinalizados);

            List<GroupDTO<CreditoTablaDTO>> groupedResponse = Arrays.asList(
                new GroupDTO<>("Todos", todosDTOs),
                new GroupDTO<>("Pendientes", pendientesDTOs),
                new GroupDTO<>("Aceptados", aceptadosDTOs),
                new GroupDTO<>("Rechazados", rechazadosDTOs),
                new GroupDTO<>("Finalizados", finalizadosDTOs)
            );

            ApiResponse<List<GroupDTO<CreditoTablaDTO>>> response = new ApiResponse<>("FETCH Créditos del usuario obtenidos exitosamente", groupedResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener los créditos del usuario: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/bloquear")
    public ResponseEntity<ApiResponse> bloquearUsuario(@PathVariable Long id) {
        try {
            Optional<UsuarioEntity> usuarioOpt = usuarioService.findById(id);
            if (!usuarioOpt.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Usuario no encontrado");
                return ResponseEntity.status(404).body(response);
            }

            UsuarioEntity usuario = usuarioOpt.get();
            usuario.setEnabled(false);
            usuarioService.save(usuario);
            
            ApiResponse<List<UsuarioTablaDTO>> response = 
                new ApiResponse<>("Usuario bloqueaado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al bloquear el usuario: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{id}/desbloquear")
    public ResponseEntity<ApiResponse> desbloquearUsuario(@PathVariable Long id) {
        try {
            Optional<UsuarioEntity> usuarioOpt = usuarioService.findById(id);
            if (!usuarioOpt.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Usuario no encontrado");
                return ResponseEntity.status(404).body(response);
            }

            UsuarioEntity usuario = usuarioOpt.get();
            usuario.setEnabled(true);
            usuarioService.save(usuario);
            
            ApiResponse<List<UsuarioTablaDTO>> response = 
                new ApiResponse<>("Usuario desbloqueaado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al desbloquear el usuario: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // --- PDFs ---
    @PostMapping("/{id}/pdf")
    public void getPDFInforme(@PathVariable("id") Long usuarioId, HttpServletResponse response) {
        Optional<UsuarioEntity> usuarioOpt = usuarioService.findById(usuarioId);
        UsuarioEntity usuario = usuarioOpt.get();

        List<CreditoEntity> creditos = creditoService.findByUsuarioId(usuarioId);
        
        pdfService.generarUsuarioInformePDF(usuario, creditos, response);
    }
}