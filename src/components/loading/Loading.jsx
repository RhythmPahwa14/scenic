import React from 'react';
import './loading.scss';

const Loading = ({ size = 'medium' }) => {
    return (
        <div className={`loading-container ${size}`}>
            <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Loading amazing content...</p>
        </div>
    );
};

export default Loading;