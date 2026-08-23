import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const loadingSteps = [
  {
    title: "Thinking",
    subtitle: "Understanding your request...",
  },
  {
    title: "Reasoning",
    subtitle: "Working through the details...",
  },
  {
    title: "Analyzing",
    subtitle: "Finding the best approach...",
  },
  {
    title: "Generating",
    subtitle: "Creating your response...",
  },
  {
    title: "Refining",
    subtitle: "Making everything better...",
  },
  {
    title: "Almost there",
    subtitle: "Putting the final touches together...",
  },
];

const AILoadingAnimation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev === loadingSteps.length - 1) {
          return prev;
        }

        return prev + 1;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const currentStep = loadingSteps[step];

  return (
    <div className="flex w-full justify-start px-1 py-3">
      <div className="flex items-center gap-3">

        {/* AI Icon */}
        <motion.div
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Glow */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-indigo-500/20 blur-xl"
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.15, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            animate={{
              rotate: [0, -8, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="relative z-10 w-5 h-5 text-indigo-400" />
          </motion.div>
        </motion.div>

        {/* Status */}
        <div className="flex flex-col gap-1 min-w-[220px]">

          <div className="flex items-center gap-2">

            <AnimatePresence mode="wait">
              <motion.span
                key={currentStep.title}
                initial={{
                  opacity: 0,
                  y: 6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -6,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="text-sm font-medium text-white"
              >
                {currentStep.title}
              </motion.span>
            </AnimatePresence>

            {/* Animated dots */}
            <div className="flex gap-1">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                  animate={{
                    opacity: [0.25, 1, 0.25],
                    y: [0, -3, 0],
                  }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: dot * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep.subtitle}
              initial={{
                opacity: 0,
                y: 4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -4,
              }}
              transition={{
                duration: 0.25,
              }}
              className="text-xs text-slate-500"
            >
              {currentStep.subtitle}
            </motion.p>
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default AILoadingAnimation;