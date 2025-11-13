package com.biovizion.prestamo911.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;

import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;
import com.biovizion.prestamo911.entities.HistorialImageEntity;
import com.biovizion.prestamo911.entities.HistorialSaldoEntity;
import com.biovizion.prestamo911.entities.HistorialGastoEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;

public class FileUtils {

    private static final String RUTA_FOTOS = "/opt/prestamo911/fotos-usuarios/";
    private static final String RUTA_HISTORIAL_IMAGENES = "/opt/prestamo911/historial-imagenes/";

    public static String getRutaUsuarioFotos() {
        return RUTA_FOTOS;
    }

    public static String getRelativePath(String fileName) {
        return "/fotos-usuarios/" + fileName;
    }

    public static void safeDelete(String fullPath, String baseDir) {
        if (fullPath == null || fullPath.isEmpty()) return;

        // Normalize and ensure file is inside baseDir
        Path filePath = Path.of(baseDir).resolve(fullPath.replace("/fotos-usuarios/", "")).normalize();
        if (!filePath.startsWith(Path.of(baseDir))) return; // prevent deleting outside directory

        File file = filePath.toFile();
        if (file.exists()) file.delete();
    }

    public static void tryUploadFotoDUI(UsuarioEntity usuario, String tipo, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return;

        String baseDir = getRutaUsuarioFotos();

        // delete old
        String oldPath = tipo.equals("delante") ? usuario.getDuiDelante() : usuario.getDuiAtras();
        FileUtils.safeDelete(oldPath, baseDir);

        // save new file
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        String nombreArchivo = UUID.randomUUID().toString() + "." + extension;
        file.transferTo(new File(baseDir + nombreArchivo));

        // update entity
        String relativePath = FileUtils.getRelativePath(nombreArchivo);
        if (tipo.equals("delante")) usuario.setDuiDelante(relativePath);
        else usuario.setDuiAtras(relativePath);
    }

    public static void tryUploadFotoSolicitud(UsuarioSolicitudEntity solicitud, String tipo, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return;

        String baseDir = getRutaUsuarioFotos();

        // delete old
        String oldPath = tipo.equals("delante") ? solicitud.getDuiDelanteCodeudor() : tipo.equals("atras") ? solicitud.getDuiAtrasCodeudor() : solicitud.getFotoRecibo();
        FileUtils.safeDelete(oldPath, baseDir);

        // save new file
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        String nombreArchivo = UUID.randomUUID().toString() + "." + extension;
        file.transferTo(new File(baseDir + nombreArchivo));

        // update entity
        String relativePath = FileUtils.getRelativePath(nombreArchivo);
        if (tipo.equals("delante")) solicitud.setDuiDelanteCodeudor(relativePath);
        else if (tipo.equals("atras")) solicitud.setDuiAtrasCodeudor(relativePath);
        else solicitud.setFotoRecibo(relativePath);
    }

    // --- Historial Images Methods ---
    
    public static String getRutaHistorialImagenes() {
        return RUTA_HISTORIAL_IMAGENES;
    }

    public static String getRelativePathHistorialImagenes(String fileName) {
        return "/historial-imagenes/" + fileName;
    }

    public static void safeDeleteHistorialImage(String fullPath, String baseDir) {
        if (fullPath == null || fullPath.isEmpty()) return;

        // Normalize and ensure file is inside baseDir
        Path filePath = Path.of(baseDir).resolve(fullPath.replace("/historial-imagenes/", "")).normalize();
        if (!filePath.startsWith(Path.of(baseDir))) return; // prevent deleting outside directory

        File file = filePath.toFile();
        if (file.exists()) file.delete();
    }

    public static HistorialImageEntity uploadHistorialSaldoImage(HistorialSaldoEntity historialSaldo, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        String baseDir = getRutaHistorialImagenes();
        
        // Ensure directory exists
        File dir = new File(baseDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Save new file
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        String nombreArchivo = UUID.randomUUID().toString() + "." + extension;
        File targetFile = new File(baseDir + nombreArchivo);
        file.transferTo(targetFile);

        // Create image entity
        String relativePath = getRelativePathHistorialImagenes(nombreArchivo);
        HistorialImageEntity image = new HistorialImageEntity();
        image.setFilePath(relativePath);
        image.setFileName(file.getOriginalFilename());
        image.setFileSize(file.getSize());
        image.setMimeType(file.getContentType());
        image.setFecha(LocalDateTime.now());
        image.setHistorialSaldo(historialSaldo);

        return image;
    }

    public static HistorialImageEntity uploadHistorialGastoImage(HistorialGastoEntity historialGasto, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        String baseDir = getRutaHistorialImagenes();
        
        // Ensure directory exists
        File dir = new File(baseDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Save new file
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        String nombreArchivo = UUID.randomUUID().toString() + "." + extension;
        File targetFile = new File(baseDir + nombreArchivo);
        file.transferTo(targetFile);

        // Create image entity
        String relativePath = getRelativePathHistorialImagenes(nombreArchivo);
        HistorialImageEntity image = new HistorialImageEntity();
        image.setFilePath(relativePath);
        image.setFileName(file.getOriginalFilename());
        image.setFileSize(file.getSize());
        image.setMimeType(file.getContentType());
        image.setFecha(LocalDateTime.now());
        image.setHistorialGasto(historialGasto);

        return image;
    }

    public static void deleteHistorialImage(HistorialImageEntity image) {
        if (image == null || image.getFilePath() == null) return;
        
        String baseDir = getRutaHistorialImagenes();
        safeDeleteHistorialImage(image.getFilePath(), baseDir);
    }

    // --- Document Methods ---
    
    private static final String RUTA_DOCUMENTOS = "/opt/prestamo911/documentos/";

    public static String getRutaDocumentos() {
        return RUTA_DOCUMENTOS;
    }

    public static String getRelativePathDocumento(String fileName) {
        return "/documentos/" + fileName;
    }

    public static void tryUploadDocumento(CreditoEntity credito, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return;

        String baseDir = getRutaDocumentos();
        
        // Ensure directory exists
        File dir = new File(baseDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Delete old document if exists
        if (credito.getDocumento() != null && !credito.getDocumento().isEmpty()) {
            safeDeleteDocumento(credito.getDocumento(), baseDir);
        }

        // Save new file
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        String nombreArchivo = UUID.randomUUID().toString() + "." + extension;
        File targetFile = new File(baseDir + nombreArchivo);
        file.transferTo(targetFile);

        // Update entity
        String relativePath = getRelativePathDocumento(nombreArchivo);
        credito.setDocumento(relativePath);
    }

    public static void safeDeleteDocumento(String fullPath, String baseDir) {
        if (fullPath == null || fullPath.isEmpty()) return;

        // Normalize and ensure file is inside baseDir
        Path filePath = Path.of(baseDir).resolve(fullPath.replace("/documentos/", "")).normalize();
        if (!filePath.startsWith(Path.of(baseDir))) return; // prevent deleting outside directory

        File file = filePath.toFile();
        if (file.exists()) file.delete();
    }
}
