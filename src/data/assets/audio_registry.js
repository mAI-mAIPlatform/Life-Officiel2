/**
 * LIFE RPG - Audio Registry
 * Contient la définition des 110 assets audio (.mp3 / .wav)
 */

const generateAudioList = () => {
    const sfx = [];
    // Combat, City_Life, Vehicles (80 SFX total)
    const categories = ['Combat', 'CityLife', 'Vehicles'];
    categories.forEach(cat => {
        let count = cat === 'Combat' ? 30 : (cat === 'CityLife' ? 30 : 20);
        for (let i = 1; i <= count; i++) {
            sfx.push({
                id: `sfx_${cat.toLowerCase()}_${i}`,
                path: `/assets/audio/sfx/${cat}/${cat}_${i}.wav`,
                is3D: true,
                loop: false,
                baseVolume: 1.0
            });
        }
    });

    const ambient = [];
    // Soundscapes (10)
    for (let i = 1; i <= 10; i++) {
        ambient.push({
            id: `amb_soundscape_${i}`,
            path: `/assets/audio/ambient/Soundscape_${i}.mp3`,
            is3D: false,
            loop: true,
            baseVolume: 0.5
        });
    }

    const radio = [];
    // Stations (20)
    for (let i = 1; i <= 20; i++) {
        radio.push({
            id: `radio_station_${i}`,
            path: `/assets/audio/radio/Station_${i}.mp3`,
            is3D: false,
            loop: true,
            baseVolume: 0.8
        });
    }

    return { sfx, ambient, radio };
};

export const AudioRegistry = generateAudioList();
