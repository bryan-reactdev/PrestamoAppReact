package com.biovizion.prestamo911.controller;

import static com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.mapearACreditoDTOs;
import static com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.mapearAAbonoDTOs;
import static com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.mapearACuotaDTOs;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import static com.biovizion.prestamo911.DTOs.Currency.CurrencyDTOs.mapearAHistorialDTOs;

import com.biovizion.prestamo911.DTOs.Currency.CurrencyDTOs.AllCurrencyDTO;
import com.biovizion.prestamo911.DTOs.Currency.CurrencyDTOs.CuotasTotalesDTO;
import com.biovizion.prestamo911.DTOs.Currency.CurrencyRequestDTOs.IngresoRequest;
import com.biovizion.prestamo911.DTOs.Currency.CurrencyRequestDTOs.EgresoRequest;
import com.biovizion.prestamo911.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.prestamo911.entities.AbonoCuotaEntity;
import com.biovizion.prestamo911.entities.BalanceEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.HistorialBalanceEntity;
import com.biovizion.prestamo911.entities.HistorialGastoEntity;
import com.biovizion.prestamo911.entities.HistorialSaldoEntity;
import com.biovizion.prestamo911.service.AbonoCuotaService;
import com.biovizion.prestamo911.service.BalanceService;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.HistorialBalanceService;
import com.biovizion.prestamo911.service.HistorialGastoService;
import com.biovizion.prestamo911.service.HistorialSaldoService;
import com.biovizion.prestamo911.service.PdfService;
import com.biovizion.prestamo911.utils.CurrencyUtils;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import static com.biovizion.prestamo911.utils.FileUtils.uploadHistorialSaldoImage;
import static com.biovizion.prestamo911.utils.FileUtils.uploadHistorialGastoImage;
import static com.biovizion.prestamo911.utils.FileUtils.deleteHistorialImage;
import com.biovizion.prestamo911.entities.HistorialImageEntity;
import com.biovizion.prestamo911.DTOs.Currency.CurrencyRequestDTOs.HistorialEditRequest;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;


@Controller
@RequestMapping("/currency")
public class CurrencyController {
    @Autowired
    private CurrencyUtils currencyUtils;

    @Autowired
    private BalanceService balanceService;

    @Autowired
    private HistorialBalanceService historialBalanceService;

    @Autowired
    private HistorialSaldoService historialSaldoService;

    @Autowired
    private CreditoCuotaService cuotaService;

    @Autowired
    private AbonoCuotaService abonoService;

    @Autowired
    private HistorialGastoService gastoService;

    @Autowired
    private CreditoService creditoService;

    @Autowired
    private PdfService pdfService;


    @GetMapping("/cuotas")
    public ResponseEntity<ApiResponse> getCuotasTotales() {
        try {
            List<CreditoCuotaEntity> cuotasVencidas = cuotaService.findVencidas();
            List<CreditoCuotaEntity> cuotasPendienetes = cuotaService.findPendientes();
            List<CreditoCuotaEntity> cuotasPagadas = cuotaService.findPagadas();

            BigDecimal totalVencidas = cuotasVencidas.stream()
                                        .map(CreditoCuotaEntity::getTotal)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalPendientes = cuotasPendienetes.stream()
                                        .map(CreditoCuotaEntity::getTotal)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalPagadas = cuotasPagadas.stream()
                                        .map(CreditoCuotaEntity::getTotal)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

            ApiResponse<CuotasTotalesDTO> response = 
                new ApiResponse<>("FETCH Totales de cuotas obtenidos exitosamente", new CuotasTotalesDTO(
                    totalVencidas,
                    totalPendientes, totalPagadas
                ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener los totales de cuotas: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/balance")
    public ResponseEntity<ApiResponse> getBalance() {
        try {
            ApiResponse<AllCurrencyDTO> response = 
                new ApiResponse<>("FETCH Balance obtenido exitosamente", GetCurrentCurrency());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener el balance: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping(value = "/ingreso", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> realizarIngreso(@ModelAttribute IngresoRequest request) {
        try {
            HistorialSaldoEntity ingreso = new HistorialSaldoEntity();
            ingreso.setMonto(request.getMonto());
            ingreso.setMotivo(request.getMotivo());
            ingreso.setTipo(request.getTipo());
            ingreso.setFecha(request.getFecha().atStartOfDay());
            
            // Save the entity first to get the ID
            historialSaldoService.save(ingreso);
            
            // Handle image uploads
            if (request.getImages() != null && request.getImages().length > 0) {
                for (MultipartFile image : request.getImages()) {
                    if (image != null && !image.isEmpty()) {
                        try {
                            HistorialImageEntity imageEntity = uploadHistorialSaldoImage(ingreso, image);
                            if (imageEntity != null) {
                                ingreso.getImagenes().add(imageEntity);
                            }
                        } catch (IOException e) {
                            // Log error but don't fail the whole operation
                            System.err.println("Error uploading image: " + e.getMessage());
                        }
                    }
                }
                // Save with images (cascade will save them)
                historialSaldoService.save(ingreso);
            }
            
            currencyUtils.addFondos(request.getMonto());

            ApiResponse<HistorialSaldoEntity> response = 
                new ApiResponse<>("Ingreso realizado exitosamente", ingreso);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al realizar el ingreso: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping(value = "/egreso", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> realizarEgreso(@ModelAttribute EgresoRequest request) {
        try {
            HistorialGastoEntity egreso = new HistorialGastoEntity();
            egreso.setMonto(request.getMonto());
            egreso.setMotivo(request.getMotivo());
            egreso.setTipo(request.getTipo());
            egreso.setFecha(request.getFecha().atStartOfDay());
            
            // Save the entity first to get the ID
            gastoService.save(egreso);
            
            // Handle image uploads
            if (request.getImages() != null && request.getImages().length > 0) {
                for (MultipartFile image : request.getImages()) {
                    if (image != null && !image.isEmpty()) {
                        try {
                            HistorialImageEntity imageEntity = uploadHistorialGastoImage(egreso, image);
                            if (imageEntity != null) {
                                egreso.getImagenes().add(imageEntity);
                            }
                        } catch (IOException e) {
                            // Log error but don't fail the whole operation
                            System.err.println("Error uploading image: " + e.getMessage());
                        }
                    }
                }
                // Save with images (cascade will save them)
                gastoService.save(egreso);
            }
            
            currencyUtils.removeFondos(request.getMonto());

            ApiResponse<HistorialGastoEntity> response = 
                new ApiResponse<>("Egreso realizado exitosamente", egreso);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al realizar el egreso: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping(value = "/historial/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> editarHistorial(@PathVariable Long id, @ModelAttribute HistorialEditRequest request) {
        try {
            // Try to find as ingreso first
            var ingresoOpt = historialSaldoService.findById(id);
            if (ingresoOpt.isPresent()) {
                HistorialSaldoEntity ingreso = ingresoOpt.get();
                BigDecimal montoAnterior = ingreso.getMonto();
                
                // Update basic fields
                ingreso.setMonto(request.getMonto());
                ingreso.setMotivo(request.getMotivo());
                ingreso.setTipo(request.getTipo());
                ingreso.setFecha(request.getFecha().atStartOfDay());
                
                // Handle images: delete removed, keep existing, add new
                List<String> existingPaths = request.getExistingImages() != null 
                    ? Arrays.asList(request.getExistingImages()) 
                    : new ArrayList<>();
                
                // Delete images not in existingPaths
                List<HistorialImageEntity> imagenesToRemove = new ArrayList<>();
                for (HistorialImageEntity img : ingreso.getImagenes()) {
                    if (!existingPaths.contains(img.getFilePath())) {
                        imagenesToRemove.add(img);
                    }
                }
                for (HistorialImageEntity img : imagenesToRemove) {
                    deleteHistorialImage(img);
                    ingreso.getImagenes().remove(img);
                }
                
                // Add new images
                if (request.getImages() != null && request.getImages().length > 0) {
                    for (MultipartFile image : request.getImages()) {
                        if (image != null && !image.isEmpty()) {
                            try {
                                HistorialImageEntity imageEntity = uploadHistorialSaldoImage(ingreso, image);
                                if (imageEntity != null) {
                                    ingreso.getImagenes().add(imageEntity);
                                }
                            } catch (IOException e) {
                                System.err.println("Error uploading image: " + e.getMessage());
                            }
                        }
                    }
                }
                
                historialSaldoService.save(ingreso);
                
                // Update balance if monto changed
                if (montoAnterior.compareTo(request.getMonto()) != 0) {
                    currencyUtils.removeFondos(montoAnterior);
                    currencyUtils.addFondos(request.getMonto());
                }
                
                ApiResponse<String> response = new ApiResponse<>("Ingreso editado exitosamente");
                return ResponseEntity.ok(response);
            }
            
            // Try to find as egreso
            var egresoOpt = gastoService.findById(id);
            if (egresoOpt.isPresent()) {
                HistorialGastoEntity egreso = egresoOpt.get();
                BigDecimal montoAnterior = egreso.getMonto();
                
                // Update basic fields
                egreso.setMonto(request.getMonto());
                egreso.setMotivo(request.getMotivo());
                egreso.setTipo(request.getTipo());
                egreso.setFecha(request.getFecha().atStartOfDay());
                
                // Handle images: delete removed, keep existing, add new
                List<String> existingPaths = request.getExistingImages() != null 
                    ? Arrays.asList(request.getExistingImages()) 
                    : new ArrayList<>();
                
                // Delete images not in existingPaths
                List<HistorialImageEntity> imagenesToRemove = new ArrayList<>();
                for (HistorialImageEntity img : egreso.getImagenes()) {
                    if (!existingPaths.contains(img.getFilePath())) {
                        imagenesToRemove.add(img);
                    }
                }
                for (HistorialImageEntity img : imagenesToRemove) {
                    deleteHistorialImage(img);
                    egreso.getImagenes().remove(img);
                }
                
                // Add new images
                if (request.getImages() != null && request.getImages().length > 0) {
                    for (MultipartFile image : request.getImages()) {
                        if (image != null && !image.isEmpty()) {
                            try {
                                HistorialImageEntity imageEntity = uploadHistorialGastoImage(egreso, image);
                                if (imageEntity != null) {
                                    egreso.getImagenes().add(imageEntity);
                                }
                            } catch (IOException e) {
                                System.err.println("Error uploading image: " + e.getMessage());
                            }
                        }
                    }
                }
                
                gastoService.save(egreso);
                
                // Update balance if monto changed
                if (montoAnterior.compareTo(request.getMonto()) != 0) {
                    currencyUtils.addFondos(montoAnterior);
                    currencyUtils.removeFondos(request.getMonto());
                }
                
                ApiResponse<String> response = new ApiResponse<>("Egreso editado exitosamente");
                return ResponseEntity.ok(response);
            }
            
            // Not found
            ApiResponse<String> response = new ApiResponse<>("Registro no encontrado");
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al editar el registro: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // --- PDFs ---
    @PostMapping("/ingreso/{fecha}/pdf")
    public void getPDFIngreso(@PathVariable LocalDate fecha, Long usuarioId, HttpServletResponse response) {
        List<CreditoCuotaEntity> cuotas = cuotaService.findAllByEstadoAndFechaPago("Pagado", fecha);
        List<AbonoCuotaEntity> abonos = abonoService.findAllByFecha(fecha);
        List<HistorialSaldoEntity> ingresos = historialSaldoService.findAllByFecha(fecha);
        
        pdfService.generarReporteDiarioIngreso(GetCurrentCurrency().getSaldo(), cuotas, abonos, ingresos, fecha, response);
    }

    @PostMapping("/egreso/{fecha}/pdf")
    public void getPDFEgreso(@PathVariable LocalDate fecha, Long usuarioId, HttpServletResponse response) {
        List<CreditoEntity> creditos = creditoService.findAllByDesembolsadoAndFechaDesembolsado(true, fecha);
        List<HistorialGastoEntity> gastos = gastoService.findAllByFecha(fecha);

        pdfService.generarReporteDiarioEgreso(GetCurrentCurrency().getSaldo(), creditos, gastos, fecha, response);
    }


    public AllCurrencyDTO GetCurrentCurrency(){
        BalanceEntity balance = balanceService.get();
        List<HistorialBalanceEntity> historialBalance = historialBalanceService.findAll();
        
        // Ingresos
        List<HistorialSaldoEntity> ingresosCapitalesEntities = historialSaldoService.findAllByTipo("Capital");
        List<HistorialSaldoEntity> ingresosVariosEntities = historialSaldoService.findAllByTipo("Varios");
        List<AbonoCuotaEntity> cuotasAbonos = abonoService.findAll();
        List<CreditoCuotaEntity> cuotasPagadas = cuotaService.findPagadas();

        // Egresos
        List<HistorialGastoEntity> gastosEmpresaEntities = gastoService.findAllByTipo("Empresa");
        List<HistorialGastoEntity> egresosVariosEntities = gastoService.findAllByTipo("Varios");
        List<HistorialGastoEntity> egresosCuotasRetirosEntities = gastoService.findAllByTipo("Retiro de Cuotas");
        List<CreditoEntity> creditosDesembolsados = creditoService.findAllByDesembolsado(true);

        return new AllCurrencyDTO(
            balance.getSaldo(),
            historialBalance,
            mapearAHistorialDTOs(ingresosCapitalesEntities),
            mapearAHistorialDTOs(ingresosVariosEntities),
            mapearAAbonoDTOs(cuotasAbonos),
            mapearACuotaDTOs(cuotasPagadas),
            mapearAHistorialDTOs(gastosEmpresaEntities),
            mapearAHistorialDTOs(egresosVariosEntities),
            mapearAHistorialDTOs(egresosCuotasRetirosEntities),
            mapearACreditoDTOs(creditosDesembolsados)
        );
    }
}