package com.biovizion.prestamo911.controller;

import static com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.mapearACuotaDTO;
import static com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.mapearACuotaTablaDTOs;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.CuotaDTO;
import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.CuotaTablaDTO;
import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.NotaDTO;
import com.biovizion.prestamo911.DTOs.Cuota.CuotaRequestDTOs.AbonoRequest;
import com.biovizion.prestamo911.DTOs.Cuota.CuotaRequestDTOs.CuotaEditRequest;
import com.biovizion.prestamo911.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.prestamo911.DTOs.GlobalDTOs.GroupDTO;
import com.biovizion.prestamo911.entities.AbonoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.NotaEntity;
import com.biovizion.prestamo911.service.AbonoCuotaService;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.utils.CuotaUtils;
import com.biovizion.prestamo911.utils.CurrencyUtils;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@Controller
@RequestMapping("/cuotaTest")
public class CuotaControllerTest {
    @Autowired
    private CurrencyUtils currencyUtils;

    @Autowired
    private CuotaUtils cuotaUtils;

    @Autowired
    private CreditoCuotaService cuotaService;

    @Autowired
    private AbonoCuotaService abonoService;
    
    @GetMapping("/")
    public ResponseEntity<ApiResponse> getCuotas() {
        try {
            List<CreditoCuotaEntity> cuotas = cuotaService.findAll();
            List<CreditoCuotaEntity> cuotasPendientes = cuotaService.findPendientes();
            List<CreditoCuotaEntity> cuotasPagadas = cuotaService.findPagadas();
            List<CreditoCuotaEntity> cuotasVencidas = cuotaService.findVencidas();
            List<CreditoCuotaEntity> cuotasEnRevision = cuotaService.findEnRevision();
            
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
           
            ApiResponse<List<GroupDTO<CuotaTablaDTO>>> response = new ApiResponse<>("FETCH Cuotas obtenidas exitosamente", groupedResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener las cuotas: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCuota(@PathVariable Long id) {
        try {
            Optional<CreditoCuotaEntity> cuotaOpt = cuotaService.findById(id);
            if (!cuotaOpt.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Cuota no encontrada");
                return ResponseEntity.status(404).body(response);
            }
            CreditoCuotaEntity cuota = cuotaOpt.get();
            CuotaDTO cuotaDTO = mapearACuotaDTO(cuota);
           
            ApiResponse<CuotaDTO> response = new ApiResponse<>("FETCH Cuota obtenidas exitosamente", cuotaDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener la cuota: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }   

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateCuota(@PathVariable Long id, @RequestBody CuotaEditRequest request) {
        try {
            Optional<CreditoCuotaEntity> cuotaOpt = cuotaService.findById(id);
            if (!cuotaOpt.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Cuota no encontrada");
                return ResponseEntity.status(404).body(response);
            }
            
            CreditoCuotaEntity cuota = cuotaOpt.get();
            Boolean isPagado = "Pagado".equals(cuota.getEstado());

            if (isPagado){
                currencyUtils.removeFondos(cuota.getTotal());
            }

            cuota.setEstado(request.getEstado());
            cuota.setFechaVencimiento(request.getFechaVencimiento().atStartOfDay());
            cuota.setFechaPago(request.getFechaPagado().atStartOfDay());
            cuota.setMonto(request.getMonto());
            cuota.setPagoMora(request.getMora());
            cuota.setAbono(request.getAbono());

            BigDecimal total = (request.getMonto().add(request.getMora()).subtract(request.getAbono()));
            cuota.setTotal(total);

            if (isPagado){
                currencyUtils.addFondos(total);
            }
           
            ApiResponse<CuotaDTO> response = new ApiResponse<>("Cuota editada exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al editar la cuota: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }    

    @PostMapping("/pagar/{id}")
    public ResponseEntity<ApiResponse> pagarCuota(@PathVariable Long id) {
        try {
            Optional<CreditoCuotaEntity> cuotaOpt = cuotaService.findById(id);
            if (!cuotaOpt.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Cuota no encontrada");
                return ResponseEntity.status(404).body(response);
            }

            CreditoCuotaEntity cuota = cuotaOpt.get();
            cuotaUtils.pagarCuota(cuota);

            ApiResponse<CreditoCuotaEntity> response = new ApiResponse<>("Cuota pagada exitosamente", cuota);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al pagar la cuota: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }        
    }

    @PostMapping("/abonar/{id}")
    public ResponseEntity<ApiResponse> abonarCuota(@PathVariable Long id, @RequestBody AbonoRequest request) {
        try {
            Optional<CreditoCuotaEntity> cuotaOpt = cuotaService.findById(id);
            if (!cuotaOpt.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Cuota no encontrada");
                return ResponseEntity.status(404).body(response);
            }
            if (request.getMonto().compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException(
                    "No es posible abonar un monto menor a $0 (USD)"
                );
            }

            CreditoCuotaEntity cuota = cuotaOpt.get();
            cuota.setAbono(
                (cuota.getAbono() != null && cuota.getAbono().compareTo(BigDecimal.ZERO) != 0)
                    ? cuota.getAbono().add(request.getMonto())
                    : request.getMonto()
            );

            cuota.setTotal(cuota.getTotal().subtract(request.getMonto()));
            currencyUtils.addFondos(request.getMonto());

            AbonoCuotaEntity abono = new AbonoCuotaEntity();
            abono.setCreditoCuota(cuota);
            abono.setFechaAbono(request.getFecha());
            abono.setMonto(request.getMonto());

            cuotaService.save(cuota);
            abonoService.save(abono);

            ApiResponse<CreditoCuotaEntity> response = new ApiResponse<>("Cuota abonada exitosamente", cuota);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            ApiResponse<String> response = new ApiResponse<>("Error al abonar la cuota: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }        
    }

    @PostMapping("/notas/{id}")
    public ResponseEntity<ApiResponse> guardarNotasCuota(
            @PathVariable Long id, 
            @RequestBody List<NotaDTO> notasDtoList) {
        try {
            Optional<CreditoCuotaEntity> cuotaOpt = cuotaService.findById(id);
            if (!cuotaOpt.isPresent()) {
                return ResponseEntity.status(404).body(new ApiResponse<>("Cuota no encontrada"));
            }
            CreditoCuotaEntity cuota = cuotaOpt.get();

            cuota.getNotas().clear();
            for (NotaDTO dto : notasDtoList) {
                NotaEntity nota = new NotaEntity();
                nota.setContenido(dto.getContenido());
                nota.setFecha(dto.getFecha().atStartOfDay());
                nota.setCuota(cuota);
                cuota.getNotas().add(nota);
            }

            cuotaService.save(cuota);

            return ResponseEntity.ok(new ApiResponse<>("Notas guardadas exitosamente", cuota));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse<>("Error al guardar las notas: " + e.getMessage()));
        }
    }
}