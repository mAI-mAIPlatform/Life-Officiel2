# DIRECTION ARTISTIQUE - BATCH 2: AMBIENT AUDIO (Part 3/3)
**Vision : Spatialisation HRTF | Qualité : AAA 96kHz/24bit (Source) -> 48k (In-Game)**

---

## 23. AMBIENT : CITY SOUNDSCAPES (10 Fichiers)
Le lit sonore (Bed) de l'Open-World. Ces fichiers bouclent de manière imperceptible pour créer la "Room Tone" macroscopique de la carte.

### 📁 Fichiers : `public/assets/audio/ambient/bgnd_city_low_01.wav` à `03.wav` (3 Fichiers)
**Type :** Audio (Background Loop / Low Freq Bed)
**Caractéristiques :**
- **Réponse fréquentielle :** Un grondement constant (Rumble) entre 30Hz et 150Hz. C'est le bruit combiné des réacteurs de la ville, de la circulation très lointaine et de l'infrastructure souterraine de mCompany.
- **Absence de transitoires :** Aucun événement sonore distinct (pas de klaxon, pas de voix). Uniquement un bourdonnement menaçant, vaste, massif. Comme être près d'un réacteur nucléaire étouffé par des kilomètres de béton.

### 📁 Fichiers : `public/assets/audio/ambient/bgnd_weather_rain_01.wav` à `04.wav` (4 Fichiers)
**Type :** Audio (Background Loop / High Freq Detail)
**Caractéristiques :**
- **Rain_Asphalt (01/02) :** Bruit blanc crépitant (White Noise) avec des milliers d'impacts minuscules au sol. Ce son ne s'entend que lorsque le joueur est dans la rue. Spatialisation 2D globale, mais modulée par HRTF de hauteur/proximité vis-à-vis des bâtiments.
- **Rain_MetalRoof (03/04) :** Impact métallique plus clair (Ping aigu). S'active uniquement sous les abris, les tentes des slums ou en intérieur de véhicule, remplaçant la couche Asphalt avec un volume d'enveloppement de 360°.

### 📁 Fichiers : `public/assets/audio/ambient/bgnd_wind_skycrapers_01.wav` à `03.wav` (3 Fichiers)
**Type :** Audio (Background Loop / Dynamic)
**Caractéristiques :**
- **Synthèse :** Bruit rose (Pink Noise) filtré par des EQ balayants (Sweep LFO) pour simuler les courants d'air s'engouffrant entre des surfaces lisses, très hautes ("Howling wind").
- **Implémentation :** Le volume de ce lit sonore augmente exponentiellement avec l'altitude Z du joueur (Z-axis parameter). Dans la rue, le bruit est absent. Sur le toit d'une tour mCompany à 80 étages, ce sifflement devient oppressant et étouffe les sons de la ville basse.

---
> [!NOTE]
> Le **Batch 2 (Architecture & Atmospherics) est officiellement documenté avec les spécifications pour la production de 160 assets**. 
> - Buildings (Modulaires, Gratte-ciels, Props de rue) : 100 modèles.
> - Textures (Asphalte PBR, Neons agressifs) : 50 matériaux/sprites.
> - Ambiances (Pluie, Vent, Cité) : 10 fichiers audio.
> Total fichiers documentés : 300 fichiers (Batch 1 + Batch 2 sur la cible des 400).
