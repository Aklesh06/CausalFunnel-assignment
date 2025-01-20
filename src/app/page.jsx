'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Start() {

  const[email,setEmail] = useState('');
  const router = useRouter();

  const navigatetoquize = (e) => {
    e.preventDefault();
    router.push(`/quizeDash/${email}`);
  }

  const text = "Quiz For All";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        type: 'spring',
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: -50},
    visible: { opacity: 1, y: 0 },
  };


  return (
    <>
      <div className="h-screen flex flex-col gap-3 justify-center items-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-5xl lg:text-7xl font-bold flex space-x-1 text-center"
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={childVariants}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char} 
          </motion.span>
        ))}
      </motion.div>
        <form
          className="bg-violet-200 p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg"
          onSubmit={navigatetoquize}
        >
          <h2 className="text-foreground text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Enter Your Email</h2>
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 md:p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            type="submit"
            className="w-full py-2 px-3 md:py-3 md:px-4 bg-violet-400 text-background font-semibold rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>

    </>
  );
}
