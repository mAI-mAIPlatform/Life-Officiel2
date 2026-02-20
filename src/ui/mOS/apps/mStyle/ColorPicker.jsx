import React, { useState } from 'react';

const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF',
    '#FFFFFF', '#888888', '#000000', '#FFA500', '#800080', '#008080'
];

export const ColorPicker = ({ title }) => {
    const [selected, setSelected] = useState(colors[0]);

    return (
        <div>
            <h3 style={{ marginBottom: '15px' }}>{title}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {colors.map((c) => (
                    <div
                        key={c}
                        className={`color-swatch ${selected === c ? 'selected' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setSelected(c)}
                        title={c}
                    />
                ))}
            </div>
        </div>
    );
};
