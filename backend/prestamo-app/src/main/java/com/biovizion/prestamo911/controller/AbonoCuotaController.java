package com.biovizion.prestamo911.controller;


import com.biovizion.prestamo911.entities.AbonoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.service.*;
import com.biovizion.prestamo911.utils.AccionTipo;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;

@Controller
@RequestMapping("abono")
public class AbonoCuotaController {

    @Autowired
    private CreditoCuotaService creditoCuotaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioAccionService usuarioAccionService;

    @Autowired
    private AbonoCuotaService abonoCuotaService;


    @PostMapping("/{id}")
    public void abonarCuota(@PathVariable Long id,
                            @RequestParam("monto") BigDecimal montoAbono,
                            HttpServletResponse response,
                            Principal principal) {
        try {
            // 1. Buscar la cuota
            CreditoCuotaEntity cuota = creditoCuotaService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuota no encontrada"));

            // 2. Validar monto
            if (montoAbono.compareTo(BigDecimal.ZERO) <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El abono debe ser mayor que 0");
            }

            // 3. Actualizar total de la cuota restando solo el abono
            BigDecimal totalActual = cuota.getTotal();
            BigDecimal nuevoTotal = totalActual.subtract(montoAbono);
            if (nuevoTotal.compareTo(BigDecimal.ZERO) < 0) {
                nuevoTotal = BigDecimal.ZERO;
            }
            cuota.setTotal(nuevoTotal);

            System.out.println(totalActual);
            System.out.println(montoAbono);
            System.out.println(nuevoTotal);

            // 3b. Actualizar el campo abono acumulado
            BigDecimal abonoActual = cuota.getAbono() != null ? cuota.getAbono() : BigDecimal.ZERO;
            cuota.setAbono(abonoActual.add(montoAbono));

            // 3c. Actualizar estado de la cuota
            String estadoActual = cuota.getEstado();
            cuota.setEstado(nuevoTotal.compareTo(BigDecimal.ZERO) == 0 ? "Pagado" : estadoActual);

            // Use update() to persist the modified total and abono.
            // save() in the service recalculates total = monto + pagoMora and would overwrite
            // the adjusted total after applying the abono, so call update() instead.
            creditoCuotaService.update(cuota);

            // 4. Registrar acción del usuario
            UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + principal.getName()));

            UsuarioAccionEntity accion = new UsuarioAccionEntity();
            accion.setAccion(AccionTipo.ABONO_CUOTA);
            accion.setUsuario(usuarioActual);
            accion.setUsuarioAfectado(cuota.getCredito().getUsuario());
            usuarioAccionService.save(accion);

            // 5. Registrar abono en la tabla abono_cuota
            AbonoCuotaEntity abono = new AbonoCuotaEntity();
            abono.setCreditoCuota(cuota);
            abono.setMonto(montoAbono);
            abono.setFechaAbono(LocalDate.now());
            abonoCuotaService.save(abono);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al abonar", e);
        }
    }

}
