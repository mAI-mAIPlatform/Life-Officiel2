# DIRECTION ARTISTIQUE - BATCH 3: VEHICLES (Part 1/2)
**Vision : Liquid Glass & Cyber-Realism | Cible : AAA PBR Ray-Traced**

---

## 24. VEHICLES : SPORTS CARS (10 Fichiers)
Véhicules d'hyper-luxe, symboles géométriques de la richesse corporatiste à NeoCity.

### 📁 Fichiers : `public/assets/models/vehicles/car_sport_01_apex.glb` à `10.glb` (10 Fichiers)
**Type :** 3D Model (Drivable Vehicle)
**Polycount Cible :** ~60,000 Tris (Extérieur 40k, Intérieur modélisé 20k).
**Matériaux (PBR 4096x4096px) :**
- **Car_Paint :** Shader automobile complexe à 3 couches (Base diffuse saturée + Clearcoat à IOR 1.6 + Metal flakes microscopiques). Réflectivité parfaite nécessaire pour le Ray-Tracing. Peintures "Liquid Glass" qui changent subtilement de couleur selon l'angle (Effet "Pearlescent").
- **Tires :** Gomme synthétique lisse, usée sur les bords (Roughness variable). Pas de scuptures traditionnelles de pneu.
- **Interior_Dashboard :** Écrans panoramiques incurvés (Emissive maps pour le compteur de vitesse, navigation). Volant de type "Yoke" (avion).
**Fidélité :** Profils très bas, aérodynamiques, sans rétroviseurs classiques (utilisent des caméras projetant sur des écrans internes). Les portes s'ouvrent en ciseaux ou de manière asymétrique motorisée. Pas de pot d'échappement, calandres fermées avec LED incrustées (Lignes lumineuses de signature continues).

---

## 25. VEHICLES : DRONES & AERIAL (10 Fichiers)
L'espace aérien est privatisé. Drones de logistique et taxis volants.

### 📁 Fichiers : `public/assets/models/vehicles/drone_delivery_01.glb` à `05.glb` (5 Fichiers)
**Type :** 3D Model (AI Vehicle prop)
**Polycount Cible :** ~15,000 Tris.
**Matériaux :**
- **Casing :** Composites de carbone (Anisotropic roughness, motifs hexagonaux) et plastique blanc mServices.
- **Rotors :** Modèle fixe pour l'arrêt, et un "Rotor_Blur" transparent riggé pour le mouvement (Alpha map tournoyante).
**Fidélité :** Forme utilitaire, octocoptères surpuissants transportant des caisses de marchandise verrouillées magnétiquement. Scanners lasers orientés vers le sol (Volume mesh émissif rouge transluscide).

### 📁 Fichiers : `public/assets/models/vehicles/aero_taxi_01.glb` à `05.glb` (5 Fichiers)
**Type :** 3D Model (Sky-Vehicle)
**Polycount Cible :** ~35,000 Tris.
**Matériaux :**
- **Hull :** Lignes épurées, sans angles morts. Vitrage continu teinté électrochromique (Noir opaque de l'extérieur).
**Fidélité :** Taxis volants corporatifs (VTOL). Leurs turbines de levage sont internes/carénées, crachant une chaleur bleue au décollage.

---

## 26. VEHICLES : MOTOS & HEAVY (20 Fichiers)
Véhicules des rues basses. De la moto de gang personnalisée au camion d'éboueur automatisé.

### 📁 Fichiers : `public/assets/models/vehicles/moto_custom_01.glb` à `10.glb` (10 Fichiers)
**Type :** 3D Model (Drivable Vehicle)
**Polycount Cible :** ~45,000 Tris.
**Matériaux :**
- **Chassis_Naked :** Motos de type "Street Fighter". Beaucoup de composants mécaniques exposés, packs de batteries apparents.
- **Rims :** Jantes lumineuses "Tron-style" très saturées (Rouge sang, Cyan, Jaune toxique). Traceurs émissifs réagissant à la vitesse.
**Fidélité :** Brutales et asymétriques. Pneus très larges assurant une stabilité magnétique. Le joueur chevauche presque la roue avant. Les modèles de gangs ont des graffitis holographiques animés projetés vaguement sur le réservoir (Decal Animé).

### 📁 Fichiers : `public/assets/models/vehicles/truck_heavy_01_garbage.glb` à `10.glb` (10 Fichiers)
**Type :** 3D Model (Utility Vehicle)
**Polycount Cible :** ~50,000 Tris.
**Matériaux :**
- **Armor :** Plaques d'acier épaisses, abîmées. Rouille, boue des niveaux inférieurs (Dirt Masks très présents). 
- **Tires_Heavy :** Pneus crantés titanesques, conçus pour rouler sur tout obstacle urbain sans plier.
**Fidélité :** Blocs massifs, presque aveugles (le pare-brise est une mince fente). Camions logistiques autonomes ou blindés de transport de fonds de NeoBank. Leurs gyrophares orange pulsent lentement avec une autorité absolue sur le trafic environnant.
