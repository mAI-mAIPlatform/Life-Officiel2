# DIRECTION ARTISTIQUE - BATCH 1: UI TEXTURES (Part 5/6)
**Vision : Liquid Glass & Cyber-Realism | Cible : AAA PBR Ray-Traced**

---

## 12. mOS ASSETS : ICONS & BRANDING (10 Fichiers)
L'interface de NeoCity, dominée par le "Glassmorphism 2030" et l'esthétique épurée mais omniprésente de mCompany.

### 📁 Fichiers : `public/assets/textures/ui/icon_apps_01.png` à `icon_apps_08.png` (8 Fichiers)
**Type :** 2D Asset (Sprite / UI Element)
**Résolution :** 1024x1024px (Downscalé in-engine pour Retina UI).
**Canaux :** RGBA (Transparence parfaite).
**Direction Artistique :**
- **Style :** "Skeuomorphisme Holographique". Les icônes ne sont pas plates. Ce sont des objets 3D rendus en 2D isométrique, fabriqués en `Liquid Glass`.
- **Détails :** Le Bank App (`icon_apps_01.png`) montre un coffre translucide rempli de lumière dorée. Le mMaps App (`icon_apps_03.png`) montre une topographie neon cyan enferrée dans un cube de verre.
- **Bordures :** Un léger liseré blanc/bleu très fin (1px) sur le bord supérieur gauche pour simuler l'éclat de lumière et détacher l'icône du background de l'OS.

### 📁 Fichiers : `public/assets/textures/ui/logo_mcompany.png` & `logo_neocity.png` (2 Fichiers)
**Type :** 2D Asset (Branding)
**Résolution :** 2048x1024px et 2048x2048px.
**Direction Artistique :** Le logo "m" de mCompany doit avoir des déclinaisons de masques (Masque de brillance, Masque d'opacité) pour pouvoir être incrusté comme un filigrane animé sur un fond de verre dans le menu de démarrage. Le design est menaçant par sa perfection clinique absolue.

---

## 13. mOS ASSETS : WALLPAPERS & BACKDROPS (10 Fichiers)
Fonds d'écran dynamiques floutés et textures de verre pour l'UI du smartphone ("PhoneWrapper") et l'écran de pause.

### 📁 Fichiers : `public/assets/textures/ui/bg_glass_01.png` à `bg_glass_05.png` (5 Fichiers)
**Type :** 2D Asset (Material mask)
**Résolution :** 2048x2048px (Seamless/Tilable).
**Direction Artistique :**
- **Textures de "Verre Givré" (Frosted Glass) :** Ces textures servent de `Normal Map` et de `Roughness Map` combinées pour le material UI dans le moteur. Elles permettent de distordre le rendu de la caméra avec un bruit organique (condensations, empreintes digitales subtiles, micro-rayures). 
- Permet l'effet `backdrop-filter: blur()` avec des imperfections physiques (Dirt Mask sur l'écran du joueur).

### 📁 Fichiers : `public/assets/textures/ui/wp_dynamic_01.png` à `wp_dynamic_05.png` (5 Fichiers)
**Type :** 2D Asset / SpriteSheet (Backgrounds)
**Résolution :** 1080x1920px (Format Portrait pour le Phone).
**Direction Artistique :**
- **Thèmes :** Abstrait "Fluid Simulation" (Bleu mCompany, Rouge sang synthétique, Noir Abyssal).
- **Rendu :** Les images doivent ressembler à de l'encre diffusée dans du gel neutre, ou à une macro-photographie d'œil synthétique. Très fort contraste. Doit être lisible derrière le verre flouté de l'OS.

---

## 14. DIEGETIC HUD : WIDGETS & DECALS (10 Fichiers)
Éléments projetés directement dans la vision du joueur (Sensory Implants). 

### 📁 Fichiers : `public/assets/textures/ui/hud_crosshair_01.png` à `hud_crosshair_04.png` (4 Fichiers)
**Type :** 2D Asset (Reticle)
**Résolution :** 512x512px.
**Direction Artistique :**
- Réticules militaires dynamiques. Traits vectoriels ultra-fins. Doivent paraître projetés sur la cornée de l'œil. Utilisent le vert cyan tactique par défaut, virant au rouge sombre (Blood Red) au survol d'une cible hostile (Lock-on). Une légère aberration chromatique permanente est cuite dans les bords du PNG pour simuler le lentillage AR.

### 📁 Fichiers : `public/assets/textures/ui/screen_fx_damage_01.png` à `screen_fx_damage_03.png` (3 Fichiers)
**Type :** 2D Asset (Screen Vignette Overlay)
**Résolution :** 3840x2160px (4K Overlay).
**Direction Artistique :**
- **Glitch & Blood :** L'UI représentant les dégâts n'est pas "du sang sur l'écran" basique. C'est l'interface neuronale du joueur qui plante. Les textures incluent des artefacts d'écrans LCD brisés, des fuites de cristaux liquides avec des halos rouges et violets très saturés.

### 📁 Fichiers : `public/assets/textures/ui/minimap_scan_01.png` à `minimap_scan_03.png` (3 Fichiers)
**Type :** 2D Asset (Radar effects)
**Résolution :** 1024x1024px.
**Direction Artistique :**
- Textures de balayage radar (LIDAR). Points d'impacts topographiques. Cela servira pour la minimap sous forme de grille 3D filaire dont chaque point est rafraîchi par un faisceau circulaire de mapping environnemental. Aspect "Données Pures" avec contraste maximal (Noir pur / Cyan saturé).
