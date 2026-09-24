import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ComingSoon: React.FC = () => {
    const [isNotified, setIsNotified] = useState(false);
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden z-10 w-full selection:bg-gold selection:text-black">
            
            <div className="z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    className="mb-6 inline-block"
                >
                    <span className="text-gold tracking-[0.3em] uppercase text-xs md:text-sm font-semibold px-4 py-2 border border-gold/30 rounded-full bg-black/20 backdrop-blur-md">
                        Something extraordinary is brewing
                    </span>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-6"
                    style={{
                        background: 'linear-gradient(to bottom right, #FFFFFF 20%, #C5A059 80%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    COMING SOON
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100px" }}
                    transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
                    className="h-[2px] bg-gold/50 mb-8"
                />

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="text-gray-300 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed mb-12 font-light"
                >
                    We are crafting a digital experience that will redefine boundaries. 
                    Stay tuned as we prepare to launch our masterpiece.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.8 }}
                >
                    <button 
                        onClick={() => setIsNotified(true)}
                        className="relative px-10 py-4 bg-transparent border-none group cursor-pointer overflow-hidden"
                    >
                        <span className="absolute inset-0 w-full h-full border border-gold/50 rounded-sm"></span>
                        <span className="absolute bottom-0 left-0 w-full h-full bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out z-0"></span>
                        <span className="relative z-10 text-gold group-hover:text-black transition-colors duration-700 tracking-[0.2em] text-sm font-bold uppercase">
                            {isNotified ? 'Thank You' : 'Notify Me'}
                        </span>
                    </button>
                </motion.div>
            </div>
            
            {/* Subtle bottom text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 2, delay: 2.5 }}
                className="absolute bottom-8 left-0 w-full text-center text-xs tracking-[0.2em] text-gray-500 uppercase"
            >
                Tech Master © {new Date().getFullYear()}
            </motion.div>
        </div>
    );
};
