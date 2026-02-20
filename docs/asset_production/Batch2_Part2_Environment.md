# DIRECTION ARTISTIQUE - BATCH 2: ENVIRONMENT TEXTURES (Part 2/3)
**Vision : Liquid Glass & Cyber-Realism | Cible : AAA PBR Ray-Traced**

---

## 21. ENVIRONMENT : ROAD & GROUND SURFACES (25 Fichiers)
Le sol de NeoCity. Toujours humide, reflétant la dystopie lumineuse de la ville au joueur dominant.

### 📁 Fichiers : `public/assets/textures/environment/road_asphalt_wet_01.png` à `10.png` (10 Fichiers)
**Type :** PBR Material Set (Albedo, Normal, Roughness, AO)
**Résolution :** 4096x4096px (Seamless).
**Direction Artistique :**
- **Détails :** Asphalte hyper-poreux conçu pour canaliser les pluies diluviennes de 2035.
- **Rain/Puddle Mask :** La `Roughness Map` est la clé. Elle doit contenir de larges flaques lisses absolues (valeur 0.0) tranchant avec le bitume texturé (valeur 0.8), pour maximiser les reflets purs des lumières de la ville.
- **Normal Map :** Doit inclure des micro-billes de verre réflectives intégrées nativement dans le goudron futuriste.

### 📁 Fichiers : `public/assets/textures/environment/ground_tech_tiles_01.png` à `10.png` (10 Fichiers)
**Type :** PBR Material Set
**Résolution :** 2048x2048px (Seamless).
**Direction Artistique :**
- **Plazas mCompany :** Dalles exagonales en matériaux composites.
- **Albedo / Emissive :** Très clair, clinique. Des jointures émissives LED parcourent les dalles, formant un réseau vasculaire de lumière au sol (Bleu froid/Cyan). L'usure se voit uniquement par la perte de brillance polie au centre de la dalle (usure piétonnière).

### 📁 Fichiers : `public/assets/textures/environment/decal_debris_01.png` à `05.png` (5 Fichiers)
**Type :** 2D Asset (Decal, Normal + Alpha)
**Résolution :** 1024x1024px.
**Direction Artistique :** Flaques d'huile irisée (Reflets prismatiques Fresnel), sang synthétique bleuté, tas de seringues de "Gouffre", flyers holographiques écrasés. À projeter dynamiquement in-engine pour "salir" les textures Seamless.

---

## 22. ENVIRONMENT : NEON SIGNS & ADVERTISEMENTS (25 Fichiers)
L'agression visuelle corporatiste. La lumière comme arme commerciale.

### 📁 Fichiers : `public/assets/textures/environment/neon_corp_mcompany_01.png` à `05.png` (5 Fichiers)
**Type :** PBR Emissive Material Mask
**Résolution :** 2048x1024px.
**Direction Artistique :**
- **Logos & Texts :** Publicités officielles pour `mPhone 16`, `mBurger`, `Neo-Pharma`. 
- **Aspect :** Des enseignes colossales conçues pour ne **jamais** vaciller. Lumière froide, continue, parfaite. L'émission (Glow) doit avoir un falloff très doux pour créer un "Light Bleed" naturel autour du panneau.

### 📁 Fichiers : `public/assets/textures/environment/neon_street_market_01.png` à `10.png` (10 Fichiers)
**Type :** PBR Emissive Material Mask / Sprite Atlas
**Résolution :** 2048x2048px.
**Direction Artistique :**
- **Kanji/Cyber-Text :** Bar à nouilles, cliniques "Ripperdoc" illégales, motels miteux.
- **Aspect :** Tubulure Neon classique mais poussée à l'extrême saturation. Un tube sur trois est mourant (Nécessite deux masques de couleur : un pour l'allumé saturé, un pour le tube éteint/grillé grisâtre visible en transparence). Ces textures seront animées in-engine pour flickering.

### 📁 Fichiers : `public/assets/textures/environment/ad_holo_glitch_01.png` à `10.png` (10 Fichiers)
**Type :** Video Texture (WebM / SpriteSheet)
**Résolution :** 1080x1920px.
**Direction Artistique :**
- **Contenu :** De l'idol IA (Hatsune Miku de 2035) dansante, de la pub agressive Pop-up.
- **Esthétique :** Ces textures ne sont pas posées sur des murs, elles flottent dans l'air. Elles doivent avoir des "Scanlines" très épaisses et subir des artefacts de compression "Datamosh". Le masque d'opacité doit être détérioré par du bruit numérique dynamique.
