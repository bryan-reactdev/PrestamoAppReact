package com.biovizion.prestamo911;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.biovizion.prestamo911.DTOs.GlobalDTOs.ApiResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        ApiResponse response = 
            new ApiResponse("Envíaste información inválida o faltante. Recarga la página e intenta de nuevo");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
