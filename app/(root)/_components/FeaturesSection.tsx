'use client'
import { motion } from 'framer-motion';
import { Zap, Palette, Wrench, Save, Smartphone, Rocket } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Lightning Fast',
    description: 'Optimized performance for seamless writing experience. Built with cutting-edge technology to ensure your content loads instantly and responds to every keystroke without delay.'
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: 'Beautiful Design',
    description: 'Modern, clean interface that lets you focus on content. Our distraction-free environment helps you concentrate on your writing without unnecessary clutter or overwhelming options.'
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'Rich Editor',
    description: 'Advanced formatting with TipTap editor integration. Create professional documents with headings, lists, quotes, code blocks, tables, and much more with our powerful editor.'
  },
  {
    icon: <Save className="w-8 h-8" />,
    title: 'Save',
    description: 'Never lose your work with save functionality. Your content is automatically saved and can be accessed from anywhere, ensuring peace of mind and data security.'
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: 'Responsive',
    description: 'Works perfectly on all devices and screen sizes. Whether you\'re on a desktop, tablet, or mobile phone, WriteFlow adapts to provide the best writing experience.'
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: 'Modern Stack',
    description: 'Built with Next.js, TypeScript, and Tailwind CSS. Our modern technology stack ensures reliability, performance, and scalability for all your writing needs.'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features-section" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Everything you need to create amazing content, all in one place
          </p>
        </motion.div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants} 
              className="card bg-base-100 border border-base-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer aspect-[4/3] group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="card-body h-full flex flex-col p-6">
                <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="card-title text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-base-content/70 flex-grow group-hover:text-base-content/90 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
