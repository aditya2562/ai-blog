"use client";
import React from "react";
import { motion as Motion } from "motion/react";
import { LampContainer } from "./ui/lamp";
 
const Hero = () => {
    return (
      <>
       <LampContainer>
        <Motion.h1
          initial={{ opacity: 0.5, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
        AI Tools
        <p className="text-base md:text-lg max-w-xl mx-auto text-zinc-400 font-light tracking-wider leading-loose italic">
          Unlock the future of productivity with beautifully crafted AI tools—designed to simplify, accelerate, and elevate your work.
        </p>
        </Motion.h1>
        </LampContainer>
        <hr></hr>
      </>
    )
  }
  
export default Hero