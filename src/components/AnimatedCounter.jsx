// src/components/AnimatedCounter.jsx
import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion"; // ✅ optional for fade-in animation

export default function AnimatedCounter({
  start = 0,
  end = 0,
  duration = 2,
  decimals = 0,
  prefix = "",
  suffix = "",
  delay = 0,
  style = {},
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <motion.span
      ref={ref}
      style={{ display: "inline-block", ...style }}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {inView ? (
        <CountUp
          start={start}
          end={end}
          duration={duration}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          separator=","
        />
      ) : (
        `${prefix}${start}${suffix}`
      )}
    </motion.span>
  );
}
