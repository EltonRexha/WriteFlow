'use client'
import Logo from '@/components/Logo';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="pb-16 pt-8 px-4 sm:px-6 lg:px-8 h-[100vh] flex flex-col items-center justify-between relative">
      <div className="max-w-7xl mx-auto text-center flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <Logo />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 leading-tight tracking-tight"
        >
          <span className="block bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent animate-gradient bg-300">
            Write Your Ideas
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Into Reality
          </span>
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/auth/sign-up">
            <button className="btn btn-primary btn-lg">
              Start Writing
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </Link>
          <Link href="/auth/sign-in">
            <button className="btn btn-outline btn-lg">
              Sign In
            </button>
          </Link>
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-0 left-0 right-0 text-center pb-4"
      >
        <motion.p 
          className="text-lg font-medium text-base-content/70 hover:text-primary transition-all duration-300 cursor-pointer inline-flex items-center gap-2 group"
          onClick={() => {
            const featuresSection = document.getElementById('features-section');
            featuresSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          View More
          <svg 
            className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.p>
      </motion.div>
    </section>
  );
}
