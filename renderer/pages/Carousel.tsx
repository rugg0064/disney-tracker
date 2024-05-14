import React, { useState, useEffect, useRef } from 'react';
import styles from './carousel.module.css';

const Carousel = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalChildren = React.Children.count(children);
    const timeoutRef = useRef(null);

    const nextSlide = () => {
        console.log("Slide activated")
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalChildren);
    };

    useEffect(() => {
        timeoutRef.current = setTimeout(nextSlide, 3000); // Change slide every 30 seconds

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [currentIndex]);

    return (
        <div className="carousel-container">
            <div className="carousel-wrapper">
                {React.Children.map(children, (child, index) => (
                    <div
                        key={index}
                        className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
                    >
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
