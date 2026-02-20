# DIRECTION ARTISTIQUE - BATCH 1: AUDIO SFX COMBAT (Part 6/6)
**Vision : Spatialisation HRTF | Qualité : AAA 96kHz/24bit (Source) -> 48k (In-Game)**

---

## 15. COMBAT SFX : WEAPON FIRING (15 Fichiers)
Le punch du jeu. Les armes doivent sonner dangereusement cinématiques, avec une vraie physicalité.

### 📁 Fichiers : `public/assets/audio/sfx/combat/fire_kinetic_pistol_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Punch & Transitoire)
**Caractéristiques :**
- **Synthèse :** Mélange de véritables enregistrements d'armes automatiques (Glock massif / Desert Eagle, 60%) et de sons de conception de synthétiseur (Kick 808 très court à 60Hz, 40%) pour donner un "Thump" thoracique artificiel.
- **Réponse fréquentielle :** Un pic d'attaque extrêmement rapide (1-2ms) libérant une onde de choc, suivi du mécanisme mécanique très distinctif d'éjection des gaz en métal (4kHz - 8kHz) pour la pureté.
- **Tail :** Une queue de son courte, pour que le son puisse être tiré en rafale sans écrêtage de la timeline audio.

### 📁 Fichiers : `public/assets/audio/sfx/combat/fire_emp_rifle_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Sci-Fi / Energy)
**Caractéristiques :**
- **Synthèse :** Aucun son de poudre. Utilisation de charge électrostatique (craquements de bobines Tesla) mixée avec un coup de piston lourd et gras (Low-pass punch à 50Hz).
- **Enveloppe ADSR :** Attaque percussive très brève (zap), Decay rapide incluant un balayage de filtre vers le bas (Sweep-down de 10kHz à 500Hz) donnant l'impression que l'énergie est "lachée".
- **Glitch :** De légères harmoniques FM (Frequency Modulation) bizarres à la queue du son pour suggérer la distorsion des ondes autour du fusil à impulsion.

### 📁 Fichiers : `public/assets/audio/sfx/combat/fire_heavy_shotgun_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Impact Lourd)
**Caractéristiques :**
- **Synthèse :** Enregistrements d'explosions confinées (type canon) et claquements d'acier massifs.
- **Pression acoustique :** Ce fichier comporte un "Pre-delay" de 10ms d'aspiration d'air avant le BOOM massif. Destiné à saturer brièvement un limiteur in-engine pour réduire tout le reste de l'audio d'environ 3dB ("Ducking") autour de la détonation. C'est l'équivalent auditif d'un flashbang.

---

## 16. COMBAT SFX : IMPACTS & DAMAGE (15 Fichiers)
Bruits viscéraux de ce que la violence fait aux différents matériaux organiques et synthétiques.

### 📁 Fichiers : `public/assets/audio/sfx/combat/impact_flesh_syn_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Flesh & Gore)
**Caractéristiques :**
- **Synthèse :** Des bruits de déchirures, melons écrasés, couplés avec le craquement de plastiques durs (simulant le fait que les PNJs sont presque tous cyber-augmentés).
- **Texture :** Désagréablement "Mouilleux" (Squishy) dans les moyennes fréquences (1kHz - 2.5kHz), mais terminant par un bruit de bris de composants électroniques ou un petit grésillement ("Fzzt") à chaque impact. La balle détruit de l'organique ET du silicium.

### 📁 Fichiers : `public/assets/audio/sfx/combat/impact_armor_titanium_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Metal Ricochet)
**Caractéristiques :**
- **Synthèse :** Tir sur des plaques de blindage en tungstène/titane. Bruit de ricochet typique aigu combiné avec un grand bruit mat de déformation de plaque de métal.
- **Réponse :** Très sec, résonance métallique claire qui reste dans l'air (Ping harmonique prolongé vers 6kHz). L'impact renvoie le joueur à la réalité froide des flics d'élite (Riot Police).

### 📁 Fichiers : `public/assets/audio/sfx/combat/impact_environmental_glass_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Shatter / Liquid Glass Destruction)
**Caractéristiques :**
- **Synthèse :** Le Liquid Glass de NeoCity est spécial. Lorsqu'il se brise, ce n'est pas un verre traditionnel aigu, mais un bris lourd, presque gelé (comme des plaques de glace tombant). Ce gros "Krrash" est suivi d'un bruit de cascade de petits cubes (comme les vitres de voiture), créant un lit sonore très large (Stereo-width à 120%).

---

## 17. COMBAT SFX : MOVEMENT & HANDLING (10 Fichiers)
Le son du rechargement et de la mêlée cinétique.

### 📁 Fichiers : `public/assets/audio/sfx/combat/reload_mech_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Foley & Handling)
**Caractéristiques :**
- **Multi-segments :** Le son doit comporter 3 phases distinctes (Éjection clip vide sonnant sur le sol, Insertion brusque, Armement de culasse coulissant dans de l'huile lisse).
- **Réalisme spatial :** Son enregistré en "Close-mic" (Proximité immédiate) pour donner la sensation d'être le joueur. Bruits minuscules de friction de gants en cuir ou de servos de bras cybernétique durant le rechargement.

### 📁 Fichiers : `public/assets/audio/sfx/combat/melee_hf_blade_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Swoosh / Cut)
**Caractéristiques :**
- **Synthèse :** Bruit de balayage d'air (Doppler-shifted whoosh), combiné à une note persistante à haute fréquence (Lame HF) qui module en "Pitch" selon la vélocité.
- **Identité sonore :** Une épée thermique ou "Monofilament". C'est un son élégant, extrêmement terrifiant car incroyablement propre, ressemblant à un chant de cristal, tranchant brutalement lors du contact suivi du silence de la chair découpée au scalpel.

---
> [!NOTE]
> Le **Batch 1 (Core Foundations) est officiellement documenté à 100% avec les spécifications pour la production**. 
> - Characters & Props : 50 fichiers.
> - Weapns : 20 fichiers.
> - UI : 30 textures.
> - Combat SFX : 40 fichiers.
> Total BATCH 1 = 140 fichiers AAA parfaitement architecturés.
