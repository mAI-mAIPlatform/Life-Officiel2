/**
 * LIFE RPG - Global Constants Configuration
 * Ce fichier contient absolument toutes les constantes d'équilibrage et de configuration
 * du jeu, y compris le moteur physique, le moteur de rendu 3D, l'UI, et le gameplay.
 */

export const EngineConfig = {
    // Rendus & Graphismes
    RENDERER: {
        ENABLE_SHADOWS: true,
        SHADOW_MAP_TYPE: 2, // PCFSoftShadowMap
        ANTIALIAS: true,
        PIXEL_RATIO: Math.min(window.devicePixelRatio, 2),
        POWER_PREFERENCE: 'high-performance',
        PRECISION: 'highp',
        PHYSICALLY_CORRECT_LIGHTS: true,
        TONE_MAPPING: 3, // ACESFilmicToneMapping
        TONE_MAPPING_EXPOSURE: 1.2,
        LOGARITHMIC_DEPTH_BUFFER: false
    },
    // Boucle de Jeu
    LOOP: {
        FPS_TARGET: 60,
        PHYSICS_TICK_RATE: 1 / 60,
        MAX_SUB_STEPS: 3, // Cannon.js
        TIME_SCALE: 1.0 // Slow-mo support
    },
    // Caméra Globale
    CAMERA: {
        FOV: 75,
        NEAR_CLIP: 0.1,
        FAR_CLIP: 5000,
        DEFAULT_POSITION: [0, 5, 10], // x, y, z
        DEFAULT_TARGET: [0, 0, 0]
    }
};

export const PhysicsConfig = {
    GRAVITY: [0, -9.81, 0],
    BROADPHASE: 'SAP', // Sweep and prune
    ITERATIONS: 10,
    TOLERANCE: 0.001,
    MATERIALS: {
        DEFAULT: { friction: 0.3, restitution: 0.2 },
        PLAYER: { friction: 0.0, restitution: 0.0 }, // La friction du joueur est contrôlée logiciellement
        VEHICLE: { friction: 0.8, restitution: 0.1 },
        ICE: { friction: 0.05, restitution: 0.1 },
        BOUNCY: { friction: 0.5, restitution: 0.9 },
        DIRT: { friction: 0.6, restitution: 0.0 }
    },
    COLLISION_GROUPS: {
        NONE: 0,
        STATIC: 1,
        DYNAMIC: 2,
        PLAYER: 4,
        NPC: 8,
        VEHICLES: 16,
        TRIGGERS: 32,
        RAYCAST: 64,
        ALL: 0xFFFF
    }
};

export const PlayerConfig = {
    MOVEMENT: {
        WALK_SPEED: 2.5,
        RUN_SPEED: 6.5,
        SPRINT_SPEED: 8.5,
        CROUCH_SPEED: 1.5,
        ACCELERATION: 40.0, // Force
        DECELERATION: 30.0,
        AIR_CONTROL: 0.3, // Multipilcateur dans les airs
        JUMP_FORCE: 6.5,
        MAX_SLOPE_ANGLE: Math.PI / 4, // 45 degrés
        TURN_SPEED: 10.0 // slerp speed
    },
    STATS: {
        MAX_HEALTH: 100,
        MAX_STAMINA: 100,
        MAX_HUNGER: 100,
        MAX_THIRST: 100,
        STAMINA_REGEN: 5.0, // par seconde
        STAMINA_DRAIN_SPRINT: 8.0,
        HUNGER_DRAIN_RATE: 0.05,
        THIRST_DRAIN_RATE: 0.08,
        HEALTH_REGEN_RESTED: 1.0 // Seulement si faim et soif sont hautes
    },
    CAMERA: {
        TPS_OFFSET: [0, 1.5, -3],
        TPS_OFFSET_AIM: [0.5, 1.5, -1.5],
        FPS_OFFSET: [0, 1.6, 0.2],
        MIN_PITCH: -Math.PI / 3,
        MAX_PITCH: Math.PI / 3,
        SENSITIVITY: 0.002,
        SMOOTHING: 0.1
    },
    INVENTORY: {
        MAX_WEIGHT: 50.0, // kg
        MAX_SLOTS: 30,
        QUICK_SLOTS: 4
    }
};

export const WorldConfig = {
    CHUNKS: {
        SIZE: 256, // Mètres
        VIEW_DISTANCE: 4, // Chunks
        LOD_LEVELS: 3
    },
    WEATHER: {
        STATES: ['CLEAR', 'CLOUDY', 'RAIN', 'STORM', 'FOGGY'],
        TRANSITION_SPEED: 0.001,
        RAIN_MAX_PARTICLES: 10000,
        FOG_DENSITY_MAX: 0.02
    },
    TIME: {
        REAL_SECONDS_PER_GAME_DAY: 1440, // 24 minutes pour une journée (1:60 ratio)
        START_TIME: 8 * 3600, // Commence à 8h00 AM
        DAWN_START: 5.5, // 5h30
        DUSK_START: 19.0 // 19h00
    },
    LIGHTING: {
        SUN_COLOR_MIDDAY: 0xffffff,
        SUN_COLOR_SUNSET: 0xff8c00,
        NIGHT_COLOR: 0x111122,
        AMBIENT_INTENSITY_DAY: 0.6,
        AMBIENT_INTENSITY_NIGHT: 0.1,
        SUN_INTENSITY_MAX: 2.0
    }
};

export const UIConfig = {
    Z_INDEX: {
        BACKGROUND: 0,
        WORLD_HUD: 10,
        MAIN_HUD: 20,
        MOS_BASE: 40,
        MOS_APPS: 50,
        MENUS: 100,
        NOTIFICATIONS: 200,
        CRITICAL_ALERTS: 1000
    },
    COLORS: {
        NEO_CYAN: '#00f3ff',
        NEO_PINK: '#ff00aa',
        NEO_PURPLE: '#b026ff',
        GLASS_BG: 'rgba(20, 20, 25, 0.7)',
        GLASS_BORDER: 'rgba(255, 255, 255, 0.1)',
        SUCCESS: '#00ff88',
        WARNING: '#ffaa00',
        DANGER: '#ff1100',
        TEXT_PRIMARY: '#ffffff',
        TEXT_SECONDARY: '#a0a0b0'
    },
    MOS: {
        WIDTH: 380,
        HEIGHT: 800,
        ANIMATION_DURATION: 0.5, // Secondes
        BATTERY_DRAIN_RATE: 0.005, // % par seconde (si allumé)
        APPS: [
            { id: 'bank', name: 'NeoBank', icon: '🏦', color: '#00ffaa' },
            { id: 'crypto', name: 'Krypto', icon: '📈', color: '#b026ff' },
            { id: 'maps', name: 'CityMap', icon: '🗺️', color: '#00f3ff' },
            { id: 'contracts', name: 'Gigs', icon: '📝', color: '#ffaa00' },
            { id: 'contacts', name: 'Messages', icon: '💬', color: '#00aaff' },
            { id: 'property', name: 'RealEstate', icon: '🏢', color: '#ff00aa' },
            { id: 'hack', name: 'NetRunner', icon: '💻', color: '#ff1100' },
            { id: 'camera', name: 'Lens', icon: '📷', color: '#ffffff' },
            { id: 'darkweb', name: 'Onion', icon: '🧅', color: '#333333' },
            { id: 'settings', name: 'Config', icon: '⚙️', color: '#888888' }
        ]
    }
};

export const AudioConfig = {
    MASTER_VOLUME: 1.0,
    SFX_VOLUME: 0.8,
    MUSIC_VOLUME: 0.5,
    VOICE_VOLUME: 0.9,
    AMBIENT_VOLUME: 0.6,
    SPATIALIZATION: {
        REF_DISTANCE: 2,
        MAX_DISTANCE: 100,
        ROLLOFF_FACTOR: 1
    }
};

export const InputBindings = {
    KEYBOARD: {
        MOVE_FORWARD: ['KeyW', 'ArrowUp'],
        MOVE_BACKWARD: ['KeyS', 'ArrowDown'],
        MOVE_LEFT: ['KeyA', 'ArrowLeft'],
        MOVE_RIGHT: ['KeyD', 'ArrowRight'],
        JUMP: ['Space'],
        SPRINT: ['ShiftLeft', 'ShiftRight'],
        CROUCH: ['ControlLeft', 'KeyC'],
        INTERACT: ['KeyE'],
        RELOAD: ['KeyR'],
        INVENTORY: ['KeyI', 'Tab'],
        OPEN_MOS: ['KeyM'],
        PAUSE: ['Escape', 'KeyP'],
        SWITCH_CAMERA: ['KeyV'],
        WEAPON_1: ['Digit1'],
        WEAPON_2: ['Digit2'],
        WEAPON_3: ['Digit3'],
        FLASHLIGHT: ['KeyF']
    },
    GAMEPAD: {
        MOVE_X: 'LeftStickX',
        MOVE_Y: 'LeftStickY',
        LOOK_X: 'RightStickX',
        LOOK_Y: 'RightStickY',
        JUMP: 'ButtonS',     // A / Cross
        SPRINT: 'LeftStick', // L3
        CROUCH: 'ButtonE',   // B / Circle
        INTERACT: 'ButtonW', // X / Square
        RELOAD: 'ButtonN',   // Y / Triangle
        L_TRIGGER: 'LeftTrigger', // Viser
        R_TRIGGER: 'RightTrigger',// Tirer
        OPEN_MOS: 'DPadUp',
        PAUSE: 'Start'
    }
};

export const EconomyConfig = {
    STARTING_MONEY: 2500, // EuroDollars / NeoCredits
    BANK: {
        INTEREST_RATE: 0.005, // 0.5% par jour in-game
        LOAN_MAX_MULTIPLIER: 5.0 // On peut emprunter jusqu'à 5x son net worth
    },
    CRYPTO: {
        VOLATILITY_MULTIPLIER: 1.0,
        UPDATE_INTERVAL: 60000, // Met à jour le marché toutes les minutes réelles
        MIN_FEE: 0.02 // 2% frais de transaction
    },
    JOBS: {
        PAYOUT_MULTIPLIERS: {
            BEGINNER: 1.0,
            INTERMEDIATE: 1.5,
            EXPERT: 2.5,
            MASTER: 5.0
        },
        ILLEGAL_RISK_MULTIPLIER: 3.0 // Les jobs illégaux paient 3 fois plus mais ajoutent de la "Heat"
    }
};

export const NPCConfig = {
    SPAWN: {
        MAX_ACTIVE: 100, // Nombre max de PNJ simultanés autour du joueur
        SPAWN_RADIUS_MIN: 50, // Mètres
        SPAWN_RADIUS_MAX: 150,
        DESPAWN_RADIUS: 200
    },
    TYPES: {
        CIVILIAN: { health: 50, speed: 2.0, behavior: 'WANDER' },
        POLICE: { health: 150, speed: 6.0, behavior: 'PATROL' },
        GANG: { health: 120, speed: 5.5, behavior: 'TERRITORY' },
        CORPORATE: { health: 80, speed: 2.5, behavior: 'ROUTE' },
        PARAMEDIC: { health: 100, speed: 4.5, behavior: 'RESPOND' }
    },
    BRAIN: {
        UPDATE_RATE: 10, // Mises à jour IA par seconde
        VISION_CONE: Math.PI / 2, // 90 degrés
        HEARING_RADIUS: 25.0 // Mètres
    }
};

export const TrafficConfig = {
    MAX_CARS: 30,
    SPAWN_RADIUS: 150,
    DESPAWN_RADIUS: 200,
    LANE_WIDTH: 3.5,
    SPEED_LIMITS: {
        RESIDENTIAL: 10,  // m/s (~36 km/h)
        CITY: 15,         // m/s (~54 km/h)
        HIGHWAY: 30       // m/s (~108 km/h)
    }
};

export const SaveConfig = {
    DB_NAME: 'LifeRPG_SaveData',
    DB_VERSION: 1,
    AUTO_SAVE_INTERVAL: 300000, // 5 minutes
    MAX_SLOTS: 10,
    STORES: ['gamestate', 'player', 'world', 'economy', 'mos']
};

export const DebugConfig = {
    ENABLED: process.env.NODE_ENV === 'development',
    SHOW_FPS: true,
    SHOW_PHYSICS_COLLIDERS: false,
    SHOW_AI_PATHS: false,
    LOG_LEVEL: 'DEBUG' // TRACE, DEBUG, INFO, WARN, ERROR
};
