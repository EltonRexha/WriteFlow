'use client'
import { motion } from 'framer-motion';

export default function EditorPreviewSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-base-200/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Experience the Editor</h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Our powerful editor with rich formatting capabilities
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-base-100 rounded-lg border border-base-300 shadow-xl overflow-hidden"
        >
          <iframe 
            src="/editor-demo" 
            className="w-full h-[700px] border-0"
            title="WriteFlow Editor Demo"
          />
        </motion.div>
      </div>
    </section>
  );
}
