import React, { useEffect, useRef } from 'react';

export const AvatarPreviewer = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        console.log("AvatarPreviewer mounted. Connecting to Character Engine 3D Scene.");
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'radial-gradient(circle, rgba(0,240,255,0.1) 0%, rgba(0,0,0,0) 70%)'
            }}
        >
            <p style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                [3D Avatar Preview - Drag to Rotate]
            </p>
        </div>
    );
};
