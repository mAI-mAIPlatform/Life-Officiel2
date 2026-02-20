import React, { useState, useEffect } from 'react';

export const SkinManager = () => {
    const [palettes, setPalettes] = useState([]);

    useEffect(() => {
        // In a real scenario, this fetches from skin_palettes.json
        setPalettes([
            { id: 'skin_01', name: 'Pale' },
            { id: 'skin_05', name: 'Tan' },
            { id: 'skin_10', name: 'Dark' }
        ]);
    }, []);

    return (
        <div>
            <h3 style={{ marginBottom: '15px' }}>Skin Tones</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {palettes.map((p) => (
                    <div
                        key={p.id}
                        style={{
                            padding: '10px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {p.name}
                    </div>
                ))}
            </div>
        </div>
    );
};
