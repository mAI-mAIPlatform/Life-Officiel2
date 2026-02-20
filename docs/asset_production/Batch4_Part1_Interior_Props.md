# DIRECTION ARTISTIQUE - BATCH 4: PROPS & WORLD BUILDING (Part 1/3)
**Vision : Liquid Glass & Cyber-Realism | Cible : AAA PBR Ray-Traced**

---

## 29. BUILDINGS : INTERIOR PROPS - CORPORATE (15 Fichiers)
L'intérieur des monolithes mCompany. Un luxe froid et déshumanisant.

### 📁 Fichiers : `public/assets/models/buildings/prop_corp_desk_01.glb` à `05.glb` (5 Fichiers)
**Type :** 3D Model (Interior Furniture)
**Polycount Cible :** ~4,000 Tris.
**Matériaux (PBR 2048x2048px) :**
- **Tabletop :** Obsidian pur (Metalness 0.8, Roughness 0.02). Ray-traced reflections parfaites. Les claviers holographiques sont générés par la table (Alpha emissive map au-dessus de la surface).
- **Legs :** Chrome blanc (Roughness 0.1).
**Fidélité :** Des bureaux sans aucun dossier papier (tout est digitalisé). Seuls des obélisques de données (data drives luxueux) sont posés dessus. Le bureau n'a pas de fils, il est alimenté par induction via le sol.

### 📁 Fichiers : `public/assets/models/buildings/prop_corp_server_01.glb` à `10.glb` (10 Fichiers)
**Type :** 3D Model (Interior Infrastructure)
**Polycount Cible :** ~8,000 Tris.
**Matériaux :**
- **Casing :** Les serveurs "CookIA" sont de grands cylindres de verre remplis d'un liquide de refroidissement diélectrique (Shader de réfraction liquide avec bulles animées via World Position Offset).
- **Core :** L'intérieur brille d'une lueur cyan intense (Core emissive), projetant des caustiques sur les murs alentours.
**Fidélité :** Imposants. Ils donnent l'impression de respirer. Des bras mécaniques minuscules à l'intérieur manipulent des disques quantiques sans intervention humaine.

---

## 30. BUILDINGS : INTERIOR PROPS - SLUMS/GAMING (15 Fichiers)
L'habitat des niveaux bas, surpeuplé, hyper-stimulant et encombré.

### 📁 Fichiers : `public/assets/models/buildings/prop_slum_bed_pod_01.glb` à `05.glb` (5 Fichiers)
**Type :** 3D Model (Interior Furniture)
**Polycount Cible :** ~6,000 Tris.
**Matériaux :**
- **Mattress :** Mousse synthétique déchirée (Normal map très bruitée).
- **Pod_Shell :** Fibre de verre jaunie par la nicotine et la pollution (Albedo jaune sale, Roughness 0.6).
**Fidélité :** Capsules de sommeil empilables. L'intérieur comprend un écran de télé bas de gamme (Emissive avec du bruit TV et scanlines) intégré au plafond à 50 cm du visage du dormeur. Claustrophobique.

### 📁 Fichiers : `public/assets/models/buildings/prop_slum_gaming_setup_01.glb` à `10.glb` (10 Fichiers)
**Type :** 3D Model (Interior Props)
**Polycount Cible :** ~10,000 Tris (Focus sur les câblages).
**Matériaux :**
- **Hardware :** PC empilés "Frankenstein" refroidis par des ventilateurs industriels externes. Plastique noir mat couvert d'autocollants (Decals).
- **Monitors :** Multiples écrans cathodiques recyclés ou dalles OLED craquelées (IOR 1.5, Emissive distordu).
**Fidélité :** Un fouillis absolu de câbles optiques brillants (Splines 3D). Le bureau est couvert de canettes de boisson énergisante "HyperBite" luminescentes et de cendriers qui débordent. Représente l'évasion virtuelle des habitants pauvres pris au piège par mCompany.
