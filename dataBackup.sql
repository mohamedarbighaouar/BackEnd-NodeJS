-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: skillspacedb
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Dumping data for table `abonnement`
--

LOCK TABLES `abonnement` WRITE;
/*!40000 ALTER TABLE `abonnement` DISABLE KEYS */;
/*!40000 ALTER TABLE `abonnement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `apprenant`
--

LOCK TABLES `apprenant` WRITE;
/*!40000 ALTER TABLE `apprenant` DISABLE KEYS */;
INSERT INTO `apprenant` VALUES (3,'engineer',9),(4,'falah',10),(5,'engineer',11),(6,'engineer',12),(7,'engineer',13);
/*!40000 ALTER TABLE `apprenant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `attestation`
--

LOCK TABLES `attestation` WRITE;
/*!40000 ALTER TABLE `attestation` DISABLE KEYS */;
/*!40000 ALTER TABLE `attestation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `avis`
--

LOCK TABLES `avis` WRITE;
/*!40000 ALTER TABLE `avis` DISABLE KEYS */;
INSERT INTO `avis` VALUES (151,'Hello UPDATE OK OK',NULL,4,48,10);
/*!40000 ALTER TABLE `avis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `candidature`
--

LOCK TABLES `candidature` WRITE;
/*!40000 ALTER TABLE `candidature` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidature` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `categorie`
--

LOCK TABLES `categorie` WRITE;
/*!40000 ALTER TABLE `categorie` DISABLE KEYS */;
INSERT INTO `categorie` VALUES (9,'Développement Web'),(10,'Science des données'),(11,'Développement mobile'),(12,'Gestion'),(13,'Stratégie des affaires'),(14,'Economie'),(15,'Relations publiques');
/*!40000 ALTER TABLE `categorie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `code`
--

LOCK TABLES `code` WRITE;
/*!40000 ALTER TABLE `code` DISABLE KEYS */;
INSERT INTO `code` VALUES (2,'021f4ae5-430c-4ce1-9cca-1494a8efd6ef',10),(3,'2925ff4b-d596-468d-b519-48e243b92e55',11),(4,'d02693f7-c7a0-40a6-aaa6-f5957dc95858',12),(5,'6b7cfa3f-a236-4940-a6da-45b0fcf634c2',13),(30,'PECFPnUIVh',9),(31,'RVUP3cT5xZ',9);
/*!40000 ALTER TABLE `code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `contenu`
--

LOCK TABLES `contenu` WRITE;
/*!40000 ALTER TABLE `contenu` DISABLE KEYS */;
INSERT INTO `contenu` VALUES (35,'Premiere video',NULL,NULL,11,48,'1625391324622.mp4','1625391324622.jpg','In this course we will learn many things , Introduction to  the fastest way to get smarter at math'),(36,'Deuxieme video',NULL,NULL,11,48,'1625391324480.mp4','1625391324480.jpg','In this course we will learn many things , Introduction to  the fastest way to get smarter at math'),(37,'Troisieme video',NULL,NULL,11,48,'1625391324613.mp4','1625391324614.jpg','In this course we will learn many things , Introduction to  the fastest way to get smarter at math');
/*!40000 ALTER TABLE `contenu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `contenu_hist`
--

LOCK TABLES `contenu_hist` WRITE;
/*!40000 ALTER TABLE `contenu_hist` DISABLE KEYS */;
INSERT INTO `contenu_hist` VALUES (320,10,36,6,48);
/*!40000 ALTER TABLE `contenu_hist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `demande`
--

LOCK TABLES `demande` WRITE;
/*!40000 ALTER TABLE `demande` DISABLE KEYS */;
/*!40000 ALTER TABLE `demande` ENABLE KEYS */;
UNLOCK TABLES;

--

--
-- Dumping data for table `formateur`
--

LOCK TABLES `formateur` WRITE;
/*!40000 ALTER TABLE `formateur` DISABLE KEYS */;
INSERT INTO `formateur` VALUES (1,4,'Mala halla',NULL,NULL,NULL,9);
/*!40000 ALTER TABLE `formateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `formateur_has_specialite`
--

LOCK TABLES `formateur_has_specialite` WRITE;
/*!40000 ALTER TABLE `formateur_has_specialite` DISABLE KEYS */;
/*!40000 ALTER TABLE `formateur_has_specialite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `formation`
--

LOCK TABLES `formation` WRITE;
/*!40000 ALTER TABLE `formation` DISABLE KEYS */;
INSERT INTO `formation` VALUES (48,'Apprendre Javascript: Cours Javascript Complet',25,NULL,'BEGINNER','FRENCH','1624292033100.mp4','1624292033100.png',0,1,1,1,'Un cours javascript, facile à digérer, plein d\'exemples réels et de démonstrations étape par étape.',1),(49,'Développeur Python | Formation Complète 2021',42,NULL,'BEGINNER','FRENCH','1624292604570.mp4','1624292604570.jpg',0,1,1,1,'Apprenez la programmation en partant de zéro et créez des projets puissants avec Python : Web, Mobile, Jeux, Desktop',1),(50,'Apprendre Angular par la création d\'un site e-commerce 2021',63,NULL,'BEGINNER','FRENCH','1624292729413.mp4','1624292729413.jpg',0,1,1,1,'De nombreux projets professionnels pour apprendre, approfondir et devenir un expert incontournable du framework Angular',1);
/*!40000 ALTER TABLE `formation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `formation_has_categorie`
--

LOCK TABLES `formation_has_categorie` WRITE;
/*!40000 ALTER TABLE `formation_has_categorie` DISABLE KEYS */;
/*!40000 ALTER TABLE `formation_has_categorie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `interaction`
--

LOCK TABLES `interaction` WRITE;
/*!40000 ALTER TABLE `interaction` DISABLE KEYS */;
INSERT INTO `interaction` VALUES (122,NULL,'FAVORIS',10,48),(123,NULL,'FAVORIS',10,49);
/*!40000 ALTER TABLE `interaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `invitationtest`
--

LOCK TABLES `invitationtest` WRITE;
/*!40000 ALTER TABLE `invitationtest` DISABLE KEYS */;
/*!40000 ALTER TABLE `invitationtest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `like_question`
--

LOCK TABLES `like_question` WRITE;
/*!40000 ALTER TABLE `like_question` DISABLE KEYS */;
INSERT INTO `like_question` VALUES (116,11,10),(118,10,10),(119,21,10);
/*!40000 ALTER TABLE `like_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `like_reponse`
--

LOCK TABLES `like_reponse` WRITE;
/*!40000 ALTER TABLE `like_reponse` DISABLE KEYS */;
INSERT INTO `like_reponse` VALUES (10,10,10),(11,5,10);
/*!40000 ALTER TABLE `like_reponse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (10,NULL,'I request you to create a section about a complete character animation proje… like walking, running, jumping kicking I request you to create a section about a complete character animation proje… like walking, running, jumping kicking I request you to create a section about a complete character animation proje… like walking, running, jumping kicking I request you to create a section about a complete character animation proje… like walking, running, jumping kicking etc',48,10),(11,NULL,'hello from hell',48,11),(12,NULL,'hi from heaven',48,12),(21,'2021-06-28 15:23:39','aaaaa',48,10),(22,'2021-06-29 10:53:16','zineb',48,13);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Dumping data for table `reponse`
--

LOCK TABLES `reponse` WRITE;
/*!40000 ALTER TABLE `reponse` DISABLE KEYS */;
INSERT INTO `reponse` VALUES (1,'J\'ai rien compris',NULL,10,12),(5,'aaaaaaaaa','2021-06-28 15:14:33',10,10),(7,'hahaha','2021-06-28 15:14:33',10,12),(9,'hello its me','2021-06-29 08:54:43',10,10),(10,'Hi bro !! ','2021-06-29 14:40:06',12,10);
/*!40000 ALTER TABLE `reponse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `specialite`
--

LOCK TABLES `specialite` WRITE;
/*!40000 ALTER TABLE `specialite` DISABLE KEYS */;
/*!40000 ALTER TABLE `specialite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (9,'tahachaouch@gmail.com','$2a$10$slAExsvDULPCAPsm5oRA/OyUYycHqvU577IJrKRNWzDypKOzsFkly',0,'chaouch','taha','1624974702052.jpg'),(10,'badiss@gmail.com','$2a$10$eRQ66KddOgCtGPGpH3Wqb.b/WbxjH7moEBsh52LN8NGb4caWVUzn6',0,'Badiaaa','Jdidia','1625701883472.jpeg'),(11,'malekmimi@gmail.com','$2a$10$UegMc4VkRDieUuV9ak48XOg4z3mk8leQMXw8OQe.oLO3bUIn6NLxq',0,'mimi','malek','416516.PNG'),(12,'nidhalamdouni@gmail.com','$2a$10$oEKTKDwPtK4B.K9iOnSnN.xws//lO8Q.DI4eBfum25B1WFNcvzHhi',0,'amdouni','nidhal','a.PNG'),(13,'koussaybenmhanna@gmail.com','$2a$10$8FyMXiuVKdLaveB4DmlOr.fK9QDyXcdJHyQRVr50gqyC.g92Is3hy',0,'koussay','benmhanna','dhsbksdjn.jpg');
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `utilisateur_has_categorie`
--

LOCK TABLES `utilisateur_has_categorie` WRITE;
/*!40000 ALTER TABLE `utilisateur_has_categorie` DISABLE KEYS */;
INSERT INTO `utilisateur_has_categorie` VALUES (9,9),(10,9),(12,9),(10,10),(9,11),(9,13),(10,13),(12,13),(12,14),(12,15);
/*!40000 ALTER TABLE `utilisateur_has_categorie` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-15 11:25:34
