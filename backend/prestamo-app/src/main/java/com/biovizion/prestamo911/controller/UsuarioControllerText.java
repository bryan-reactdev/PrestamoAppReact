package com.biovizion.prestamo911.controller;

import static com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.mapearACreditoTablaDTOs;
import static com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.mapearACuotaTablaDTOs;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.biovizion.prestamo911.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.prestamo911.DTOs.GlobalDTOs.GroupDTO;
import com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.CreditoTablaDTO;
import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.CuotaTablaDTO;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.UsuarioService;
import com.biovizion.prestamo911.utils.AuthUtils;

@Controller
@RequestMapping("/usuarioText")
public class UsuarioControllerText {
    @Autowired
    private CreditoService creditoService;

    @Autowired
    private CreditoCuotaService cuotaService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/creditos")
    public ResponseEntity<ApiResponse> getCreditos(){
        try {
            String dui = AuthUtils.getUsername();
            Long userId = usuarioService.findByDui(dui)
                    .map(u -> u.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println(dui);

            List<CreditoEntity> creditos = creditoService.findByUsuarioId(userId);
            List<CreditoEntity> creditosPendientes = creditoService.findPendientesByUsuarioId(userId);
            List<CreditoEntity> creditosAceptados = creditoService.findAceptadosByUsuarioId(userId);
            List<CreditoEntity> creditosRechazados = creditoService.findRechazadosByUsuarioId(userId);
            List<CreditoEntity> creditosFinalizados = creditoService.findFinalizadosByUsuarioId(userId);

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

            ApiResponse<List<GroupDTO<CreditoTablaDTO>>> response = new ApiResponse<>("FETCH Créditos obtenidos exitosamente", groupedResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener los créditos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/{id}/cuotas")
    public ResponseEntity<ApiResponse> getCuotasDeCredito(@PathVariable Long id){
        try {
            List<CreditoCuotaEntity> cuotas = cuotaService.findByCreditoId(id);
            List<CreditoCuotaEntity> cuotasPendientes = cuotaService.findPendientesByCreditoId(id);
            List<CreditoCuotaEntity> cuotasPagadas = cuotaService.findPagadasByCreditoId(id);
            List<CreditoCuotaEntity> cuotasVencidas = cuotaService.findVencidasByCreditoId(id);
            List<CreditoCuotaEntity> cuotasEnRevision = cuotaService.findEnRevisionByCreditoId(id);

            List<CuotaTablaDTO> todosDTOs = mapearACuotaTablaDTOs(cuotas);
            List<CuotaTablaDTO> pendientesDTOs = mapearACuotaTablaDTOs(cuotasPendientes);
            List<CuotaTablaDTO> pagadasDTOs = mapearACuotaTablaDTOs(cuotasPagadas);
            List<CuotaTablaDTO> vencidasDTOs = mapearACuotaTablaDTOs(cuotasVencidas);
            List<CuotaTablaDTO> enRevisionDTOs = mapearACuotaTablaDTOs(cuotasEnRevision);
            
            List<GroupDTO<CuotaTablaDTO>> groupedResponse = Arrays.asList(
                new GroupDTO<>("Todos", todosDTOs),
                new GroupDTO<>("Pendientes", pendientesDTOs),
                new GroupDTO<>("Pagadas", pagadasDTOs),
                new GroupDTO<>("Vencidas", vencidasDTOs),
                new GroupDTO<>("EnRevision", enRevisionDTOs)
            );
           
            ApiResponse<List<GroupDTO<CuotaTablaDTO>>> response = new ApiResponse<>("FETCH Cuotas del crédito obtenidas exitosamente", groupedResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();

            ApiResponse<String> response = new ApiResponse<>("Error al obtener las cuotas del crédito: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
