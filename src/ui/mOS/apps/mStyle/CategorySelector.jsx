import React from 'react';

const categories = ['Head', 'Hair', 'Eyes', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];

export const CategorySelector = ({ active, onSelect }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`category-btn ${active === cat ? 'active' : ''}`}
                    onClick={() => onSelect(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};
