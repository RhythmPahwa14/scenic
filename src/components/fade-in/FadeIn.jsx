import React, { useEffect, useRef, useState } from 'react';
import './fade-in.scss';

const FadeIn = ({ children, delay = 0, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, delay);
                }
            },
            { threshold: 0.1 }
        );

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [delay]);

    return (
        <div
            ref={elementRef}
            className={`fade-in ${isVisible ? 'fade-in--visible' : ''} ${className}`}
        >
            {children}
        </div>
    );
};

export default FadeIn;