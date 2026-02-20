/**
 * LIFE RPG - Models Registry
 * Contient la définition de tous les 210 assets 3D (.glb)
 */

const generateModelsList = () => {
    const characters = [
        { id: 'char_hero_base', path: '/assets/models/characters/Hero_Base.glb', processShadows: true, hasBlendshapes: true }
    ];

    // NPC Archetypes (5 styles * 5 variants = 25)
    const npcStyles = ['Business', 'TechWear', 'StreetGang', 'Police', 'Medical'];
    npcStyles.forEach(style => {
        for (let i = 1; i <= 5; i++) {
            characters.push({
                id: `char_npc_${style.toLowerCase()}_${i}`,
                path: `/assets/models/characters/NPC_${style}_${i}.glb`,
                processShadows: true,
                hasBlendshapes: false
            });
        }
    });

    // Accessories (24 entries to reach 50 characters/accessories)
    for (let i = 1; i <= 24; i++) {
        const type = i % 4 === 0 ? 'Glasses_AR' : i % 4 === 1 ? 'Bag' : i % 4 === 2 ? 'Watch' : 'Mask';
        characters.push({
            id: `acc_${type.toLowerCase()}_${i}`,
            path: `/assets/models/characters/Accessories/${type}_${i}.glb`,
            processShadows: true,
            hasBlendshapes: false
        });
    }

    const vehicles = [];
    // Sports Cars (15)
    for (let i = 1; i <= 15; i++) {
        vehicles.push({
            id: `veh_sportscar_${i}`,
            path: `/assets/models/vehicles/SportsCar_${i}.glb`,
            processShadows: true,
            hasBlendshapes: false
        });
    }
    // Drones & Aerial (15)
    for (let i = 1; i <= 15; i++) {
        vehicles.push({
            id: `veh_drone_${i}`,
            path: `/assets/models/vehicles/Drone_${i}.glb`,
            processShadows: true,
            hasBlendshapes: false
        });
    }
    // Motos & Heavy (10)
    for (let i = 1; i <= 10; i++) {
        vehicles.push({
            id: `veh_heavy_${i}`,
            path: `/assets/models/vehicles/Heavy_${i}.glb`,
            processShadows: true,
            hasBlendshapes: false
        });
    }

    const buildings = [];
    // Modules de Rue (30)
    for (let i = 1; i <= 30; i++) {
        buildings.push({
            id: `prop_street_${i}`,
            path: `/assets/models/buildings/StreetModule_${i}.glb`,
            processShadows: true,
            hasBlendshapes: false
        });
    }
    // Structures (40)
    for (let i = 1; i <= 40; i++) {
        buildings.push({
            id: `bld_structure_${i}`,
            path: `/assets/models/buildings/Structure_${i}.glb`,
            processShadows: true,
            hasBlendshapes: false
        });
    }
    // Interior Props (30)
    for (let i = 1; i <= 30; i++) {
        buildings.push({
            id: `prop_interior_${i}`,
            path: `/assets/models/buildings/InteriorProp_${i}.glb`,
            processShadows: true,
            hasBlendshapes: false
        });
    }

    const weapons = [];
    // Tactical (20)
    for (let i = 1; i <= 20; i++) {
        weapons.push({
            id: `wep_tactical_${i}`,
            path: `/assets/models/weapons/Tactical_${i}.glb`,
            processShadows: true,
            hasBlendshapes: false
        });
    }

    return { characters, vehicles, buildings, weapons };
};

export const ModelsRegistry = generateModelsList();
