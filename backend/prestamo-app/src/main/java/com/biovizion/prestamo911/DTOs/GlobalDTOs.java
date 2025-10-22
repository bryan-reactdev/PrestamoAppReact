package com.biovizion.prestamo911.DTOs;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class GlobalDTOs{
    @Getter
    @AllArgsConstructor
    public static class ApiResponse<T> {
        private String message;
        private T data;
    
        // Constructor para solo-mensajes
        public ApiResponse(String message) {
            this.message = message;
            this.data = null;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GroupDTO<T> {
        private String estado;
        private List<T> data;
    }
}
