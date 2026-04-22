-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 22 avr. 2026 à 14:01
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `reclamations_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `reclamations`
--

CREATE TABLE `reclamations` (
  `id` bigint(20) NOT NULL,
  `date_creation` datetime(6) DEFAULT NULL,
  `date_modification` datetime(6) DEFAULT NULL,
  `date_resolution` datetime(6) DEFAULT NULL,
  `description` varchar(4000) NOT NULL,
  `navire` varchar(255) DEFAULT NULL,
  `numero_conteneur` varchar(255) DEFAULT NULL,
  `priorite` enum('BASSE','NORMALE','HAUTE','CRITIQUE') NOT NULL,
  `reference` varchar(255) NOT NULL,
  `statut` enum('OUVERTE','EN_COURS','EN_ATTENTE','RESOLUE','CLOTUREE','REJETEE') NOT NULL,
  `titre` varchar(255) NOT NULL,
  `type_operation` varchar(255) NOT NULL,
  `agent_id` bigint(20) DEFAULT NULL,
  `client_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reclamations`
--

INSERT INTO `reclamations` (`id`, `date_creation`, `date_modification`, `date_resolution`, `description`, `navire`, `numero_conteneur`, `priorite`, `reference`, `statut`, `titre`, `type_operation`, `agent_id`, `client_id`) VALUES
(3, '2026-04-21 12:33:33.000000', '2026-04-21 12:42:13.000000', '2026-04-21 12:42:13.000000', 'Le conteneur MSCU1234567 présente des dégâts importants.', 'MSC OSCAR', 'MSCU1234567', 'HAUTE', 'REC-1776774813524', 'RESOLUE', 'Conteneur endommagé', 'DECHARGEMENT', NULL, 6),
(4, '2026-04-21 12:33:33.000000', '2026-04-21 12:43:29.000000', '2026-04-21 12:43:29.000000', 'Marchandise non livrée dans les délais convenus.', NULL, NULL, 'NORMALE', 'REC-1776774813553', 'RESOLUE', 'Retard de livraison', 'LIVRAISON', 5, 6),
(5, '2026-04-21 12:41:17.000000', '2026-04-21 18:25:22.000000', '2026-04-21 18:25:22.000000', 'test', 'test', '4532', 'NORMALE', 'REC-1776775277588', 'RESOLUE', 'test', 'LIVRAISON', 5, 6),
(6, '2026-04-21 14:33:52.000000', '2026-04-21 14:34:39.000000', '2026-04-21 14:34:39.000000', 'test', 'MSC (Mediterranean Shipping Company)', 'RZG', 'NORMALE', 'REC-1776782032429', 'RESOLUE', 'Retard de livraison / Déchargement', 'STOCKAGE', NULL, 6),
(7, '2026-04-21 14:55:51.000000', '2026-04-21 18:25:27.000000', '2026-04-21 18:25:27.000000', 'test', 'EVERGREEN', 'erd', 'NORMALE', 'REC-1776783351035', 'RESOLUE', 'Problème d\'accès au port', 'CHARGEMENT', 5, 6),
(8, '2026-04-22 11:37:57.000000', '2026-04-22 11:38:42.000000', '2026-04-22 11:38:42.000000', 'h', 'Non spécifié', 'N/A', 'NORMALE', 'PORT-1776857877247', 'RESOLUE', 'Problème d\'acquisition de document', 'Problème d\'acquisition de document', 5, 6);

-- --------------------------------------------------------

--
-- Structure de la table `reponses`
--

CREATE TABLE `reponses` (
  `id` bigint(20) NOT NULL,
  `date_creation` datetime(6) DEFAULT NULL,
  `message` varchar(4000) NOT NULL,
  `auteur_id` bigint(20) NOT NULL,
  `reclamation_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` bigint(20) NOT NULL,
  `actif` bit(1) NOT NULL,
  `date_creation` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `entreprise` varchar(255) DEFAULT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `role` enum('CLIENT','AGENT','ADMIN') NOT NULL,
  `telephone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `actif`, `date_creation`, `email`, `entreprise`, `mot_de_passe`, `nom`, `prenom`, `role`, `telephone`) VALUES
(4, b'1', '2026-04-21 12:33:33.000000', 'admin@port.com', NULL, '$2a$10$F/4eBW9Dd6d4CR6En4NWz.H2VY/Ls/Ah6dqZBBjkv45weP0HO6ntu', 'Admin', 'Super', 'ADMIN', NULL),
(5, b'1', '2026-04-21 12:33:33.000000', 'agent@port.com', NULL, '$2a$10$Ipbh2Li0A9mFBXZi2gkGeut5kbkh9rjd.9BVZS3SUDquJr7fxrTU.', 'Martin', 'Pierre', 'AGENT', NULL),
(6, b'1', '2026-04-21 12:33:33.000000', 'client@port.com', 'Maritime SA', '$2a$10$SuzphpCyyXLQf6CGHUZoOOJ0F8BDQmmNzAgc4QZqzxDDbeMs5AESO', 'Dupont', 'Marie', 'CLIENT', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `reclamations`
--
ALTER TABLE `reclamations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbif1072vcs0maqmvd9a4qgdi8` (`agent_id`),
  ADD KEY `FKmxkwfxo2qanmjy43ex6ppc21c` (`client_id`);

--
-- Index pour la table `reponses`
--
ALTER TABLE `reponses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKt1ycjsskiabxdfnila2pu3t3m` (`auteur_id`),
  ADD KEY `FKda9hf0vih8cj5tjhtxdbsgeb4` (`reclamation_id`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_6ldvumu3hqvnmmxy1b6lsxwqy` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `reclamations`
--
ALTER TABLE `reclamations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `reponses`
--
ALTER TABLE `reponses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `reclamations`
--
ALTER TABLE `reclamations`
  ADD CONSTRAINT `FKbif1072vcs0maqmvd9a4qgdi8` FOREIGN KEY (`agent_id`) REFERENCES `utilisateurs` (`id`),
  ADD CONSTRAINT `FKmxkwfxo2qanmjy43ex6ppc21c` FOREIGN KEY (`client_id`) REFERENCES `utilisateurs` (`id`);

--
-- Contraintes pour la table `reponses`
--
ALTER TABLE `reponses`
  ADD CONSTRAINT `FKda9hf0vih8cj5tjhtxdbsgeb4` FOREIGN KEY (`reclamation_id`) REFERENCES `reclamations` (`id`),
  ADD CONSTRAINT `FKt1ycjsskiabxdfnila2pu3t3m` FOREIGN KEY (`auteur_id`) REFERENCES `utilisateurs` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
