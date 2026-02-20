/**
 * LIFE RPG - Textures Registry
 * Contient la définition des 80 textures (.png / .webp)
 */

const generateTexturesList = () => {
    const environment = [];
    // Roads & Neon Signs (50)
    for (let i = 1; i <= 25; i++) {
        environment.push({
            id: `tex_road_${i}`,
            path: `/assets/textures/environment/Road_${i}.webp`,
            isColorMap: true,
            repeat: true
        });
        environment.push({
            id: `tex_neon_${i}`,
            path: `/assets/textures/environment/NeonSign_${i}.webp`,
            isColorMap: true,
            repeat: false
        });
    }

    const ui = [];
    // mOS Assets (30)
    for (let i = 1; i <= 30; i++) {
        ui.push({
            id: `tex_ui_mos_${i}`,
            path: `/assets/textures/ui/mOS_Asset_${i}.png`,
            isColorMap: true,
            repeat: false
        });
    }

    return { environment, ui };
};

export const TexturesRegistry = generateTexturesList();
