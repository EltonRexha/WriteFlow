'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to Start Writing?</h2>
          <p className="text-xl text-base-content/70 mb-8">
            Create amazing content with WriteFlow
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/auth/sign-up">
            <button className="btn btn-primary btn-lg">
              Create Free Account
            </button>
          </Link>
          <Link href="/auth/sign-in">
            <button className="btn btn-outline btn-lg">
              Sign In
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
