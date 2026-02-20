# DIRECTION ARTISTIQUE - BATCH 1: CHARACTERS (Part 1/3)
**Vision : Liquid Glass & Cyber-Realism | Cible : AAA PBR Ray-Traced**

---

## 1. HERO BASE (1 Fichier)

### 📁 Fichier : `public/assets/models/characters/hero_base_rigged.glb`
**Type :** 3D Model (Character Mesh)
**Polycount Cible :** ~85,000 Tris (Optimisé pour gros plans "Over The Shoulder").
**Architecture Squelettique :** Rig complet (120 bones) + 52 Blendshapes ARKit-compatibles (FACS) pour mocap faciale. Moteur de physique pour cheveux et drapés (Cloth simulation setup).
**Matériaux (PBR 4096x4096px, Liquid Glass Shading) :**
- **Skin_Head :**
  - **Albedo :** Teinte réaliste avec micro-capillaires. Subsurface Scattering (SSS) Profile "Human Thin" à 0.85.
  - **Normal :** Détails de pores de peau (Micro-normal map 8K tilable), ridules d'expression.
  - **Roughness :** Map dynamique, zones grasses (front, nez) à 0.3, zones sèches à 0.6.
- **Cyber_Implants (Cou / Colonne) :**
  - **Metalness :** 1.0 (Titane anodisé), **Roughness :** 0.15 (Poli).
  - **Normal :** Lignes de structure usinées au laser.
  - **Emissive :** LED sous-cutanées (Bleu mCompany, Intensité 4.0, Bloom activé).
- **Eyes :** Double géométrie (Sclera/Iris + Cornea). Réfraction index (IOR) : 1.336.
**Fidélité & Émotion :**
Le "Hero" n'est pas un super-soldat lisse. Ses yeux reflètent la fatigue d'une vie sous la lumière artificielle de NeoCity. Les implants crâniens luisent d'une douce lueur bleue froide (Liquid Glass) sous sa peau, témoignant de son intégration au système mOS. Sa peau présente un réalisme troublant avec des micro-imperfections, réagissant physiquement aux gouttes de pluie dynamiques (Wetness mask).
**Animation associée :** "Idle_Breathe_Heavy.anim" - Un léger affaissement des épaules, respiration ventrale visible.

---

## 2. NPC ARCHETYPES: BUSINESS (5 Fichiers)
La caste privilégiée travaillant dans les hautes sphères de NeoCity. Costumes haute-couture et interfaces Neurales invisibles.

### 📁 Fichier : `public/assets/models/characters/npc_business_01_ceo.glb`
**Type :** 3D Model
**Polycount Cible :** ~45,000 Tris.
**Matériaux (PBR 2048x2048px) :**
- **Suit_Fabric :**
  - **Albedo :** Noir Onyx, tissage hexagonal "Smart-Fabric".
  - **Normal :** Tramme textile nano-structurée.
  - **Roughness/Anisotropic :** Réflexions soyeuses sur les arêtes (Sheen effect).
- **AR_Contacts :**
  - **Emissive :** Cercles holographiques dorés sur les iris.
**Fidélité :** Imposant, froid. Le vêtement est d'une propreté absolue, sans aucun pli désordonné (matériau à mémoire de forme).

### 📁 Fichier : `public/assets/models/characters/npc_business_02_analyst.glb`
**Type :** 3D Model
**Polycount Cible :** ~40,000 Tris.
**Matériaux :**
- **Shirt_LiquidGlass :** Chemise transparente floutant la peau en dessous (IOR 1.1, Roughness 0.05).
- **Skin :** Pâle, manque de soleil. SSS réduit.
**Fidélité :** Démarche nerveuse, scannant frénétiquement des données invisibles via ses implants oculaires. Un pion de mCompany.

### 📁 Fichier : `public/assets/models/characters/npc_business_03_executive_f.glb`
**Type :** 3D Model
**Polycount Cible :** ~42,000 Tris.
**Matériaux :**
- **Cyber_Jewelry :** Or rose chromé. Metalness 1.0, Roughness 0.02.
- **Coat :** Polymère étanche brillant (Clearcoat 1.0).
**Fidélité :** Élégance chirurgicale. Les talons génèrent un clic métallique parfait. Le maquillage intègre des pigments émetteurs de lumière (Emissive facial lines).

### 📁 Fichier : `public/assets/models/characters/npc_business_04_security_suit.glb`
**Type :** 3D Model
**Polycount Cible :** ~50,000 Tris (ajouts d'armures dissimulées).
**Matériaux :**
- **Under_Armor :** Kevlar-carbone. Normal map très texturée, Roughness 0.8.
- **Glasses :** Verre miroir opaque (Metalness 1.0, Roughness 0). Opaque de l'extérieur.
**Fidélité :** Masse musculaire évidente sous le costume coupé sur mesure. Aucune expression faciale, mâchoire serrée, implants de communication dans l'oreille interne.

### 📁 Fichier : `public/assets/models/characters/npc_business_05_intern.glb`
**Type :** 3D Model
**Polycount Cible :** ~38,000 Tris.
**Matériaux :**
- **Cheap_Suit :** Tissu synthétique classique, moins de reflets "Sheen", quelques faux-plis.
- **Data_Pad :** Tablette usée, écran fissuré (Emissive glitchy).
**Fidélité :** Le regard anxieux, cernes marquées (Albedo darken sous les yeux), posture voûtée par le stress corporatif de 2035.

---

## 3. NPC ARCHETYPES: TECH-WEAR (5 Fichiers)
Les hackers, ingénieurs drones et rebelles silencieux des niveaux intermédiaires.

### 📁 Fichier : `public/assets/models/characters/npc_techwear_01_runner.glb`
**Type :** 3D Model
**Polycount Cible :** ~48,000 Tris.
**Matériaux (PBR 2048x2048px) :**
- **Jacket_GoreTex :** Albedo Noir/Gris urbain, decals réfléchissants 3M. Wetness map.
- **Backpack_Rig :** Metalness 0.8 pour l'exosquelette porteur. Diodes de statut (Vert toxique).
**Fidélité :** Suréquipé pour la pluie. La veste est couverte de câbles de bypass apparents. Odeur visuelle d'ozone et de bitume.

### 📁 Fichier : `public/assets/models/characters/npc_techwear_02_mechanic.glb`
**Type :** 3D Model
**Polycount Cible :** ~45,000 Tris.
**Matériaux :**
- **Cyber_Arm :** Prothèse utilitaire lourde. Metalness 1.0, Roughness 0.6 (Métal rayé, graisseux).
- **Overalls :** Tissu lourd, Normal map avec taches d'huile synthétique.
**Fidélité :** Les servos de son bras grindent subtilement. Traces de cambouis sur un visage partiellement robotisé. Posture asymétrique due au poids du bras.

### 📁 Fichier : `public/assets/models/characters/npc_techwear_03_hacker_f.glb`
**Type :** 3D Model
**Polycount Cible :** ~42,000 Tris.
**Matériaux :**
- **Neural_Visor :** Casque couvrant les yeux. Visor material : Glass PBR (IOR 1.5), avec écran LED interne défilant du code mOS.
- **Skin :** Pâleur extrême, tatouages thermiques réactifs (Roughness différentiel).
**Fidélité :** Totalement déconnectée de la réalité physique. Ses doigts (équipés de thimbles haptiques) tapent frénétiquement dans le vide sur des claviers AR invisibles pour nous.

### 📁 Fichier : `public/assets/models/characters/npc_techwear_04_drone_operator.glb`
**Type :** 3D Model
**Polycount Cible :** ~44,000 Tris.
**Matériaux :**
- **Antenna_Rig :** Cuivre terni (Albedo orange sourd, Metalness 1.0, Normal oxydé).
- **Poncho :** Transparent plastique (Liquid Glass mat), laisse voir les équipements en dessous.
**Fidélité :** Porte une lourde antenne dorsale. Il regarde constamment le ciel, ses yeux s'illuminant au rythme de la transmission radio. Vêtements utilitaires usés.

### 📁 Fichier : `public/assets/models/characters/npc_techwear_05_courier.glb`
**Type :** 3D Model
**Polycount Cible :** ~39,000 Tris.
**Matériaux :**
- **Exo_Legs :** Renforts de jambes pour Parkour. Fibre de carbone (Anisotropic reflections).
- **Shoes :** Semelles magnétiques émettrices d'un halo cyan.
**Fidélité :** Agilité extrême, corps svelte. L'armature de ses jambes est égratignée par d'innombrables courses sur les toits de NeoCity. Respiration toujours rapide.
