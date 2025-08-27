import React from 'react';
import './animated-background.scss';

const AnimatedBackground = () => {
    return (
        <div className="animated-background">
            <div className="floating-shapes">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`shape shape-${i + 1}`}></div>
                ))}
            </div>
        </div>
    );
};

export default AnimatedBackground;