import React from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';

const AnimatedMenu = ({
  children,
  isMenuOpen,
}: {
  children: React.ReactNode;
  isMenuOpen: boolean;
}) => {
  return (
    <>
      <div className="hidden md:block">
        <motion.div
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{
            ease: 'easeIn',
            damping: 10,
            type: 'spring',
            duration: 0.2,
          }}
          className="flex sticky flex-row gap-2 lg:items-center p-2 top-2 left-2 lg:left-0 lg:right-0 lg:top-auto lg:fixed lg:bottom-2 z-10 bg-base-300 m-auto w-min rounded-2xl"
        >
          {children}
        </motion.div>
      </div>
      <div className="block md:hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1, transformOrigin: 'top left' }}
          className={clsx(
            'flex flex-col fixed gap-2 p-2 top-14 left-2 z-10 bg-base-300 w-min rounded-xl',
            isMenuOpen ? 'flex' : 'hidden'
          )}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
};

export default AnimatedMenu;
