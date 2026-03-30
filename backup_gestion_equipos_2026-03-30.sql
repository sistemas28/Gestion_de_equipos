-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: gestion_equipos
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `CopiasDeSeguridad`
--

DROP TABLE IF EXISTS `CopiasDeSeguridad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CopiasDeSeguridad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int DEFAULT NULL,
  `usuario` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marca` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `estado_copia` enum('Pendiente','En Progreso','Exitosa','Fallida') COLLATE utf8mb4_unicode_ci DEFAULT 'Pendiente',
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `tipo_copia` enum('Completa','Incremental','Diferencial') COLLATE utf8mb4_unicode_ci DEFAULT 'Completa',
  `ubicacion_almacenamiento` text COLLATE utf8mb4_unicode_ci,
  `tamaño_datos` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiempo_duracion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `responsable` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `equipo_id` (`equipo_id`),
  KEY `idx_fecha` (`fecha`),
  KEY `idx_estado` (`estado_copia`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CopiasDeSeguridad`
--

LOCK TABLES `CopiasDeSeguridad` WRITE;
/*!40000 ALTER TABLE `CopiasDeSeguridad` DISABLE KEYS */;
INSERT INTO `CopiasDeSeguridad` VALUES (1,1,'Juan Pérez','Informática','Computadora','Dell','INV-001','2025-12-18','Fallida',NULL,NULL,'Completa',NULL,NULL,NULL,'Copia de seguridad inicial del equipo','Admin','2025-12-18 21:40:42','2026-03-21 23:04:56'),(2,2,'María García','Administración','Laptop','HP','INV-002','2025-12-18','En Progreso',NULL,NULL,'Incremental',NULL,NULL,NULL,'Copia incremental en curso','Admin','2025-12-18 21:40:42','2025-12-18 21:40:42'),(3,3,'Carlos López','Recursos Humanos','Computadora','Lenovo','INV-003','2025-12-17','Exitosa',NULL,NULL,'Diferencial',NULL,NULL,NULL,'Copia completada exitosamente','Tech Lead','2025-12-18 21:40:42','2025-12-18 21:40:42'),(7,63,'Albeiro Vasquez Chica','Workstation','PC de escritorio','Dell','883','2026-03-21','Pendiente','18:03:00',NULL,'Completa','','','','','juan camilo poche','2026-03-21 23:04:01','2026-03-21 23:04:01');
/*!40000 ALTER TABLE `CopiasDeSeguridad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth`
--

DROP TABLE IF EXISTS `auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth` (
  `id` int NOT NULL,
  `usuario` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_auth_usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth`
--

LOCK TABLES `auth` WRITE;
/*!40000 ALTER TABLE `auth` DISABLE KEYS */;
INSERT INTO `auth` VALUES (1,'admin','admin123'),(28,'juanPoche','juan123'),(32,'alb','12345');
/*!40000 ALTER TABLE `auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `edad` int NOT NULL,
  `profesion` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `copiasDeSeguridad`
--

DROP TABLE IF EXISTS `copiasDeSeguridad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `copiasDeSeguridad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_backup` varchar(255) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `tipo` enum('manual','programada') DEFAULT 'manual',
  `estado` enum('exitoso','fallido','en_progreso') DEFAULT 'en_progreso',
  `fecha_inicio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_finalizacion` timestamp NULL DEFAULT NULL,
  `tamano_mb` decimal(10,2) DEFAULT NULL,
  `ruta_backup` varchar(500) DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `copiasDeSeguridad`
--

LOCK TABLES `copiasDeSeguridad` WRITE;
/*!40000 ALTER TABLE `copiasDeSeguridad` DISABLE KEYS */;
/*!40000 ALTER TABLE `copiasDeSeguridad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `copiasdeseguridad`
--

DROP TABLE IF EXISTS `copiasdeseguridad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `copiasdeseguridad` (
  `id` int NOT NULL,
  `usuario` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `area` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `marca` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `copiasdeseguridad`
--

LOCK TABLES `copiasdeseguridad` WRITE;
/*!40000 ALTER TABLE `copiasdeseguridad` DISABLE KEYS */;
INSERT INTO `copiasdeseguridad` VALUES (884,'juan212','sistemas','escritorio','dell','2025-10-21');
/*!40000 ALTER TABLE `copiasdeseguridad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dashboard`
--

DROP TABLE IF EXISTS `dashboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dashboard` (
  `id` int NOT NULL AUTO_INCREMENT,
  `total_mantenimientos` int DEFAULT '0',
  `mantenimientos_completados` int DEFAULT '0',
  `mantenimientos_pendientes` int DEFAULT '0',
  `total_backups` int DEFAULT '0',
  `backups_exitosos` int DEFAULT '0',
  `backups_pendientes` int DEFAULT '0',
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dashboard`
--

LOCK TABLES `dashboard` WRITE;
/*!40000 ALTER TABLE `dashboard` DISABLE KEYS */;
INSERT INTO `dashboard` VALUES (1,0,0,0,0,0,0,'2025-12-23 15:42:54');
/*!40000 ALTER TABLE `dashboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos`
--

DROP TABLE IF EXISTS `equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_de_usuario_asignado` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Area` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `marca` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `codigo_de_equipo` int NOT NULL,
  `sistema_operativo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'N/A',
  `procesador` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'N/A',
  `ram` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'N/A',
  `disco_duro` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'N/A',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_codigo_equipo` (`codigo_de_equipo`),
  KEY `idx_equipos_usuario` (`nombre_de_usuario_asignado`),
  KEY `idx_equipos_area` (`Area`),
  KEY `idx_equipos_codigo` (`codigo_de_equipo`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos`
--

LOCK TABLES `equipos` WRITE;
/*!40000 ALTER TABLE `equipos` DISABLE KEYS */;
INSERT INTO `equipos` VALUES (31,'Juan Camilo Poche','SISTEMAS','PC de escritorio','HP',842,'N/A','N/A','N/A','N/A'),(32,'Manuel Dorado','APOYO SECRETARIA GENERAL','PC de escritorio','HP',115,'N/A','N/A','N/A','N/A'),(33,'Aidee Omaira Chacon Agredo','APOYO SECRETARIA GENERAL','PC de escritorio','Lenovo',707,'N/A','N/A','N/A','N/A'),(34,'Reynaldo Benavides','ALMACEN','PC de escritorio','HP',141,'N/A','N/A','N/A','N/A'),(35,'Daisy Rivera Chávez','RECEPCION','PC de escritorio','HP',639,'N/A','N/A','N/A','N/A'),(36,'Sandra Mónica Gaviria','JURIDICA','PC de escritorio','Lenovo',480,'N/A','N/A','N/A','N/A'),(37,'Luisa Villamarin','JURIDICA','PC de escritorio','Dell',892,'N/A','N/A','N/A','N/A'),(38,'Janeth Salazar','JURIDICA','PC de escritorio','HP',158,'N/A','N/A','N/A','N/A'),(39,'Ana Cabezas','JURIDICA','PC de escritorio','HP',170,'N/A','N/A','N/A','N/A'),(40,'Astrid Natalia Trujillo','DIRECCION GENERAL','PC de escritorio','Dell',188,'N/A','N/A','N/A','N/A'),(41,'Yeison Alvarez','VIVIENDA','PC de escritorio','HP',305,'N/A','N/A','N/A','N/A'),(42,'Lizeth Marcela Rivera','VIVIENDA','PC de escritorio','HP',718,'N/A','N/A','N/A','N/A'),(43,'Dora Aguilar','VIVIENDA','PC de escritorio','HP',129,'N/A','N/A','N/A','N/A'),(44,'Juan Manuel Bravo','VIVIENDA','PC de escritorio','HP',578,'N/A','N/A','N/A','N/A'),(45,'Jesús Andrés Vivas','VIVIENDA','PC de escritorio','HP',541,'N/A','N/A','N/A','N/A'),(46,'Adrián Charo','VIVIENDA','PC de escritorio','HP',275,'N/A','N/A','N/A','N/A'),(47,'Jairo Alonso Embus','VIVIENDA','PC de escritorio','Dell',790,'N/A','N/A','N/A','N/A'),(48,'Jhon Jairo Hoyos','VIVIENDA','PC de escritorio','Dell',900,'N/A','N/A','N/A','N/A'),(49,'Diego Felipe Cuervo','SALUD','PC de escritorio','HP',162,'N/A','N/A','N/A','N/A'),(50,'Rosana Alegria','SALUD','PC de escritorio','HP',136,'N/A','N/A','N/A','N/A'),(51,'Carlos Enrique Beltran','SALUD','PC de escritorio','Dell',606,'N/A','N/A','N/A','N/A'),(52,'Sandra Munoz','SALUD','PC de escritorio','Dell',717,'N/A','N/A','N/A','N/A'),(53,'Diego Ernesto Bravo','SALUD','PC de escritorio','Lenovo',205,'N/A','N/A','N/A','N/A'),(54,'Laura Camila Ruiz','SALUD','PC de escritorio','HP',921,'N/A','N/A','N/A','N/A'),(55,'Laura Ximena Gasca Suaza ','SALUD','PC de escritorio','Lenovo',733,'N/A','N/A','N/A','N/A'),(56,'Rodolfo Nelson Lopez','ADMINISTRATIVA','PC de escritorio','Lenovo',991,'N/A','N/A','N/A','N/A'),(57,'Juan Camilo','ADMINISTRATIVA','PC de escritorio','HP',125,'N/A','N/A','N/A','N/A'),(58,'Jhon Rivera','ADMINISTRATIVA','PC de escritorio','HP',149,'N/A','N/A','N/A','N/A'),(59,'Yolima Sanchez','ADMINISTRATIVA','PC de escritorio','Dell',879,'N/A','N/A','N/A','N/A'),(60,'Manuel Alfonso Martinez Diaz','PLANEACION','PC de escritorio','Lenovo',779,'N/A','N/A','N/A','N/A'),(61,'Santiago Muñoz','PLANEACION','PC de escritorio','Dell',619,'N/A','N/A','N/A','N/A'),(62,'Lederson Camilo Alvarez','PLANEACION','PC de escritorio','HP',172,'N/A','N/A','N/A','N/A'),(63,'Albeiro Vasquez Chica','Workstation','PC de escritorio','Dell',883,'N/A','N/A','N/A','N/A'),(64,'Albeiro Vasquez Chica','SERVIDOR','PC de escritorio','Dell',884,'N/A','N/A','N/A','N/A'),(65,'Albeiro Vasquez Chica','SERVIDOR','PC de escritorio','Dell',623,'N/A','N/A','N/A','N/A'),(66,'Albeiro Vasquez Chica','SERVIDOR','PC de escritorio','Dell',175,'N/A','N/A','N/A','N/A'),(67,'Albeiro Vasquez Chica','SISTEMAS','PC de escritorio','Dell',885,'N/A','N/A','N/A','N/A'),(68,'Miyer Chavez ','SISTEMAS','PC de escritorio','HP',581,'N/A','N/A','N/A','N/A'),(69,'Albeiro Vasquez Chica','SISTEMAS','PC de escritorio','Lenovo',602,'N/A','N/A','N/A','N/A'),(70,'Antonio Lehman','VIAS','PC de escritorio','HP',127,'N/A','N/A','N/A','N/A'),(71,'Alexander Diaz Diaz','VIAS','PC de escritorio','Lenovo',36,'N/A','N/A','N/A','N/A'),(72,'Jhon Sebastian Navia','VIAS','PC de escritorio','Dell',214,'N/A','N/A','N/A','N/A'),(73,'Paula Andrea Sandoval','VIAS','PC de escritorio','Dell',474,'N/A','N/A','N/A','N/A'),(74,'Diego Armando Meneses','EDUCACIÓN','PC de escritorio','HP',947,'N/A','N/A','N/A','N/A'),(75,'Jose Fernando Gonzalez Lame','EDUCACION','PC de escritorio','Dell',716,'N/A','N/A','N/A','N/A'),(76,'Mauricio Castillo Escobedo','EDUCACIÓN','PC de escritorio','HP',102,'N/A','N/A','N/A','N/A'),(77,'Yeimi Montenegro','ARCHIVO','PC de escritorio','HP',164,'N/A','N/A','N/A','N/A'),(78,'Yesica Alejandra','CONTROL Y EVALUACION INSTITUCIONAL','PC de escritorio','HP',384,'N/A','N/A','N/A','N/A'),(79,'Danny Jurado','CONTROL Y EVALUACION INSTITUCIONAL','PC de escritorio','HP',116,'N/A','N/A','N/A','N/A'),(80,'Daira Rocio','CONTROL Y EVALUACION INSTITUCIONAL','PC de escritorio','Dell',715,'N/A','N/A','N/A','N/A');
/*!40000 ALTER TABLE `equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historialEquipos`
--

DROP TABLE IF EXISTS `historialEquipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historialEquipos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `accion` enum('creado','modificado','eliminado','transferido') NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `datos_anteriores` json DEFAULT NULL,
  `datos_nuevos` json DEFAULT NULL,
  `fecha_accion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `observaciones` text,
  PRIMARY KEY (`id`),
  KEY `equipo_id` (`equipo_id`),
  CONSTRAINT `historialEquipos_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historialEquipos`
--

LOCK TABLES `historialEquipos` WRITE;
/*!40000 ALTER TABLE `historialEquipos` DISABLE KEYS */;
/*!40000 ALTER TABLE `historialEquipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_equipos`
--

DROP TABLE IF EXISTS `historial_equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_equipos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int NOT NULL,
  `codigo_inventario` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_anterior` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_nuevo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area_anterior` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area_nueva` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_cambio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `motivo_cambio` text COLLATE utf8mb4_unicode_ci,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `idx_historial_equipo` (`equipo_id`),
  CONSTRAINT `historial_equipos_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_equipos`
--

LOCK TABLES `historial_equipos` WRITE;
/*!40000 ALTER TABLE `historial_equipos` DISABLE KEYS */;
INSERT INTO `historial_equipos` VALUES (1,31,'842','Sistema','Juan Camilo Poche','Sin asignar','SISTEMAS','2025-12-10 22:22:25','Registro inicial del equipo','Equipo agregado al sistema'),(2,32,'115','Sistema','Manuel Dorado','Sin asignar','APOYO SECRETARIA GENERAL','2025-12-10 22:22:25','Registro inicial del equipo','Equipo agregado al sistema'),(3,33,'707','Sistema','Marcela Zambrano','Sin asignar','SECRETARIA GENERAL','2025-12-10 22:22:25','Registro inicial del equipo','Equipo agregado al sistema'),(4,34,'141','Sistema','Reynaldo Benavides','Sin asignar','ALMACEN','2025-12-10 22:22:25','Registro inicial del equipo','Equipo agregado al sistema'),(5,35,'639','Sistema','Daisy Rivera Chávez','Sin asignar','RECEPCION','2025-12-10 22:22:25','Registro inicial del equipo','Equipo agregado al sistema'),(6,36,'480','Sistema','Sandra Mónica Gaviria','Sin asignar','JURIDICA','2025-12-10 22:22:25','Registro inicial del equipo','Equipo agregado al sistema'),(7,37,'892','Sistema','Luisa Villamarin','Sin asignar','JURIDICA','2025-12-10 22:22:25','Registro inicial del equipo','Equipo agregado al sistema'),(8,38,'158','Sistema','Janeth Salazar','Sin asignar','JURIDICA','2025-12-10 22:22:25','Registro inicial del equipo','Equipo agregado al sistema'),(9,39,'170','Sistema','Ana Cabezas','Sin asignar','JURIDICA','2025-12-10 22:22:25','Registro inicial del equipo','Equipo agregado al sistema'),(16,40,'188','Sistema','Astrid Natalia Trujillo','Sin asignar','DIRECCION GENERAL','2025-12-11 01:18:35','Registro inicial del equipo','Equipo agregado al sistema'),(17,41,'305','Sistema','Yeison Alvarez','Sin asignar','VIVIENDA','2025-12-11 21:20:07','Registro inicial del equipo','Equipo agregado al sistema'),(18,42,'718','Sistema','Lizeth Marcela Rivera','Sin asignar','VIVIENDA','2025-12-11 21:21:01','Registro inicial del equipo','Equipo agregado al sistema'),(19,43,'129','Sistema','Dora Aguilar','Sin asignar','VIVIENDA','2025-12-11 21:21:37','Registro inicial del equipo','Equipo agregado al sistema'),(20,44,'578','Sistema','Juan Manuel Bravo','Sin asignar','VIVIENDA','2025-12-11 21:27:21','Registro inicial del equipo','Equipo agregado al sistema'),(21,45,'541','Sistema','Diana','Sin asignar','VIVIENDA','2025-12-11 21:28:46','Registro inicial del equipo','Equipo agregado al sistema'),(22,45,'541','Diana','Jesús Andrés Vivas','VIVIENDA','VIVIENDA','2025-12-11 21:29:17','Actualización de equipo',NULL),(23,46,'275','Sistema','Adrián Charo','Sin asignar','VIVIENDA','2025-12-11 21:34:47','Registro inicial del equipo','Equipo agregado al sistema'),(24,47,'790','Sistema','Jairo Alonso Embus','Sin asignar','VIVIENDA','2025-12-11 21:35:36','Registro inicial del equipo','Equipo agregado al sistema'),(25,48,'900','Sistema','Jhon Jairo Hoyos','Sin asignar','VIVIENDA','2025-12-11 21:36:15','Registro inicial del equipo','Equipo agregado al sistema'),(26,49,'162','Sistema','Diego Felipe Cuervo','Sin asignar','SALUD','2025-12-11 21:37:08','Registro inicial del equipo','Equipo agregado al sistema'),(27,50,'136','Sistema','Rosana Alegria','Sin asignar','SALUD','2025-12-11 21:37:58','Registro inicial del equipo','Equipo agregado al sistema'),(28,51,'606','Sistema','Carlos Enrique Beltran','Sin asignar','SALUD','2025-12-11 21:38:56','Registro inicial del equipo','Equipo agregado al sistema'),(29,52,'717','Sistema','Sandra Munoz','Sin asignar','SALUD','2025-12-11 21:39:26','Registro inicial del equipo','Equipo agregado al sistema'),(30,53,'205','Sistema','Diego Ernesto Bravo','Sin asignar','SALUD','2025-12-11 21:40:54','Registro inicial del equipo','Equipo agregado al sistema'),(31,54,'921','Sistema','Laura Camila Ruiz','Sin asignar','SALUD','2025-12-11 21:41:19','Registro inicial del equipo','Equipo agregado al sistema'),(32,55,'733','Sistema','Laura Ximena Gasca Suaza ','Sin asignar','SALUD','2025-12-11 21:41:48','Registro inicial del equipo','Equipo agregado al sistema'),(33,56,'991','Sistema','Rodolfo Nelson Lopez','Sin asignar','ADMINISTRATIVA','2025-12-11 21:42:17','Registro inicial del equipo','Equipo agregado al sistema'),(34,57,'125','Sistema','Juan Camilo','Sin asignar','ADMINISTRATIVA','2025-12-11 21:42:34','Registro inicial del equipo','Equipo agregado al sistema'),(35,58,'149','Sistema','Jhon Rivera','Sin asignar','ADMINISTRATIVA','2025-12-11 21:42:59','Registro inicial del equipo','Equipo agregado al sistema'),(36,59,'879','Sistema','Yolima Sanchez','Sin asignar','ADMINISTRATIVA','2025-12-11 21:43:32','Registro inicial del equipo','Equipo agregado al sistema'),(37,60,'779','Sistema','Manuel Alfonso Martinez Diaz','Sin asignar','PLANEACION','2025-12-11 21:44:05','Registro inicial del equipo','Equipo agregado al sistema'),(38,61,'619','Sistema','Santiago Muñoz','Sin asignar','PLANEACION','2025-12-11 21:44:25','Registro inicial del equipo','Equipo agregado al sistema'),(39,62,'172','Sistema','Lederson Camilo Alvarez','Sin asignar','PLANEACION','2025-12-11 21:44:55','Registro inicial del equipo','Equipo agregado al sistema'),(40,63,'883','Sistema','Albeiro Vasquez Chica','Sin asignar','Workstation','2025-12-11 22:44:57','Registro inicial del equipo','Equipo agregado al sistema'),(41,64,'884','Sistema','Albeiro Vasquez Chica','Sin asignar','SERVIDOR','2025-12-11 22:45:22','Registro inicial del equipo','Equipo agregado al sistema'),(42,65,'623','Sistema','Albeiro Vasquez Chica','Sin asignar','SERVIDOR','2025-12-11 22:45:45','Registro inicial del equipo','Equipo agregado al sistema'),(43,66,'175','Sistema','Albeiro Vasquez Chica','Sin asignar','SERVIDOR','2025-12-11 22:46:40','Registro inicial del equipo','Equipo agregado al sistema'),(44,67,'885','Sistema','Albeiro Vasquez Chica','Sin asignar','SISTEMAS','2025-12-11 22:47:35','Registro inicial del equipo','Equipo agregado al sistema'),(45,68,'581','Sistema','Miyer Chavez ','Sin asignar','SISTEMAS','2025-12-11 22:47:53','Registro inicial del equipo','Equipo agregado al sistema'),(46,69,'602','Sistema','Albeiro Vasquez Chica','Sin asignar','SISTEMAS','2025-12-11 22:48:20','Registro inicial del equipo','Equipo agregado al sistema'),(47,70,'127','Sistema','Antonio Lehman','Sin asignar','VIAS','2025-12-11 22:49:07','Registro inicial del equipo','Equipo agregado al sistema'),(48,71,'036','Sistema','Alexander Diaz Diaz','Sin asignar','VIAS','2025-12-11 22:50:06','Registro inicial del equipo','Equipo agregado al sistema'),(49,72,'214','Sistema','Jhon Sebastian Navia','Sin asignar','VIAS','2025-12-11 22:50:34','Registro inicial del equipo','Equipo agregado al sistema'),(50,73,'474','Sistema','Paula Andrea Sandoval','Sin asignar','VIAS','2025-12-11 22:50:56','Registro inicial del equipo','Equipo agregado al sistema'),(51,74,'947','Sistema','Diego Armando Meneses','Sin asignar','EDUCACIÓN','2025-12-11 22:51:44','Registro inicial del equipo','Equipo agregado al sistema'),(52,75,'716','Sistema','Jose Fernando Gonzalez Lame','Sin asignar','EDUCACION','2025-12-16 19:50:31','Registro inicial del equipo','Equipo agregado al sistema'),(53,76,'102','Sistema','Mauricio Castillo Escobedo','Sin asignar','EDUCACIÓN','2025-12-16 19:52:35','Registro inicial del equipo','Equipo agregado al sistema'),(54,77,'164','Sistema','Yeimi Montenegro','Sin asignar','ARCHIVO','2025-12-16 19:53:38','Registro inicial del equipo','Equipo agregado al sistema'),(55,78,'384','Sistema','Yesica Alejandra','Sin asignar','CONTROL Y EVALUACION INSTITUCIONAL','2025-12-16 19:55:41','Registro inicial del equipo','Equipo agregado al sistema'),(56,79,'116','Sistema','Danny Jurado','Sin asignar','CONTROL Y EVALUACION INSTITUCIONAL','2025-12-16 19:56:00','Registro inicial del equipo','Equipo agregado al sistema'),(57,80,'715','Sistema','Daira Rocio','Sin asignar','CONTROL Y EVALUACION INSTITUCIONAL','2025-12-16 19:56:23','Registro inicial del equipo','Equipo agregado al sistema'),(59,33,'707','Marcela Zambrano','Aidee ','SECRETARIA GENERAL','APOYO SECRETARIA GENERAL','2026-03-21 22:02:40','Actualización de equipo',NULL),(60,33,'707','Aidee ','Aidee Omaira Chacon Agredo','APOYO SECRETARIA GENERAL','APOYO SECRETARIA GENERAL','2026-03-21 22:04:18','Actualización de equipo',NULL);
/*!40000 ALTER TABLE `historial_equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `impresoras`
--

DROP TABLE IF EXISTS `impresoras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `impresoras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `area` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `modelo` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion_IP` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `novedad` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `impresoras`
--

LOCK TABLES `impresoras` WRITE;
/*!40000 ALTER TABLE `impresoras` DISABLE KEYS */;
INSERT INTO `impresoras` VALUES (6,'Informática','12312414','121142','');
/*!40000 ALTER TABLE `impresoras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licenciamiento`
--

DROP TABLE IF EXISTS `licenciamiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licenciamiento` (
  `id` int NOT NULL,
  `usuario` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `area` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci NOT NULL,
  `sistema_operativo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `software_de_oficina` text COLLATE utf8mb4_general_ci NOT NULL,
  `otro_software` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licenciamiento`
--

LOCK TABLES `licenciamiento` WRITE;
/*!40000 ALTER TABLE `licenciamiento` DISABLE KEYS */;
INSERT INTO `licenciamiento` VALUES (115,'Manuel Dorado','APOYO SECRETARIA GENERAL','PC de escritorio','','win10','office','photoshop');
/*!40000 ALTER TABLE `licenciamiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mantenimiento`
--

DROP TABLE IF EXISTS `mantenimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mantenimiento` (
  `id` int NOT NULL,
  `equipo_id` int DEFAULT NULL,
  `usuario` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `area` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_ultimo_mantenimiento` date NOT NULL,
  `fecha_actual_de_mantenimiento` date NOT NULL,
  `firmas_tecnico` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `firmas_aprobo` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `firmas_reviso` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `marca` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `actividades_realizadas` text COLLATE utf8mb4_general_ci NOT NULL,
  `observaciones` text COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_de_elaboracion` date NOT NULL,
  `fecha_de_ejecucion` int NOT NULL,
  `codigo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `idx_mantenimiento_equipo` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mantenimiento`
--

LOCK TABLES `mantenimiento` WRITE;
/*!40000 ALTER TABLE `mantenimiento` DISABLE KEYS */;
INSERT INTO `mantenimiento` VALUES (639,NULL,'Daisy Rivera Chávez','RECEPCION','PC de escritorio','2025-12-14','2025-12-31','Sin firma','Sin firma','Sin firma','HP','z<v<','fsaddfstgad','2025-12-19',1766188800,'639','En ejecución');
/*!40000 ALTER TABLE `mantenimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recordatorios`
--

DROP TABLE IF EXISTS `recordatorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recordatorios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date` datetime NOT NULL,
  `realizado` tinyint NOT NULL,
  `notas` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recordatorios`
--

LOCK TABLES `recordatorios` WRITE;
/*!40000 ALTER TABLE `recordatorios` DISABLE KEYS */;
INSERT INTO `recordatorios` VALUES (7,'auditoria','2025-10-30 23:18:00',1,NULL),(8,'Recordatorio prueba','2025-12-06 10:00:00',1,NULL);
/*!40000 ALTER TABLE `recordatorios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suscripciones_push`
--

DROP TABLE IF EXISTS `suscripciones_push`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suscripciones_push` (
  `id` int NOT NULL AUTO_INCREMENT,
  `endpoint` text COLLATE utf8mb4_general_ci NOT NULL,
  `p256dh` text COLLATE utf8mb4_general_ci NOT NULL,
  `auth` text COLLATE utf8mb4_general_ci NOT NULL,
  `usuario` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suscripciones_push`
--

LOCK TABLES `suscripciones_push` WRITE;
/*!40000 ALTER TABLE `suscripciones_push` DISABLE KEYS */;
INSERT INTO `suscripciones_push` VALUES (1,'https://fcm.googleapis.com/fcm/send/f1absxol2cg:APA91bF9Z1cX_NRw4hvq7HduelogijaG0mFLGxxrCZyqgUclHCkGKK-s_BWERe8GyCvgR3noxHFBuU-Sc-_mPy4BTXd_3AOitPDBtfx_PHDq1H8uy56-tv4S-m3hCOuC5MOGDqm3pc-z','BIrbimgFJSZ_-q7iCaiL9mYD9E4IRP_et37o62zrtBzXgnJl8ixnIc0epB1VBg1yqb4SGqmTSxlp9FRXkwfXPgE','R2fLechpsejZyVZDhohwlQ','juanPoche','2025-11-20 20:08:21');
/*!40000 ALTER TABLE `suscripciones_push` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `activo` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador','user','admin@example.com',1),(23,'admin','','avasquez@nasakiwe.gov.co',0),(28,'juan camilo poche','user','juanvalencia191410@gmail.com',1),(32,'xxx','user','alvasy2k@gmail.com',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-30  3:31:14
