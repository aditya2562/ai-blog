"use client";
import React from "react";
import { motion as Motion} from "motion/react";
import { LampContainer } from "./ui/lamp";
 
const Hero = () => {
    return (
      <>
      {/* // <section className="bg-gradient-to-r from-green-600 to-indigo-700 text-white py-20 px-6 text-center">         */}
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
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Discover the smartest tools to boost your productivity and earn more with AI.
        </p>
        </Motion.h1>
        </LampContainer>
      {/* // </section> */}
      </>
    )
  }
  
export default Hero