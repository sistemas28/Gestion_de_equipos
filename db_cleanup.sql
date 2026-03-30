-- ============================================================
-- SCRIPT DE LIMPIEZA Y OPTIMIZACIÓN - GESTIÓN DE EQUIPOS (V2)
-- ============================================================

USE gestion_equipos;

-- 1. ELIMINAR TABLAS DUPLICADAS Y CONFUSAS (BASURA)
DROP TABLE IF EXISTS copiasDeSeguridad;
DROP TABLE IF EXISTS copiasdeseguridad;
DROP TABLE IF EXISTS historialEquipos;

-- 2. LIMPIEZA DE DATOS INVÁLIDOS
-- Eliminar usuario duplicado que no tiene acceso (ID 23)
DELETE FROM usuarios WHERE id = 23 AND NOT EXISTS (SELECT 1 FROM auth WHERE id = 23);

-- Eliminar registros de copias de seguridad de equipos que ya no existen
DELETE FROM CopiasDeSeguridad WHERE equipo_id NOT IN (SELECT id FROM equipos) AND equipo_id IS NOT NULL;

-- Primero eliminamos cualquier basura restante en mantenimiento por si acaso
DELETE FROM mantenimiento WHERE equipo_id NOT IN (SELECT id FROM equipos) AND equipo_id IS NOT NULL;
DELETE FROM historial_equipos WHERE equipo_id NOT IN (SELECT id FROM equipos) AND equipo_id IS NOT NULL;

-- 3. FORTALECER INTEGRIDAD DE DATOS (FOREIGN KEYS)
-- Nota: 'licenciamiento' no tiene equipo_id, se omite de FK por ahora.

ALTER TABLE mantenimiento 
    ADD CONSTRAINT fk_mantenimiento_equipo 
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) 
    ON DELETE CASCADE;

ALTER TABLE CopiasDeSeguridad 
    ADD CONSTRAINT fk_copias_equipo 
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) 
    ON DELETE CASCADE;

ALTER TABLE historial_equipos 
    ADD CONSTRAINT fk_historial_equipo 
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) 
    ON DELETE CASCADE;

-- 4. OPTIMIZAR TABLAS
OPTIMIZE TABLE equipos, usuarios, mantenimiento, CopiasDeSeguridad, historial_equipos;

SELECT '✅ Base de Datos optimizada y limpia con éxito' as Resultado;
