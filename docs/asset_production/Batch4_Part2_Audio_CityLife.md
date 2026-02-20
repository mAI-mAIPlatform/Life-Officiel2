# DIRECTION ARTISTIQUE - BATCH 4: AUDIO SFX CITY LIFE (Part 2/3)
**Vision : Spatialisation HRTF | Qualité : AAA 96kHz/24bit (Source) -> 48k (In-Game)**

---

## 31. SFX CITY LIFE : DIEGETIC INTERACTIONS (10 Fichiers)
Le son des objets du quotidien que le joueur ou les PNJs utilisent. Ces sons ancrent la réalité visuelle.

### 📁 Fichiers : `public/assets/audio/sfx/city_life/door_auto_mcompany_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Foley & Mechanism)
**Caractéristiques :**
- **Synthèse :** Pas de gros servo-moteurs old-school. Ces portes sont mues par des champs magnétiques. Le son est un balayage de fréquence sinusoïdal très court (Chirp) suivi d'un bruit de succion pneumatique parfaitement aséptisé ("Tsss-whoosh"). 
- **Fermeture :** Le son de fermeture se termine par un tout petit "Click" de verrouillage biométrique (Très aigu, 8kHz).

### 📁 Fichiers : `public/assets/audio/sfx/city_life/vending_machine_drop_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Interaction)
**Caractéristiques :**
- **Synthèse :** Bruit lourd d'une boîte en aluminium frappant du métal, mais avec une petite fanfare synthétique de "récompense" (Arpège 3 notes 8-bit, nostalgique mais un peu cassé). La machine vocifère un "Merci mServices" robotique avec un pitch légèrement aléatoire (Glitch vocal).

---

## 32. SFX CITY LIFE : POLICE & SURVEILLANCE (10 Fichiers)
La pression constante du contrôle de mCompany. Les sons doivent générer de l'anxiété.

### 📁 Fichiers : `public/assets/audio/sfx/city_life/police_scanner_drone_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Looping Radius / Alert)
**Caractéristiques :**
- **Synthèse :** Le drone de sécurité émet un balayage radar (Sonar synthétique) toutes les 2 secondes : un "Bliiiip" à fréquence moyenne (800Hz) avec une longue réverbération. En cas de détection suspecte, ce "Bliiiip" s'accélère et monte en fréquence (jusqu'à 2kHz), comme un rythme cardiaque stressé.

### 📁 Fichiers : `public/assets/audio/sfx/city_life/announcement_pa_system_01.wav` à `05.wav` (5 Fichiers)
**Type :** Audio (Voice Over - FX Processed)
**Caractéristiques :**
- **Traitement :** Voix féminine ("CookIA" Voice) ou annonce publique. Le son traverse un plugin de simulation de haut-parleur de type "Tannoy" de rue (Filtre Bandpass très restrictif 400Hz - 4kHz), puis massivement noyé dans une réverbération "Slapback" pour simuler le rebond du son entre les murs de béton des rues (Reflets spatiaux à 150ms de délai).
- **Contenu :** Mises en garde subtiles sur la loyauté à mCompany, annonces de couvre-feu sectoriels, incitations à consommer mDream.
