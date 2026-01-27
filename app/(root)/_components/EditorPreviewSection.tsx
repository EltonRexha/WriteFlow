"use client";
import { motion } from "framer-motion";

export default function EditorPreviewSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-base-200/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Experience the Editor
          </h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Our powerful editor with rich formatting capabilities
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-base-100 rounded-lg shadow-2xl overflow-hidden border border-base-300"
        >
          {/* Browser Header */}
          <div className="bg-base-200 border-b border-base-300 px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Browser Controls */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              {/* Address Bar */}
              <div className="flex-1 flex items-center bg-base-100 rounded-full px-4 py-2 border border-base-300">
                <svg className="w-4 h-4 text-base-content/50 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-base-content/70 font-mono">writeflow.app/</span>
              </div>
            </div>
          </div>
          
          {/* Browser Content */}
          <div className="relative w-full h-[650px] overflow-hidden bg-white">
            <iframe
              src="/editor-demo"
              className="absolute top-0 left-0 w-full h-full border-0"
              title="WriteFlow Editor Demo"
              scrolling="yes"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
