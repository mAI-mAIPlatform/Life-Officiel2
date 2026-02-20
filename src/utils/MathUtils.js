/**
 * LIFE RPG - Math & Geometry Utilities
 * Collection étendue de fonctions mathématiques pour la physique custom,
 * l'interpolation, la génération procédurale et la géométrie.
 * Zéro dépendance pour être utilisable dans n'importe quel contexte (WebWorkers par ex).
 */

export const MathUtils = {
    // ==============================================
    // CONSTANTES UTILES
    // ==============================================
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI / 2,
    QUARTER_PI: Math.PI / 4,
    DEG2RAD: Math.PI / 180.0,
    RAD2DEG: 180.0 / Math.PI,
    EPSILON: 1e-6,

    // ==============================================
    // FONCTIONS DE BASE & CLAMPING
    // ==============================================

    clamp: (value, min, max) => Math.max(min, Math.min(max, value)),

    clamp01: (value) => Math.max(0.0, Math.min(1.0, value)),

    lerp: (a, b, t) => a + (b - a) * MathUtils.clamp01(t),

    lerpUnclamped: (a, b, t) => a + (b - a) * t,

    inverseLerp: (a, b, value) => {
        if (a !== b) return MathUtils.clamp01((value - a) / (b - a));
        return 0.0;
    },

    mapRange: (value, inMin, inMax, outMin, outMax) => {
        return MathUtils.lerp(outMin, outMax, MathUtils.inverseLerp(inMin, inMax, value));
    },

    sign: (value) => (value >= 0.0 ? 1.0 : -1.0),

    approximately: (a, b, tolerance = MathUtils.EPSILON) => {
        return Math.abs(a - b) < tolerance;
    },

    // ==============================================
    // FONCTIONS D'ANGLES
    // ==============================================

    lerpAngle: (a, b, t) => {
        let delta = b - a;
        while (delta < -Math.PI) delta += MathUtils.TWO_PI;
        while (delta > Math.PI) delta -= MathUtils.TWO_PI;
        return a + delta * MathUtils.clamp01(t);
    },

    deltaAngle: (current, target) => {
        let delta = target - current;
        while (delta < -Math.PI) delta += MathUtils.TWO_PI;
        while (delta > Math.PI) delta -= MathUtils.TWO_PI;
        return delta;
    },

    smoothDampAngle: (current, target, currentVelocity, smoothTime, maxSpeed, deltaTime) => {
        target = current + MathUtils.deltaAngle(current, target);
        return MathUtils.smoothDamp(current, target, currentVelocity, smoothTime, maxSpeed, deltaTime);
    },

    // ==============================================
    // LISSAGE (SMOOTHING / SPRINGS)
    // ==============================================

    // Smoothstep interpolation (Hermite interpolation)
    smoothstep: (x, min, max) => {
        if (x <= min) return 0;
        if (x >= max) return 1;
        x = (x - min) / (max - min);
        return x * x * (3 - 2 * x);
    },

    smootherstep: (x, min, max) => {
        if (x <= min) return 0;
        if (x >= max) return 1;
        x = (x - min) / (max - min);
        return x * x * x * (x * (x * 6 - 15) + 10);
    },

    /**
     * Simule un ressort avec un amortissement critique.
     * Basé sur les mathématiques de "Game Programming Gems 4".
     * Modifie `currentVelocity` (doit être un objet référence comme { val: 0 })
     */
    smoothDamp: (current, target, currentVelocityRef, smoothTime, maxSpeed, deltaTime) => {
        smoothTime = Math.max(0.0001, smoothTime);
        const omega = 2.0 / smoothTime;
        const x = omega * deltaTime;
        const exp = 1.0 / (1.0 + x + 0.48 * x * x + 0.235 * x * x * x);
        let change = current - target;
        const originalTo = target;

        const maxChange = maxSpeed * smoothTime;
        change = MathUtils.clamp(change, -maxChange, maxChange);
        target = current - change;

        const temp = (currentVelocityRef.val + omega * change) * deltaTime;
        currentVelocityRef.val = (currentVelocityRef.val - omega * temp) * exp;
        let output = target + (change + temp) * exp;

        // Prévenir le "overshoot"
        if (originalTo - current > 0.0 === output > originalTo) {
            output = originalTo;
            currentVelocityRef.val = (output - originalTo) / deltaTime;
        }
        return output;
    },

    // ==============================================
    // GENERATION DE NOMBRES ALEATOIRES
    // ==============================================

    // Random flotteur entre min et max
    randRange: (min, max) => Math.random() * (max - min) + min,

    // Random entier inclusif
    randInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // Random Gaussien (distribution normale)
    randGaussian: (mean = 0, stdDev = 1) => {
        let u1 = Math.random();
        let u2 = Math.random();
        // Box-Muller transform
        let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(MathUtils.TWO_PI * u2);
        return z0 * stdDev + mean;
    },

    // Choisit un élément aléatoire dans un tableau
    randElement: (array) => {
        if (!array || array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    },

    // PRNG facile basé sur une seed (Mulberry32)
    seededRandom: (seed) => {
        return function () {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    },

    // ==============================================
    // VECTEURS (Utilitaires 3D pour éviter Three.js Vector3 parfois)
    // ==============================================

    vec3DistanceSq: (x1, y1, z1, x2, y2, z2) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
        return dx * dx + dy * dy + dz * dz;
    },

    vec3Distance: (x1, y1, z1, x2, y2, z2) => {
        return Math.sqrt(MathUtils.vec3DistanceSq(x1, y1, z1, x2, y2, z2));
    },

    vec2DistanceSq: (x1, y1, x2, y2) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return dx * dx + dy * dy;
    },

    vec2Distance: (x1, y1, x2, y2) => {
        return Math.sqrt(MathUtils.vec2DistanceSq(x1, y1, x2, y2));
    },

    // ==============================================
    // BRUIT DE PERLIN/SIMPLEX (Version simplifiée 2D pour Terrain/Météo)
    // ==============================================
    // Basé sur p5.js / Processing (Implémentation basique et rapide)

    _noiseGen: {
        PERLIN_YWRAPB: 4,
        PERLIN_YWRAP: 1 << 4,
        PERLIN_ZWRAPB: 8,
        PERLIN_ZWRAP: 1 << 8,
        PERLIN_SIZE: 4095,
        perlin_octaves: 4, // default to medium smooth
        perlin_amp_falloff: 0.5, // 50% reduction/octave
        perlin: null
    },

    noiseSeed: (seed) => {
        // LCG
        const lcg = () => {
            let m = 4294967296;
            let a = 1664525;
            let c = 1013904223;
            seed = (a * seed + c) % m;
            return seed / m;
        };
        MathUtils._noiseGen.perlin = new Array(MathUtils._noiseGen.PERLIN_SIZE + 1);
        for (let i = 0; i < MathUtils._noiseGen.PERLIN_SIZE + 1; i++) {
            MathUtils._noiseGen.perlin[i] = lcg();
        }
    },

    noise: (x, y = 0, z = 0) => {
        const gen = MathUtils._noiseGen;
        if (gen.perlin === null) {
            MathUtils.noiseSeed(Math.random());
        }

        if (x < 0) x = -x;
        if (y < 0) y = -y;
        if (z < 0) z = -z;

        let xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
        let xf = x - xi;
        let yf = y - yi;
        let zf = z - zi;
        let rxf, ryf;

        let r = 0;
        let ampl = 0.5;

        let n1, n2, n3;

        for (let o = 0; o < gen.perlin_octaves; o++) {
            let of = xi + (yi << gen.PERLIN_YWRAPB) + (zi << gen.PERLIN_ZWRAPB);

            rxf = MathUtils.smoothstep(xf, 0, 1);
            ryf = MathUtils.smoothstep(yf, 0, 1);

            n1 = gen.perlin[of & gen.PERLIN_SIZE];
            n1 += rxf * (gen.perlin[(of + 1) & gen.PERLIN_SIZE] - n1);
            n2 = gen.perlin[(of + gen.PERLIN_YWRAP) & gen.PERLIN_SIZE];
            n2 += rxf * (gen.perlin[(of + gen.PERLIN_YWRAP + 1) & gen.PERLIN_SIZE] - n2);
            n1 += ryf * (n2 - n1);

            of += gen.PERLIN_ZWRAP;
            n2 = gen.perlin[of & gen.PERLIN_SIZE];
            n2 += rxf * (gen.perlin[(of + 1) & gen.PERLIN_SIZE] - n2);
            n3 = gen.perlin[(of + gen.PERLIN_YWRAP) & gen.PERLIN_SIZE];
            n3 += rxf * (gen.perlin[(of + gen.PERLIN_YWRAP + 1) & gen.PERLIN_SIZE] - n3);
            n2 += ryf * (n3 - n2);

            n1 += MathUtils.smoothstep(zf, 0, 1) * (n2 - n1);

            r += n1 * ampl;
            ampl *= gen.perlin_amp_falloff;
            xi <<= 1;
            xf *= 2;
            yi <<= 1;
            yf *= 2;
            zi <<= 1;
            zf *= 2;

            if (xf >= 1.0) { xi++; xf--; }
            if (yf >= 1.0) { yi++; yf--; }
            if (zf >= 1.0) { zi++; zf--; }
        }
        return r;
    }
};
