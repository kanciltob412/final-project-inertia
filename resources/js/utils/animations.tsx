import { Animation, AnimationContainer } from '@/types/types';

// Shared animation configurations
export const fadeIn: Animation = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1.2, ease: 'easeOut' },
};

export const fadeInLeft: Animation = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 1.2, ease: 'easeOut' },
};

export const fadeInRight: Animation = {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 1.2, ease: 'easeOut' },
};

export const staggerContainer: AnimationContainer = {
    initial: {},
    whileInView: {
        transition: {
            staggerChildren: 0.4,
        },
    },
    viewport: { once: true },
};

export const scaleIn: Animation = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 1.2, ease: 'easeOut' },
};

export const pageTransition: Animation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.8, ease: 'easeInOut' },
};
