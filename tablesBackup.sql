-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: skillspacedb
-- ------------------------------------------------------
-- Server version	8.0.23

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
-- Table structure for table `abonnement`
--

DROP TABLE IF EXISTS `abonnement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `abonnement` (
  `apprenant_idapprenant` int NOT NULL,
  `apprenant_user_id` int NOT NULL,
  `formateur_idformateur` int NOT NULL,
  `formateur_user_id` int NOT NULL,
  `added_in` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`apprenant_idapprenant`,`apprenant_user_id`,`formateur_idformateur`,`formateur_user_id`),
  KEY `fk_apprenant_has_formateur_formateur1_idx` (`formateur_idformateur`,`formateur_user_id`),
  KEY `fk_apprenant_has_formateur_apprenant1_idx` (`apprenant_idapprenant`,`apprenant_user_id`),
  CONSTRAINT `fk_apprenant_has_formateur_apprenant1` FOREIGN KEY (`apprenant_idapprenant`) REFERENCES `apprenant` (`idapprenant`),
  CONSTRAINT `fk_apprenant_has_formateur_formateur1` FOREIGN KEY (`formateur_idformateur`) REFERENCES `formateur` (`idformateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `abonnement`
--

LOCK TABLES `abonnement` WRITE;
/*!40000 ALTER TABLE `abonnement` DISABLE KEYS */;
/*!40000 ALTER TABLE `abonnement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `idadmin` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `isActive` tinyint DEFAULT NULL,
  PRIMARY KEY (`idadmin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apprenant`
--

DROP TABLE IF EXISTS `apprenant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apprenant` (
  `idapprenant` int NOT NULL AUTO_INCREMENT,
  `job` varchar(200) DEFAULT NULL,
  `utilisateur_idutilisateur` int NOT NULL,
  PRIMARY KEY (`idapprenant`,`utilisateur_idutilisateur`),
  KEY `fk_apprenant_utilisateur1_idx` (`utilisateur_idutilisateur`),
  CONSTRAINT `fk_apprenant_utilisateur1` FOREIGN KEY (`utilisateur_idutilisateur`) REFERENCES `utilisateur` (`idutilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apprenant`
--

LOCK TABLES `apprenant` WRITE;
/*!40000 ALTER TABLE `apprenant` DISABLE KEYS */;
/*!40000 ALTER TABLE `apprenant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attestation`
--

DROP TABLE IF EXISTS `attestation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attestation` (
  `idcertification` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `content` varchar(200) DEFAULT NULL,
  `formation_idFormation` int NOT NULL,
  PRIMARY KEY (`idcertification`),
  KEY `fk_attestation_formation1_idx` (`formation_idFormation`),
  CONSTRAINT `fk_attestation_formation1` FOREIGN KEY (`formation_idFormation`) REFERENCES `formation` (`idFormation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attestation`
--

LOCK TABLES `attestation` WRITE;
/*!40000 ALTER TABLE `attestation` DISABLE KEYS */;
/*!40000 ALTER TABLE `attestation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avis`
--

DROP TABLE IF EXISTS `avis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avis` (
  `idavis` int NOT NULL AUTO_INCREMENT,
  `avis` longtext,
  `added_in` timestamp NULL DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `formation_idFormation` int NOT NULL,
  `utilisateur_idutilisateur` int NOT NULL,
  PRIMARY KEY (`idavis`),
  KEY `fk_avis_formation1_idx` (`formation_idFormation`),
  KEY `fk_avis_utilisateur1_idx` (`utilisateur_idutilisateur`),
  CONSTRAINT `fk_avis_formation1` FOREIGN KEY (`formation_idFormation`) REFERENCES `formation` (`idFormation`),
  CONSTRAINT `fk_avis_utilisateur1` FOREIGN KEY (`utilisateur_idutilisateur`) REFERENCES `utilisateur` (`idutilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avis`
--

LOCK TABLES `avis` WRITE;
/*!40000 ALTER TABLE `avis` DISABLE KEYS */;
/*!40000 ALTER TABLE `avis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidature`
--

DROP TABLE IF EXISTS `candidature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidature` (
  `idcandidature` int NOT NULL AUTO_INCREMENT,
  `added_in` timestamp NULL DEFAULT NULL,
  `specialite` varchar(200) DEFAULT NULL,
  `apprenant_idapprenant` int NOT NULL,
  `apprenant_utilisateur_idutilisateur` int NOT NULL,
  PRIMARY KEY (`idcandidature`),
  KEY `fk_candidature_apprenant1_idx` (`apprenant_idapprenant`,`apprenant_utilisateur_idutilisateur`),
  CONSTRAINT `fk_candidature_apprenant1` FOREIGN KEY (`apprenant_idapprenant`, `apprenant_utilisateur_idutilisateur`) REFERENCES `apprenant` (`idapprenant`, `utilisateur_idutilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidature`
--

LOCK TABLES `candidature` WRITE;
/*!40000 ALTER TABLE `candidature` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidature` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `code`
--

DROP TABLE IF EXISTS `code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `code` (
  `idcode` int NOT NULL AUTO_INCREMENT,
  `code` varchar(200) DEFAULT NULL,
  `utilisateur_idutilisateur` int NOT NULL,
  PRIMARY KEY (`idcode`),
  KEY `fk_code_utilisateur1_idx` (`utilisateur_idutilisateur`),
  CONSTRAINT `fk_code_utilisateur1` FOREIGN KEY (`utilisateur_idutilisateur`) REFERENCES `utilisateur` (`idutilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code`
--

LOCK TABLES `code` WRITE;
/*!40000 ALTER TABLE `code` DISABLE KEYS */;
/*!40000 ALTER TABLE `code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contenu`
--

DROP TABLE IF EXISTS `contenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contenu` (
  `idcontent` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `added_in` timestamp NULL DEFAULT NULL,
  `file_name` varchar(200) DEFAULT NULL,
  `isVerified` tinyint DEFAULT NULL,
  `formation_idcours` int NOT NULL,
  PRIMARY KEY (`idcontent`),
  KEY `fk_contenu_formation1_idx` (`formation_idcours`),
  CONSTRAINT `fk_contenu_formation1` FOREIGN KEY (`formation_idcours`) REFERENCES `formation` (`idFormation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contenu`
--

LOCK TABLES `contenu` WRITE;
/*!40000 ALTER TABLE `contenu` DISABLE KEYS */;
/*!40000 ALTER TABLE `contenu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `demande`
--

DROP TABLE IF EXISTS `demande`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demande` (
  `iddemande` int NOT NULL AUTO_INCREMENT,
  `added_in` timestamp NULL DEFAULT NULL,
  `type` enum('MODIFICATION','SUPPRESSION','CREATION','REDUCTION') DEFAULT NULL,
  `isAccepted` tinyint DEFAULT NULL,
  `formateur_idformateur` int NOT NULL,
  `formateur_user_id` int NOT NULL,
  `admin_idadmin` int NOT NULL,
  PRIMARY KEY (`iddemande`),
  KEY `fk_demande_formateur1_idx` (`formateur_idformateur`,`formateur_user_id`),
  KEY `fk_demande_admin1_idx` (`admin_idadmin`),
  CONSTRAINT `fk_demande_admin1` FOREIGN KEY (`admin_idadmin`) REFERENCES `admin` (`idadmin`),
  CONSTRAINT `fk_demande_formateur1` FOREIGN KEY (`formateur_idformateur`) REFERENCES `formateur` (`idformateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demande`
--

LOCK TABLES `demande` WRITE;
/*!40000 ALTER TABLE `demande` DISABLE KEYS */;
/*!40000 ALTER TABLE `demande` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examen`
--

DROP TABLE IF EXISTS `examen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examen` (
  `idexamen` int NOT NULL AUTO_INCREMENT,
  `added_in` timestamp NULL DEFAULT NULL,
  `mark` float DEFAULT NULL,
  `total_point` float DEFAULT NULL,
  `formation_idFormation` int NOT NULL,
  PRIMARY KEY (`idexamen`),
  KEY `fk_examen_formation1_idx` (`formation_idFormation`),
  CONSTRAINT `fk_examen_formation1` FOREIGN KEY (`formation_idFormation`) REFERENCES `formation` (`idFormation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examen`
--

LOCK TABLES `examen` WRITE;
/*!40000 ALTER TABLE `examen` DISABLE KEYS */;
/*!40000 ALTER TABLE `examen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formateur`
--

DROP TABLE IF EXISTS `formateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formateur` (
  `idformateur` int NOT NULL AUTO_INCREMENT,
  `rate` int DEFAULT NULL,
  `bio` longtext,
  `linkedin_link` varchar(200) DEFAULT NULL,
  `youtube_link` varchar(200) DEFAULT NULL,
  `github_link` varchar(200) DEFAULT NULL,
  `utilisateur_idutilisateur` int NOT NULL,
  PRIMARY KEY (`idformateur`,`utilisateur_idutilisateur`),
  KEY `fk_formateur_utilisateur1_idx` (`utilisateur_idutilisateur`),
  CONSTRAINT `fk_formateur_utilisateur1` FOREIGN KEY (`utilisateur_idutilisateur`) REFERENCES `utilisateur` (`idutilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formateur`
--

LOCK TABLES `formateur` WRITE;
/*!40000 ALTER TABLE `formateur` DISABLE KEYS */;
/*!40000 ALTER TABLE `formateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formation`
--

DROP TABLE IF EXISTS `formation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formation` (
  `idFormation` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `old_price` decimal(10,0) DEFAULT NULL,
  `level` enum('BEGINNER','INTERMEDIATE','ADVANCED') DEFAULT NULL,
  `language` enum('FRENCH','ENGLISH','ARABIC') DEFAULT NULL,
  `formateur_idformateur` int NOT NULL,
  `isVisitor` tinyint DEFAULT '0',
  `isBanner` tinyint DEFAULT '0',
  `isTrend` tinyint DEFAULT '0',
  `isPopular` tinyint DEFAULT '0',
  PRIMARY KEY (`idFormation`),
  KEY `fk_cours_formateur1_idx` (`formateur_idformateur`),
  CONSTRAINT `fk_cours_formateur1` FOREIGN KEY (`formateur_idformateur`) REFERENCES `formateur` (`idformateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formation`
--

LOCK TABLES `formation` WRITE;
/*!40000 ALTER TABLE `formation` DISABLE KEYS */;
/*!40000 ALTER TABLE `formation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interaction`
--

DROP TABLE IF EXISTS `interaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interaction` (
  `utilisateur_id` int NOT NULL,
  `added_in` timestamp NOT NULL,
  `type` enum('PARTICIPATION','FAVORIS') DEFAULT NULL,
  `utilisateur_idutilisateur` int NOT NULL,
  `formation_idFormation` int NOT NULL,
  PRIMARY KEY (`utilisateur_id`,`added_in`),
  KEY `fk_interaction_utilisateur1_idx` (`utilisateur_idutilisateur`),
  KEY `fk_interaction_formation1_idx` (`formation_idFormation`),
  CONSTRAINT `fk_interaction_formation1` FOREIGN KEY (`formation_idFormation`) REFERENCES `formation` (`idFormation`),
  CONSTRAINT `fk_interaction_utilisateur1` FOREIGN KEY (`utilisateur_idutilisateur`) REFERENCES `utilisateur` (`idutilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interaction`
--

LOCK TABLES `interaction` WRITE;
/*!40000 ALTER TABLE `interaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `interaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitationtest`
--

DROP TABLE IF EXISTS `invitationtest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invitationtest` (
  `idinvitationTest` int NOT NULL AUTO_INCREMENT,
  `added_in` timestamp NULL DEFAULT NULL,
  `test_date` timestamp NULL DEFAULT NULL,
  `mark` decimal(10,0) DEFAULT NULL,
  `isAccepted` tinyint DEFAULT NULL,
  `admin_idadmin` int NOT NULL,
  `candidature_idcandidature` int NOT NULL,
  PRIMARY KEY (`idinvitationTest`),
  KEY `fk_invitationTest_admin1_idx` (`admin_idadmin`),
  KEY `fk_invitationTest_candidature1_idx` (`candidature_idcandidature`),
  CONSTRAINT `fk_invitationTest_admin1` FOREIGN KEY (`admin_idadmin`) REFERENCES `admin` (`idadmin`),
  CONSTRAINT `fk_invitationTest_candidature1` FOREIGN KEY (`candidature_idcandidature`) REFERENCES `candidature` (`idcandidature`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitationtest`
--

LOCK TABLES `invitationtest` WRITE;
/*!40000 ALTER TABLE `invitationtest` DISABLE KEYS */;
/*!40000 ALTER TABLE `invitationtest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `idquestion` int NOT NULL AUTO_INCREMENT,
  `added_in` timestamp NULL DEFAULT NULL,
  `content` longtext,
  `formation_idcours` int NOT NULL,
  `utilisateur_idutilisateur` int NOT NULL,
  PRIMARY KEY (`idquestion`),
  KEY `fk_question_formation1_idx` (`formation_idcours`),
  KEY `fk_question_utilisateur1_idx` (`utilisateur_idutilisateur`),
  CONSTRAINT `fk_question_formation1` FOREIGN KEY (`formation_idcours`) REFERENCES `formation` (`idFormation`),
  CONSTRAINT `fk_question_utilisateur1` FOREIGN KEY (`utilisateur_idutilisateur`) REFERENCES `utilisateur` (`idutilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionexam`
--

DROP TABLE IF EXISTS `questionexam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionexam` (
  `idquestionExamen` int NOT NULL AUTO_INCREMENT,
  `question` longtext,
  `point` float DEFAULT NULL,
  `examen_idexamen` int NOT NULL,
  PRIMARY KEY (`idquestionExamen`),
  KEY `fk_questionExam_examen1_idx` (`examen_idexamen`),
  CONSTRAINT `fk_questionExam_examen1` FOREIGN KEY (`examen_idexamen`) REFERENCES `examen` (`idexamen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionexam`
--

LOCK TABLES `questionexam` WRITE;
/*!40000 ALTER TABLE `questionexam` DISABLE KEYS */;
/*!40000 ALTER TABLE `questionexam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reponse`
--

DROP TABLE IF EXISTS `reponse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reponse` (
  `idreponse` int NOT NULL AUTO_INCREMENT,
  `content` longtext,
  `added_in` timestamp NULL DEFAULT NULL,
  `question_idquestion` int NOT NULL,
  `utilisateur_idutilisateur` int NOT NULL,
  PRIMARY KEY (`idreponse`),
  KEY `fk_reponse_question2_idx` (`question_idquestion`),
  KEY `fk_reponse_utilisateur1_idx` (`utilisateur_idutilisateur`),
  CONSTRAINT `fk_reponse_question2` FOREIGN KEY (`question_idquestion`) REFERENCES `question` (`idquestion`),
  CONSTRAINT `fk_reponse_utilisateur1` FOREIGN KEY (`utilisateur_idutilisateur`) REFERENCES `utilisateur` (`idutilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reponse`
--

LOCK TABLES `reponse` WRITE;
/*!40000 ALTER TABLE `reponse` DISABLE KEYS */;
/*!40000 ALTER TABLE `reponse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reponseexam`
--

DROP TABLE IF EXISTS `reponseexam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reponseexam` (
  `idreponseExam` int NOT NULL AUTO_INCREMENT,
  `reponse` longtext,
  `isCorrect` tinyint DEFAULT NULL,
  `questionExam_idquestionExamen` int NOT NULL,
  PRIMARY KEY (`idreponseExam`),
  KEY `fk_reponseExam_questionExam1_idx` (`questionExam_idquestionExamen`),
  CONSTRAINT `fk_reponseExam_questionExam1` FOREIGN KEY (`questionExam_idquestionExamen`) REFERENCES `questionexam` (`idquestionExamen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reponseexam`
--

LOCK TABLES `reponseexam` WRITE;
/*!40000 ALTER TABLE `reponseexam` DISABLE KEYS */;
/*!40000 ALTER TABLE `reponseexam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialite`
--

DROP TABLE IF EXISTS `specialite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialite` (
  `idspecialite` int NOT NULL AUTO_INCREMENT,
  `specialite` varchar(45) DEFAULT NULL,
  `formateur_idformateur` int NOT NULL,
  `formateur_user_id` int NOT NULL,
  PRIMARY KEY (`idspecialite`),
  KEY `fk_specialite_formateur1_idx` (`formateur_idformateur`,`formateur_user_id`),
  CONSTRAINT `fk_specialite_formateur1` FOREIGN KEY (`formateur_idformateur`) REFERENCES `formateur` (`idformateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialite`
--

LOCK TABLES `specialite` WRITE;
/*!40000 ALTER TABLE `specialite` DISABLE KEYS */;
/*!40000 ALTER TABLE `specialite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `idutilisateur` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `isVerified` tinyint DEFAULT '0',
  `firstname` varchar(200) DEFAULT NULL,
  `lastname` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`idutilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-17  0:53:42
