package com.biovizion.prestamo911.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;

import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;

public class FileUtils {

    private static final String RUTA_FOTOS = "/opt/prestamo911/fotos-usuarios/";

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
}
