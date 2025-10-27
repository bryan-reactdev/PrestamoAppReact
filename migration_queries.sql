-- Migration Script: Update Usuario table with missing data from UsuarioSolicitud
-- This script migrates estado_civil, fecha_nacimiento, ocupacion, and direccion
-- from the latest usuario_solicitud records to the usuario table

-- =====================================================
-- STEP 1: Check which users are missing the new columns
-- =====================================================

-- Check users missing estado_civil
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    u.estado_civil,
    'Missing estado_civil' as missing_field
FROM usuario u 
WHERE u.estado_civil IS NULL OR u.estado_civil = '';

-- Check users missing fecha_nacimiento  
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    u.fecha_nacimiento,
    'Missing fecha_nacimiento' as missing_field
FROM usuario u 
WHERE u.fecha_nacimiento IS NULL;

-- Check users missing ocupacion
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    u.ocupacion,
    'Missing ocupacion' as missing_field
FROM usuario u 
WHERE u.ocupacion IS NULL OR u.ocupacion = '';

-- Check users missing direccion
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    u.direccion,
    'Missing direccion' as missing_field
FROM usuario u 
WHERE u.direccion IS NULL OR u.direccion = '';

-- =====================================================
-- STEP 2: Migration Queries
-- =====================================================

-- Update estado_civil from latest usuario_solicitud
UPDATE usuario u
SET estado_civil = (
    SELECT us.estado_civil 
    FROM usuario_solicitud us 
    WHERE (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
           OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
           OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
      AND us.estado_civil IS NOT NULL 
      AND us.estado_civil != ''
    ORDER BY us.fecha_solicitud DESC, us.id DESC
    LIMIT 1
)
WHERE (u.estado_civil IS NULL OR u.estado_civil = '')
  AND EXISTS (
    SELECT 1 
    FROM usuario_solicitud us 
    WHERE (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
           OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
           OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
      AND us.estado_civil IS NOT NULL 
      AND us.estado_civil != ''
  );

-- Update fecha_nacimiento from latest usuario_solicitud
UPDATE usuario u
SET fecha_nacimiento = (
    SELECT us.fecha_nacimiento 
    FROM usuario_solicitud us 
    WHERE (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
           OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
           OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
      AND us.fecha_nacimiento IS NOT NULL
    ORDER BY us.fecha_solicitud DESC, us.id DESC
    LIMIT 1
)
WHERE u.fecha_nacimiento IS NULL
  AND EXISTS (
    SELECT 1 
    FROM usuario_solicitud us 
    WHERE (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
           OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
           OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
      AND us.fecha_nacimiento IS NOT NULL
  );

-- Update ocupacion from latest usuario_solicitud (using puesto field)
UPDATE usuario u
SET ocupacion = (
    SELECT us.puesto 
    FROM usuario_solicitud us 
    WHERE (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
           OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
           OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
      AND us.puesto IS NOT NULL 
      AND us.puesto != ''
    ORDER BY us.fecha_solicitud DESC, us.id DESC
    LIMIT 1
)
WHERE (u.ocupacion IS NULL OR u.ocupacion = '')
  AND EXISTS (
    SELECT 1 
    FROM usuario_solicitud us 
    WHERE (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
           OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
           OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
      AND us.puesto IS NOT NULL 
      AND us.puesto != ''
  );

-- Update direccion from latest usuario_solicitud
UPDATE usuario u
SET direccion = (
    SELECT us.direccion 
    FROM usuario_solicitud us 
    WHERE (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
           OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
           OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
      AND us.direccion IS NOT NULL 
      AND us.direccion != ''
    ORDER BY us.fecha_solicitud DESC, us.id DESC
    LIMIT 1
)
WHERE (u.direccion IS NULL OR u.direccion = '')
  AND EXISTS (
    SELECT 1 
    FROM usuario_solicitud us 
    WHERE (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
           OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
           OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
      AND us.direccion IS NOT NULL 
      AND us.direccion != ''
  );

-- =====================================================
-- STEP 3: Verification Queries
-- =====================================================

-- Check remaining users still missing estado_civil
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    COUNT(us.id) as solicitud_count,
    'Still missing estado_civil' as status
FROM usuario u 
LEFT JOIN usuario_solicitud us ON (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
                                   OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
                                   OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
WHERE (u.estado_civil IS NULL OR u.estado_civil = '')
GROUP BY u.id, u.nombre, u.apellido, u.email
ORDER BY solicitud_count DESC;

-- Check remaining users still missing fecha_nacimiento
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    COUNT(us.id) as solicitud_count,
    'Still missing fecha_nacimiento' as status
FROM usuario u 
LEFT JOIN usuario_solicitud us ON (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
                                   OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
                                   OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
WHERE u.fecha_nacimiento IS NULL
GROUP BY u.id, u.nombre, u.apellido, u.email
ORDER BY solicitud_count DESC;

-- Check remaining users still missing ocupacion
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    COUNT(us.id) as solicitud_count,
    'Still missing ocupacion' as status
FROM usuario u 
LEFT JOIN usuario_solicitud us ON (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
                                   OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
                                   OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
WHERE (u.ocupacion IS NULL OR u.ocupacion = '')
GROUP BY u.id, u.nombre, u.apellido, u.email
ORDER BY solicitud_count DESC;

-- Check remaining users still missing direccion
SELECT 
    u.id,
    u.nombre,
    u.apellido,
    u.email,
    COUNT(us.id) as solicitud_count,
    'Still missing direccion' as status
FROM usuario u 
LEFT JOIN usuario_solicitud us ON (us.email COLLATE utf8mb4_unicode_ci = u.email COLLATE utf8mb4_unicode_ci 
                                   OR us.dui COLLATE utf8mb4_unicode_ci = u.dui COLLATE utf8mb4_unicode_ci 
                                   OR us.telefono COLLATE utf8mb4_unicode_ci = u.celular COLLATE utf8mb4_unicode_ci)
WHERE (u.direccion IS NULL OR u.direccion = '')
GROUP BY u.id, u.nombre, u.apellido, u.email
ORDER BY solicitud_count DESC;

-- =====================================================
-- STEP 4: Summary Report
-- =====================================================

-- Summary of migration results
SELECT 
    'estado_civil' as field_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN estado_civil IS NOT NULL AND estado_civil != '' THEN 1 END) as filled_count,
    COUNT(CASE WHEN estado_civil IS NULL OR estado_civil = '' THEN 1 END) as missing_count
FROM usuario
UNION ALL
SELECT 
    'fecha_nacimiento' as field_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN fecha_nacimiento IS NOT NULL THEN 1 END) as filled_count,
    COUNT(CASE WHEN fecha_nacimiento IS NULL THEN 1 END) as missing_count
FROM usuario
UNION ALL
SELECT 
    'ocupacion' as field_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN ocupacion IS NOT NULL AND ocupacion != '' THEN 1 END) as filled_count,
    COUNT(CASE WHEN ocupacion IS NULL OR ocupacion = '' THEN 1 END) as missing_count
FROM usuario
UNION ALL
SELECT 
    'direccion' as field_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN direccion IS NOT NULL AND direccion != '' THEN 1 END) as filled_count,
    COUNT(CASE WHEN direccion IS NULL OR direccion = '' THEN 1 END) as missing_count
FROM usuario;
