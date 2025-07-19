"use client";

import Header from "../components/Header";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function LandingPage() {
  const sections = [
    {
      title: "BIENVENUE CHEZ DIDA SKIN",
      description: "Votre sanctuaire de beauté et de bien-être.",
      imageSrc:
        "https://media.istockphoto.com/id/1304547222/photo/glamour-portrait-of-beautiful-woman.jpg?s=612x612&w=0&k=20&c=kiRKdJDxdqEz-lXRCqAuDzEoNsTk-_NZ-SsB2OLGM8Y=",
      callToAction: "DÉCOUVRIR NOS SERVICES",
    },
    {
      title: "POUR VOTRE VISAGE",
      description: "Des soins experts pour une peau éclatante.",
      imageSrc:
        "https://media.istockphoto.com/id/1442556244/photo/portrait-of-young-beautiful-woman-with-perfect-smooth-skin-isolated-over-white-background.jpg?s=612x612&w=0&k=20&c=4S7HufG4HDXznwuxFdliWndEAcWGKGvgqC45Ig0Zqog=",
      callToAction: "EXPLORER LES SOINS VISAGE",
    },
    {
      title: "POUR VOTRE CORPS",
      description: "Détente et revitalisation pour une silhouette harmonieuse.",
      imageSrc:
        "https://plus.unsplash.com/premium_photo-1677283511146-52fa442feb2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2tpbmNhcmV8ZW58MHx8MHx8fDA%3D",
      callToAction: "DÉCOUVRIR LES SOINS CORPS",
    },
    {
      title: "POUR VOS CHEVEUX",
      description: "Des traitements capillaires pour une chevelure sublime.",
      imageSrc:
        "https://images.unsplash.com/photo-1516220362602-dba5272034e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIyfHxza2luY2FyZXxlbnwwfHwwfHx8MA%3D%3D",
      callToAction: "VOIR LES SOINS CAPILLAIRES",
    },
    {
      title: "POUR VOS ONGLES",
      description: "Manucure et pédicure pour des mains et pieds impeccables.",
      imageSrc: "/images/nail-care-hero.png",
      callToAction: "RÉSERVER UNE SÉANCE ONGLES",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayIndex, setOverlayIndex] = useState(null); // index of the section being animated in/out
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const sectionCount = sections.length;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReverse, setIsReverse] = useState(false); // true if animating out (scroll up)

  // Scroll navigation handler
  const handleWheel = useCallback(
    (e) => {
      if (isAnimating) return;
      if (e.deltaY > 0 && activeIndex < sectionCount - 1) {
        setDirection(1);
        setOverlayIndex(activeIndex + 1);
        setIsReverse(false);
        setIsAnimating(true);
      } else if (e.deltaY < 0 && activeIndex > 0) {
        setDirection(-1);
        setOverlayIndex(activeIndex);
        setIsReverse(true);
        setIsAnimating(true);
      }
    },
    [activeIndex, sectionCount, isAnimating]
  );

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      handleWheel(e);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [handleWheel]);

  // When animation completes, update the active section and clean up overlay
  const handleOverlayAnimationComplete = () => {
    if (isReverse) {
      setActiveIndex((prev) => prev - 1);
    } else if (overlayIndex !== null) {
      setActiveIndex(overlayIndex);
    }
    setOverlayIndex(null);
    setIsAnimating(false);
    setIsReverse(false);
  };

  // Optional: prevent scroll on body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Animation variants for overlay effect
  const variants = {
    initial: (direction) => ({
      y: isReverse ? 0 : direction > 0 ? "100%" : "-100%",
      opacity: 1,
      zIndex: 2,
    }),
    animate: {
      y: 0,
      opacity: 1,
      zIndex: 2,
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    exit: (direction) => ({
      y: isReverse ? "100%" : 0,
      opacity: 1,
      zIndex: 2,
      transition: { duration: 0.7, ease: "easeInOut" },
    }),
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Header />
      {/* Render the current section as fixed background */}
      <div
        className="fixed top-0 left-0 h-screen w-full flex flex-col items-center justify-end p-12 text-center text-white bg-cover bg-center pt-[80px]"
        style={{
          backgroundImage: `url(${
            sections[
              isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
            ].imageSrc
          })`,
          zIndex: 1,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 mb-12">
          <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4 drop-shadow-lg">
            {
              sections[
                isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
              ].title
            }
          </h2>
          <p className="text-lg md:text-xl mb-8 drop-shadow-lg">
            {
              sections[
                isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
              ].description
            }
          </p>
          <button className="px-8 py-3 border border-white text-white text-sm font-medium tracking-wide hover:bg-white hover:text-black transition-colors duration-300">
            {
              sections[
                isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
              ].callToAction
            }
          </button>
        </div>
      </div>
      {/* Animate the overlay section only when animating */}
      <AnimatePresence>
        {isAnimating && overlayIndex !== null && (
          <motion.section
            key={overlayIndex + "-" + isReverse}
            custom={direction}
            variants={variants}
            initial="initial"
            animate={isReverse ? "exit" : "animate"}
            exit=""
            className="fixed top-0 left-0 h-screen w-full flex flex-col items-center justify-end p-12 text-center text-white bg-cover bg-center pt-[80px]"
            style={{
              backgroundImage: `url(${
                sections[isReverse ? activeIndex : overlayIndex].imageSrc
              })`,
              zIndex: 2,
            }}
            onAnimationComplete={handleOverlayAnimationComplete}
          >
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 mb-12">
              <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4 drop-shadow-lg">
                {sections[isReverse ? activeIndex : overlayIndex].title}
              </h2>
              <p className="text-lg md:text-xl mb-8 drop-shadow-lg">
                {sections[isReverse ? activeIndex : overlayIndex].description}
              </p>
              <button className="px-8 py-3 border border-white text-white text-sm font-medium tracking-wide hover:bg-white hover:text-black transition-colors duration-300">
                {sections[isReverse ? activeIndex : overlayIndex].callToAction}
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
