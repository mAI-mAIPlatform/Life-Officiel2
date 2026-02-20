# DIRECTION ARTISTIQUE - BATCH 3: VEHICLES AUDIO (Part 2/2)
**Vision : Spatialisation HRTF | Qualité : AAA 96kHz/24bit (Source) -> 48k (In-Game)**

---

## 27. VEHICLES SFX : ENGINE & MOVEMENT (15 Fichiers)
Systèmes sonores dynamiques. Pas de moteurs thermiques traditionnels (sauf vieilles épaves illégales). Le son des véhicules doit transmettre leur propulsion électromagnétique ou à induction.

### 📁 Fichiers : `public/assets/audio/sfx/vehicles/car_sport_engine_loop_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Engine Loop / Pitch-shifable)
**Caractéristiques :**
- **Synthèse :** Bruit de turbine électrique ("Electric Whine"). Un son très propre, ressemblant presque à une note de synthétiseur (Onde sinusoïdale très haute en fréquence avec une légère saturation d'overdrive).
- **Pitch Control :** Le son doit être produit comme un "Drone" statique (Idle) mais très riche harmoniquement. Lors de l'intégration dans le jeu, la vitesse du script du véhicule modifiera le paramètre de `Pitch` (de 1.0 à 4.0) pour évoquer l'accélération violente. C'est le hurlement de l'électromagnétisme sous contrainte.

### 📁 Fichiers : `public/assets/audio/sfx/vehicles/moto_heavy_engine_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Engine Loop)
**Caractéristiques :**
- **Synthèse :** Plus "sale" que les Hypercars. Bruit de moteur à commutation de phase brutalisé. Gênant, rugueux (Guttural synth bass). Ajout de battements de basses fréquences évoquant un moteur au bord de la surcharge (Pulse LFO très sec).

### 📁 Fichiers : `public/assets/audio/sfx/vehicles/drone_propulsion_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Hover Loop)
**Caractéristiques :**
- **Synthèse :** Séparation des fréquences : un souffle sourd vers le sol (Wind wash / 80Hz - 200Hz) pour simuler la poussée atmosphérique, et un bourdonnement aigu constant, un peu "insectoïde" ou similaire aux servos informatiques (8kHz - 12kHz).
- **Spatialisation :** Extrêmement directionnel. Le son tombe comme un cône depuis le ciel.

---

## 28. VEHICLES SFX : TIRES & HANDLING (5 Fichiers)
La physique de contact entre le Liquid Glass urbain et la gomme synthétique.

### 📁 Fichiers : `public/assets/audio/sfx/vehicles/tire_skid_wet_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Transitoire & Friction)
**Caractéristiques :**
- **Synthèse :** Pas le crissement classique du caoutchouc sec brûlant. Étant donné que les routes de NeoCity sont imperméables et constamment humides, le son du dérapage est plutôt un déchirement d'eau ("Tearing water sound", hydroplanage extrême). 
- **Texture :** Un "Ssshhhook" très fort, mouillé et haut dans les médiums (3kHz - 6kHz), combiné avec le vacarme des suspensions actives en métal lourd qui encaissent les G latéraux.
