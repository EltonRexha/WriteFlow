"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import SignUp from "./SignUp";

const SignUpWrapper = () => {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Loader2 className="w-8 h-8 text-primary" />
          </motion.div>
          <p className="text-base-content/60 text-sm animate-pulse">
            Preparing sign up...
          </p>
        </div>
      }
    >
      <SignUp />
    </Suspense>
  );
};

export default SignUpWrapper;
