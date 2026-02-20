# DIRECTION ARTISTIQUE - BATCH 1: CHARACTERS (Part 3/3)
**Vision : Liquid Glass & Cyber-Realism | Cible : AAA PBR Ray-Traced**

---

## 7. ACCESSORIES & PROPS (24 Fichiers)
Pièces modulaires à attacher ("Sockets") aux squelettes des PNJ et au Joueur. Optimisation extrême du polycount (instanciation).

### 📁 Fichiers `glasses_ar_01.glb` à `glasses_ar_05.glb` (5 Fichiers)
**Type :** 3D Model (Head Prop)
**Polycount Cible :** ~1,500 Tris par paire.
**Matériaux :**
- **Frames :** Carbone, or, plastique neon transparent (Liquid Glass material).
- **Lenses :** Verre émissif (Emissive shader) projetant l'UI AR dans la rétine (Alpha blend pour laisser deviner l'œil du porteur).
**Fidélité :** L'accessoire indispensable de NeoCity. Les données défilent sur le verre. Le modèle 01 est corporatif (fin, froid), le 05 est "Gouffre" (câbles apparents scotchés, asymétrique).

### 📁 Fichiers `bag_tech_01.glb` à `bag_tech_05.glb` (5 Fichiers)
**Type :** 3D Model (Backpack / Chest rig)
**Polycount Cible :** ~3,500 Tris.
**Matériaux :**
- **Fabric :** Cordura hyper-texturé, lanières magnétiques.
- **Zippers :** Bandes lumineuses au lieu de fermetures éclair mécaniques.
**Fidélité :** Sacs à dos tactiques avec slots de batterie. Poids simulé par la physique (Inertia bones pour que le sac ballotte quand le personnage court).

### 📁 Fichiers `watch_smart_01.glb` à `watch_smart_05.glb` (5 Fichiers)
**Type :** 3D Model (Wrist Prop)
**Polycount Cible :** ~800 Tris.
**Matériaux :**
- **Screen :** Bracelet holographique (pas d'écran de verre plein, juste une projection volumétrique au-dessus du poignet en emissive shader cyan/magenta).
**Fidélité :** L'interface mPhone du poignet. Micro-animation de l'holo-projection qui "glitch" lors des mouvements rapides.

### 📁 Fichiers `mask_gas_01.glb` à `mask_gas_04.glb` (4 Fichiers)
**Type :** 3D Model (Face Prop)
**Polycount Cible :** ~4,000 Tris.
**Matériaux :**
- **Filters :** Cylindres de charbon et mesh métallique (Normal map très fine).
- **Glass :** Renforcé, rayé (Roughness detail map intense).
**Fidélité :** Porté à cause du "Smog" industriel. Modifie l'audio du porteur avec un filtre passe-bas et de la réverbération de masque confiné (Effet type "Bane"). Laisse échapper de petites bouffées de poussière lors de l'expiration.

### 📁 Fichiers `implant_neural_usb_01.glb` à `implant_neural_usb_05.glb` (5 Fichiers)
**Type :** 3D Model (Neck/Head Prop)
**Polycount Cible :** ~500 Tris.
**Matériaux :**
- **Chip :** Silicium et Or.
- **Socket :** Port bio-mécanique incrusté dans la peau (Nécessite un Decal normal-map sur la peau du perso pour la transition).
**Fidélité :** La clé de la Matrice locale, les fameuses "Shard". Micro-lumières de lecture/écriture qui clignotent frénétiquement en vert et orange quand une personne "s'encode" ou transfère des crédits.

---
> [!NOTE]
> Fin détaillée du module **Characters & Accessories** (50 fichiers totaux, validés selon norme). 
> La suite du Batch 1 concernera l'UI (30 fichiers), le Combat/Weapons (20 fichiers) et les SFX associés (40 fichiers).
