# DIRECTION ARTISTIQUE - BATCH 1: WEAPONS (Part 4/6)
**Vision : Liquid Glass & Cyber-Realism | Cible : AAA PBR Ray-Traced**

---

## 8. TACTICAL WEAPONS: HANDGUNS (5 Fichiers)
Armes de poing standard, utilisées par la police, les gangs et les civils armés.

### 📁 Fichiers : `wpn_pistol_01_kinetic.glb` à `wpn_pistol_05_emp.glb`
**Type :** 3D Model (Weapon)
**Polycount Cible :** ~12,000 Tris par arme (Modélisation First-Person, détails internes du canon).
**Matériaux (PBR 2048x2048px) :**
- **Receiver/Frame :** Polymère composite imprimé en 3D (Roughness 0.6, légères stries d'impression sur la Normal Map).
- **Barrel/Mechanics :** Acier trempé (Metalness 1.0, Roughness 0.2), marques de chauffe bleue aux extrémités.
- **Holo-Sight :** Écran de visée `Liquid Glass`. Réticule généré par Emissive Map (Rouge/Cyan) flottant en projection (Alpha Blend).
- **Grip :** Caoutchouc texturé anti-dérapant (Micro-bump pass).
**Fidélité & Animation :**
- **01 à 03 (Kinetic) :** Armes à poudre classiques. Éjection de douille modélisée. Animation de recul violent, retour de culasse sec. Salissures de poudre au bout du canon.
- **04 & 05 (EMP/Energy) :** Pistolets à impulsion mCompany. Pas de culasse mobile, mais des condensateurs ouverts qui se rechargent. Diodes de charge qui passent du rouge au bleu clair Piston magnétique interne visible à travers un capot vitré.
**Détail Technique :** Les chargeurs contiennent des munitions modélisées qui diminuent en temps réel (Bone link dans le rig de l'arme).

---

## 9. TACTICAL WEAPONS: RIFLES & SMGs (6 Fichiers)
Armes automatiques d'assaut tactique. Précision et saturation.

### 📁 Fichiers : `wpn_smg_01.glb` à `wpn_smg_03.glb` (3 Fichiers)
**Type :** 3D Model (Weapon)
**Polycount Cible :** ~18,000 Tris.
**Matériaux :** 
- **Chassis :** Titane brossé (Anisotropic Roughness). Design très compact, bull-pup.
**Fidélité :** Armes très nerveuses, cadences de tir élevées. Canons courts rougissant rapidement à la chaleur (Emissive animé basé sur la chaleur de l'arme).

### 📁 Fichiers : `wpn_rifle_01_assault.glb` à `wpn_rifle_03_sniper.glb` (3 Fichiers)
**Type :** 3D Model (Weapon)
**Polycount Cible :** ~25,000 Tris.
**Matériaux :**
- **Scope_Lens :** Shader "Sniper Glass" avec IOR 1.6, reflets environnementaux forcés (Cubemap additionnelle), et Dirt mask pour simuler la poussière sur la lentille. Effet d'iridescence sur les bords.
- **Body :** Revêtement "Stealth" absorbant la lumière (Albedo noir pur, Roughness très mat 0.9, Normal map lisse).
**Fidélité :** Le fusil de précision (03) possède un canon électromagnétique. Lors de la charge, des rails latéraux s'écartent avec un arc électrique (Particules) entre eux. Un petit écran OLED sur le côté de l'arme affiche le taux de vent et la distance de la cible.

---

## 10. TACTICAL WEAPONS: HEAVY & CROWD CONTROL (5 Fichiers)
Contrôle de foule par la force de sécurité mCompany et armes de destruction massive de gang.

### 📁 Fichiers : `wpn_heavy_01_shotgun.glb` à `wpn_heavy_03_riot.glb` (3 Fichiers)
**Type :** 3D Model (Weapon)
**Polycount Cible :** ~20,000 Tris.
**Matériaux :**
- **Heat_Shield :** Grille métallique noircie. 
- **Stock :** Crosse lourde avec amortisseurs hydrauliques visibles (Metal tubes).
**Fidélité :** Le pompe anti-émeute a une largeur démesurée. Il tire des cartouches de gaz ou des shrapnels électriques. Son rechargement nécessite une animation où le personnage frappe fortement le mécanisme pour le débloquer (Usure/Ruggedness).

### 📁 Fichiers : `wpn_heavy_04_launcher.glb` à `wpn_heavy_05_beam.glb` (2 Fichiers)
**Type :** 3D Model (Weapon)
**Polycount Cible :** ~28,000 Tris.
**Matériaux :**
- **Coils :** Bobines de cuivre (Metalness, teinte orange cuivrée).
- **Core :** Cœur de plasma. Shader volumétrique émissif tourbillonnant.
**Fidélité :** Le Beam Rifle pèse lourdement sur l'animation (Idle très bas). Ses bobines tournent avant le tir. La chaleur déforme visuellement l'air au-dessus du canon (Heat haze post-process mask).

---

## 11. TACTICAL WEAPONS: MELEE & STEALTH (4 Fichiers)
Combat rapproché brutal ou silencieux. Lames haute fréquence.

### 📁 Fichiers : `wpn_melee_01_knife.glb` à `wpn_melee_04_katana.glb` (4 Fichiers)
**Type :** 3D Model (Weapon)
**Polycount Cible :** ~3,000 Tris.
**Matériaux :**
- **Blade :** Acier carbone "Damascus" holographique. Le motif sur la lame s'anime très lentement 
- **Edge :** Tranchant High-Frequency (HF). Une très fine ligne émissive vibrante le long de la lame (intensité modulée par le mouvement).
**Fidélité :** Des armes de la pègre élégantes. Le Katana (04) inclut un fourreau motorisé (Rigged) qui éjecte la lame pour des attaques rapides (Iaijutsu urbain). L'acier reflète le monde (Ray-traced reflections parfaites, Roughness 0.01 sur la tranche). Laisse une trainée de rémanence rétinienne dans les environnements sombres.
