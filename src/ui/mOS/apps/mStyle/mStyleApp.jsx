import React, { useState } from 'react';
import './mStyle_Liquid.css';
import { CategorySelector } from './CategorySelector';
import { AvatarPreviewer } from './AvatarPreviewer';
import { SkinManager } from './SkinManager';
import { ColorPicker } from './ColorPicker';

export const MStyleApp = () => {
    const [activeCategory, setActiveCategory] = useState('Head');

    return (
        <div className="mstyle-container">
            <div className="mstyle-sidebar">
                <div className="mstyle-header">mStyle</div>
                <CategorySelector active={activeCategory} onSelect={setActiveCategory} />
            </div>

            <div className="mstyle-content">
                <AvatarPreviewer />
            </div>

            <div className="mstyle-panels">
                {activeCategory === 'Head' && <SkinManager />}
                {activeCategory === 'Hair' && <ColorPicker title="Hair Color" />}
                {activeCategory === 'Eyes' && <ColorPicker title="Eye Color" />}
            </div>
        </div>
    );
};

export default MStyleApp;
