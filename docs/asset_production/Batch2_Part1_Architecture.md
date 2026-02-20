# DIRECTION ARTISTIQUE - BATCH 2: ARCHITECTURE (Part 1/3)
**Vision : Liquid Glass & Cyber-Realism | Cible : AAA PBR Ray-Traced**

---

## 18. BUILDINGS : FINANCIAL DISTRICT SKYSCRAPERS (20 Fichiers)
La skyline de NeoCity. Des monolithe de verre et d'acier qui percent le nuage de pollution.

### 📁 Fichiers : `public/assets/models/buildings/sky_finance_01.glb` à `20.glb` (20 Fichiers)
**Type :** 3D Model (Architecture / Exterior Only)
**Polycount Cible :** ~15,000 Tris par tour (Détails concentrés sur les balcons et les rez-de-chaussée).
**Matériaux (PBR 4096x4096px, Liquid Glass Shading) :**
- **Glass_Panels :** Verre structurel noir (Metalness 1.0, Roughness 0.05). Réflexions ray-traced absolues. La Normal map inclut des micro-variations d'alignement des panneaux pour ne pas faire un miroir parfait.
- **Structural_Beams :** Acier brossé foncé.
- **Window_Parallax :** Intérieurs simulés via technique de "Parallax Mapping" (Interior Mapping) sur un shader émissif. Affiche de faux bureaux (Bureaux mCompany, serveurs 3D illusoires) avec de la profondeur sans géométrie.
**Fidélité :** Imposants, oppressants. Ils doivent donner le vertige au joueur qui regarde vers le haut. Éclairages LED obliques cyan/magenta balayant la surface la nuit.

---

## 19. BUILDINGS : MODULAR APARTMENTS (30 Fichiers)
Les habitats empilables des niveaux inférieurs et moyens. Brutalisme technologique.

### 📁 Fichiers : `public/assets/models/buildings/apt_mod_corpo_01.glb` à `10.glb` (10 Fichiers)
**Type :** 3D Model (Modular Building Block)
**Polycount Cible :** ~5,000 Tris.
**Matériaux :**
- **Concrete_Smart :** Béton auto-cicatrisant (Albedo gris clair très propre, Roughness 0.7).
- **Balcony_Glass :** Verre opacifiant (Emissive blanc tamisé, IOR 1.4).
**Fidélité :** Minimalistes, sans âme. Les balcons sont parfaitement alignés. Ils ressemblent à des tiroirs de serveurs géants mais pour les humains.

### 📁 Fichiers : `public/assets/models/buildings/apt_mod_slum_01.glb` à `20.glb` (20 Fichiers)
**Type :** 3D Model (Modular Building Block)
**Polycount Cible :** ~8,000 Tris (Plus de détails chaotiques).
**Matériaux :**
- **Rust & Metal :** Tôle ondulée rouillée, câblages exposés (Decals de saleté et de rouille coulant avec la pluie).
- **Tarps :** Bâches en plastique translucide usé (Subsurface scattering léger pour laisser passer la lumière des néons intérieurs).
**Fidélité :** Empilés de façon précaire. Climatisations extérieures qui gouttent (Particules attachées au prefab), paraboles piratées géantes.

---

## 20. BUILDINGS : STREET MODULES & PROPS (50 Fichiers)
Le mobilier urbain interactif ou bloquant de NeoCity. L'échelle humaine.

### 📁 Fichiers : `public/assets/models/buildings/street_holo_bus_01.glb` à `10.glb` (10 Fichiers)
**Type :** 3D Model (Street Prop)
**Polycount Cible :** ~2,500 Tris.
**Matériaux :**
- **Bench :** Métal froid, design anti-SDF (pics asymétriques).
- **Holo_Ad :** Écran volumétrique (Plan avec shader Alpha/Emissive) diffusant des pubs mServices corrompues. Effet de "Scanline" et "Chromatic Aberration" cuit dans le material.
**Fidélité :** L'abribus grésille légèrement. Il projette une lumière floue sur le trottoir mouillé environnant.

### 📁 Fichiers : `public/assets/models/buildings/street_charge_station_01.glb` à `10.glb` (10 Fichiers)
**Type :** 3D Model (Interactive Prop)
**Polycount Cible :** ~3,000 Tris.
**Matériaux :**
- **Casing :** Plastique blanc poli (Clearcoat) abîmé à la base.
- **Cables :** Câbles de recharge lourds tombant au sol (Physics/Bones si le perso interagit).
**Fidélité :** Bornes de recharge pour véhicules ou implants lourds. Pulsation lumineuse verte "Respirante" lente et hypnotique lorsqu'elles sont libres.

### 📁 Fichiers : `public/assets/models/buildings/street_vendor_kiosk_01.glb` à `10.glb` (10 Fichiers)
**Type :** 3D Model (Environment Set-piece)
**Polycount Cible :** ~12,000 Tris.
**Matériaux :**
- **Metal_Greasy :** Acier inoxydable couvert de graisse synthétique (Roughness très inhomogène).
- **Neon_Tubes :** Verre émissif saturé (Rouge/Orange).
**Fidélité :** "Noodles & Syn-Meat". Kiosques étroits et sales encastrés entre deux bâtiments de luxe. Dégagent de la vapeur (Attach Emitter). Remplis d'ustensiles de cuisine et d'écrans de menu tactiles maculés d'huile.

### 📁 Fichiers : `public/assets/models/buildings/street_infrastructure_01.glb` à `20.glb` (20 Fichiers)
**Type :** 3D Model (Environment Detail)
**Polycount Cible :** ~1,000 Tris.
**Description :** Lampadaires "Liquid Glass", poubelles intelligentes mServices (qui se verrouillent), bouches d'égout fumantes (Logo mWater), barrières de chantier holographiques (shader purement émissif), et caméras de sécurité de rue pan-tilt-zoom (avec animation de tracking par défaut).
