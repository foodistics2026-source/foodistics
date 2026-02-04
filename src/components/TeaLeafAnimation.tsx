import { motion } from 'framer-motion';

interface TeaLeafAnimationProps {
  count?: number;
  speed?: number;
  opacity?: number;
}

export const TeaLeafAnimation = ({
  count = 5,
  speed = 20,
  opacity = 0.15,
}: TeaLeafAnimationProps) => {
  const leaves = Array.from({ length: count }, (_, i) => i);

  const floatingVariants = {
    animate: (i: number) => ({
      y: [-20, -100],
      x: [0, Math.sin(i) * 100],
      opacity: [opacity, 0],
      transition: {
        duration: speed,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: (i % 3) * 2,
      },
    }),
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {leaves.map((i) => (
        <motion.div
          key={i}
          className="absolute text-tea-gold"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            opacity: opacity,
          }}
          custom={i}
          variants={floatingVariants}
          animate="animate"
        >
          <svg
            className="w-8 h-8 md:w-12 md:h-12"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export const FloatingTeaLeaves = ({
  count = 3,
  speed = 15,
  opacity = 0.1,
}: TeaLeafAnimationProps) => {
  const leaves = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {leaves.map((i) => {
        const startX = (i / count) * 100;
        const randomDelay = Math.random() * 5;

        return (
          <motion.div
            key={i}
            className="absolute text-tea-gold"
            initial={{
              x: `${startX}%`,
              y: -50,
              opacity: 0,
            }}
            animate={{
              y: ['100vh', '-100px'],
              x: [`${startX}%`, `${startX + 30}%`],
              opacity: [0, opacity, opacity, 0],
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: 'linear',
              delay: randomDelay,
            }}
          >
            <svg
              className="w-6 h-6 md:w-10 md:h-10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TeaLeafAnimation;
