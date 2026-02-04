/**
 * Mobile Performance Optimizations for Animations
 * Reduces animation complexity and frame rate on mobile devices
 */

import { useEffect, useState } from "react";

/**
 * Hook to detect if device is mobile and prefers reduced motion
 */
export const useAnimationOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      return isMobileDevice;
    };

    // Check for prefers-reduce-motion
    const checkReducedMotion = () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      setPrefersReducedMotion(prefersReduced);
      return prefersReduced;
    };

    checkMobile();
    checkReducedMotion();

    // Listen for changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      checkReducedMotion();
    };

    mediaQuery.addEventListener("change", handleChange);

    // Disable animations on mobile or if motion is reduced
    setShouldAnimate(!(checkMobile() || checkReducedMotion()));

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return { isMobile, prefersReducedMotion, shouldAnimate };
};

/**
 * Optimized animation configuration for mobile
 */
export const animationConfig = {
  // Fast animations for mobile (reduced duration)
  fast: {
    duration: 0.2,
    ease: "easeOut",
  },
  // Standard animations
  normal: {
    duration: 0.3,
    ease: "easeOut",
  },
  // Use this for mobile only
  mobile: {
    duration: 0.15,
    ease: "easeOut",
  },
};

/**
 * Get animation duration based on device
 */
export const getAnimationDuration = (
  isMobile: boolean,
  desktopDuration: number = 0.6,
  mobileDuration: number = 0.2
) => {
  return isMobile ? mobileDuration : desktopDuration;
};

/**
 * Disable animations on scroll for better performance
 * Useful for preventing animation lag during scrolling
 */
export const useScrollAnimationPause = () => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return isScrolling;
};

/**
 * Optimized motion values for mobile
 */
export const getMobileOptimizedMotionValues = (
  isMobile: boolean,
  desktopValues: { [key: string]: any },
  mobileValues: { [key: string]: any }
) => {
  return isMobile ? mobileValues : desktopValues;
};

/**
 * Will-change hint for performance
 * Add to elements that will be animated
 */
export const animationClasses = {
  // For elements being animated
  animated: "will-change-transform",
  // For elements with opacity changes
  fadeAnimated: "will-change-opacity",
  // Combination
  full: "will-change-transform will-change-opacity",
};

/**
 * Request animation frame wrapper for better performance
 */
export const useRAF = (callback: () => void, isActive: boolean = true) => {
  useEffect(() => {
    if (!isActive) return;

    let animationId: number;

    const animate = () => {
      callback();
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [callback, isActive]);
};

/**
 * Debounce animations on window resize
 */
export const useDebounceAnimation = (
  callback: () => void,
  delay: number = 300
) => {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(callback, delay);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [callback, delay]);
};

export default {
  useAnimationOptimization,
  useScrollAnimationPause,
  animationConfig,
  getAnimationDuration,
  getMobileOptimizedMotionValues,
  animationClasses,
  useRAF,
  useDebounceAnimation,
};
