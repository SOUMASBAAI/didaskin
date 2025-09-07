"use client";

import Header from "../components/Header";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewsletterModal from "../components/NewsletterModal";
import { API_BASE_URL } from "../config/apiConfig";

export default function LandingPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Preloader states
  const [heroFetched, setHeroFetched] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setCategories(result.data);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // État du quiz
  const [quizState, setQuizState] = useState("playing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnsweredQuestion, setLastAnsweredQuestion] = useState(null);

  // Afficher le modal newsletter à l'ouverture du site (après 3 secondes)
  useEffect(() => {
    // Timer removed since NewsletterModal is no longer used
  }, []);

  // Fonction pour ouvrir le modal newsletter
  const handleOpenNewsletter = () => {
    setShowSubscribe(true);
  };

  // État pour les questions du quiz
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);

  // Fetch quiz questions from backend
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        setQuizLoading(true);
        const response = await fetch(`${API_BASE_URL}/quizzquestion`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Transform backend data to frontend format
            const transformedQuestions = result.data.map((q) => ({
              id: q.id,
              question: q.question,
              options: [q.choiceA, q.choiceB, q.choiceC, q.choiceD]
                .map((text, idx) => ({ text, originalIndex: idx }))
                .filter((opt) => opt.text && String(opt.text).trim() !== ""),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            }));
            console.log("Quiz questions fetched:", transformedQuestions);
            setQuizQuestions(transformedQuestions);
          } else {
            setQuizError(
              "Erreur lors de la récupération des questions du quiz"
            );
          }
        } else {
          setQuizError("Erreur lors de la récupération des questions du quiz");
        }
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        setQuizError("Erreur de connexion au serveur");
      } finally {
        setQuizLoading(false);
      }
    };

    fetchQuizQuestions();
  }, []);

  // Hero content
  const [hero, setHero] = useState({
    title: "BIENVENUE CHEZ DIDA SKIN",
    description: "Votre sanctuaire de beauté et de bien-être.",
    image: null,
    cta: "DÉCOUVRIR NOS SERVICES",
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/site-content/hero`);
        if (resp.ok) {
          const json = await resp.json();
          if (json?.success && json?.data) setHero(json.data);
        }
      } catch (e) {
        // keep defaults
      } finally {
        setHeroFetched(true);
      }
    };
    fetchHero();
  }, []);

  // Preload images (hero + category thumbnails) before showing page
  useEffect(() => {
    if (!heroFetched || loading) return;

    const fallbackHero =
      "https://media.istockphoto.com/id/1304547222/photo/glamour-portrait-of-beautiful-woman.jpg?s=612x612&w=0&k=20&c=kiRKdJDxdqEz-lXRCqAuDzEoNsTk-_NZ-SsB2OLGM8Y=";

    const urls = [];
    // Prefer hero image if set; otherwise fallback
    urls.push(hero.image || fallbackHero);
    // Preload first 3 category images if available
    categories.slice(0, 3).forEach((c) => {
      if (c?.image_link) urls.push(c.image_link);
    });

    const preload = (src) =>
      new Promise((resolve) => {
        if (!src) return resolve();
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    Promise.all(urls.map(preload)).then(() => setAssetsReady(true));
  }, [heroFetched, loading, hero.image, categories]);

  // Subscription modal state for form success/errors handled in component
  const [showSubscribe, setShowSubscribe] = useState(false);
  useEffect(() => {
    const hasShown = sessionStorage.getItem("subscribe_modal_shown") === "1";
    if (!hasShown) {
      const timer = setTimeout(() => {
        setShowSubscribe(true);
        sessionStorage.setItem("subscribe_modal_shown", "1");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Featured services for landing
  const [featured, setFeatured] = useState([]);
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const r = await fetch(`${API_BASE_URL}/services/featured`);
        const j = await r.json();
        if (j?.success) setFeatured(j.data || []);
      } catch {}
    };
    fetchFeatured();
  }, []);

  // Catalogue content (image) for landing catalogue section
  const [catalogueContent, setCatalogueContent] = useState({ image: null });
  useEffect(() => {
    const fetchCatalogue = async () => {
      try {
        const r = await fetch(`${API_BASE_URL}/site-content/catalogue`);
        if (r.ok) {
          const j = await r.json();
          if (j?.success && j?.data) {
            setCatalogueContent({ image: j.data.image || null });
          }
        }
      } catch {}
    };
    fetchCatalogue();
  }, []);

  // About content (image) for landing about section
  const [aboutContent, setAboutContent] = useState({
    image: null,
    description: null,
  });
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const r = await fetch(`${API_BASE_URL}/site-content/about`);
        if (r.ok) {
          const j = await r.json();
          if (j?.success && j?.data) {
            setAboutContent({
              image: j.data.image || null,
              description: j.data.description || null,
            });
          }
        }
      } catch {}
    };
    fetchAbout();
  }, []);

  // Create sections: first section + categories + quiz + footer
  const sections = [
    // Section 0: Page d'accueil (ne pas toucher)
    {
      title: hero.title,
      description: hero.description,
      imageSrc:
        hero.image ||
        "https://media.istockphoto.com/id/1304547222/photo/glamour-portrait-of-beautiful-woman.jpg?s=612x612&w=0&k=20&c=kiRKdJDxdqEz-lXRCqAuDzEoNsTk-_NZ-SsB2OLGM8Y=",
      callToAction: hero.cta,
      categoryId: null,
    },
    // Sections 1-3: Catégories dynamiques du backend (ou placeholders pendant le chargement)
    ...(loading
      ? [
          // Placeholders pendant le chargement
          {
            title: "CHARGEMENT...",
            description: "Chargement des catégories...",
            imageSrc: "/placeholder.svg",
            callToAction: "CHARGEMENT...",
            categoryId: null,
          },
          {
            title: "CHARGEMENT...",
            description: "Chargement des catégories...",
            imageSrc: "/placeholder.svg",
            callToAction: "CHARGEMENT...",
            categoryId: null,
          },
          {
            title: "CHARGEMENT...",
            description: "Chargement des catégories...",
            imageSrc: "/placeholder.svg",
            callToAction: "CHARGEMENT...",
            categoryId: null,
          },
        ]
      : categories.map((category, index) => ({
          title: category.label || `CATÉGORIE ${index + 1}`,
          description:
            category.shortDescription ||
            "Découvrez nos services exceptionnels.",
          imageSrc: category.image_link || "/placeholder.svg",
          callToAction: ` ${category.label?.toUpperCase() || "NOS SERVICES"}`,
          categoryId: category.id,
        }))),
    // Featured services as category-like sections
    ...featured.map((s) => ({
      title: s.label,
      description: "",
      imageSrc: s.image_link || "/placeholder.svg",
      callToAction: "VOIR LE SERVICE",
      serviceId: s.id,
    })),
    // Section: Explorer catalogue produits
    {
      title: "CATALOGUE PRODUIT",
      description: "Découvrez notre sélection de produits de soin.",
      imageSrc:
        catalogueContent.image ||
        "https://images.unsplash.com/photo-1556228724-4d8760c3d640?q=80&w=1600&auto=format&fit=crop",
      callToAction: "VOIR TOUS LES PRODUITS",
      navigateTo: "/products",
    },
    // Section: À propos du centre
    {
      title: "À PROPOS DU CENTRE",
      description: "",
      imageSrc: "none",
      isAbout: true,
      aboutImage:
        aboutContent.image ||
        "https://images.unsplash.com/photo-1551361983-f9cbd3a8a9b2?q=80&w=1600&auto=format&fit=crop",
      aboutText:
        aboutContent.description ||
        "Qui sommes-nous ? Dida Skin est un centre dédié au bien-être et à la beauté, où expertise et douceur se rencontrent pour révéler l'éclat naturel de votre peau.",
      callToAction: "PRENDRE UN RENDEZ-VOUS",
      navigateTo: "/booking",
    },
    // Section 4: Quiz (ne pas toucher)
    {
      title: "Quiz Dida Skin",
      description: "Testez vos connaissances sur nos soins et produits",
      callToAction: "Commencer le Quiz",
      imageSrc: "none",
      isQuiz: true,
      categoryId: null, // Pas de catégorie pour le quiz
    },
    // Section 5: Footer (ne pas toucher)
    {
      title: "CONTACTEZ-NOUS",
      description:
        "Prêt(e) à prendre soin de votre beauté ? Contactez-nous pour un rendez-vous personnalisé.",
      imageSrc: "none", // Pas d'image de background
      callToAction: "PRENDRE RENDEZ-VOUS",
      isFooter: true, // Marqueur pour identifier la section Footer
      categoryId: null, // Pas de catégorie pour le footer
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayIndex, setOverlayIndex] = useState(null); // index of the section being animated in/out
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const sectionCount = sections.length; // reflect actual rendered sections (hero + categories + featured + quiz + footer)
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReverse, setIsReverse] = useState(false); // true if animating out (scroll up)
  const [lastScrollTime, setLastScrollTime] = useState(0); // Pour éviter les scrolls multiples

  // Touch handling for mobile
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  // Navigation handler for category sections
  const handleCategoryClick = (categoryId) => {
    if (categoryId) {
      navigate(`/categories?category=${categoryId}`);
    }
  };

  // Common scroll logic for both wheel and touch
  const handleScroll = useCallback(
    (deltaY) => {
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime;

      // Protection contre les scrolls trop rapides (minimum 800ms entre chaque scroll)
      if (isAnimating || timeSinceLastScroll < 800) {
        return;
      }

      if (deltaY > 0 && activeIndex < sectionCount - 1) {
        setLastScrollTime(now);
        setDirection(1);
        setOverlayIndex(activeIndex + 1);
        setIsReverse(false);
        setIsAnimating(true);
      } else if (deltaY < 0 && activeIndex > 0) {
        setLastScrollTime(now);
        setDirection(-1);
        setOverlayIndex(activeIndex);
        setIsReverse(true);
        setIsAnimating(true);
      }
    },
    [activeIndex, sectionCount, isAnimating, lastScrollTime]
  );

  const scrollToNextSection = useCallback(() => {
    if (!isAnimating && activeIndex < sectionCount - 1) {
      const now = Date.now();
      setLastScrollTime(now);
      setDirection(1);
      setOverlayIndex(activeIndex + 1);
      setIsReverse(false);
      setIsAnimating(true);
    }
  }, [activeIndex, sectionCount, isAnimating]);

  // Scroll navigation handler for mouse wheel
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    },
    [handleScroll]
  );

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e) => {
    setTouchStartY(e.targetTouches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault(); // Prevent default scrolling
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      const touchEnd = e.changedTouches[0].clientY;
      setTouchEndY(touchEnd);

      const deltaY = touchStartY - touchEnd;
      const minSwipeDistance = 50; // Minimum swipe distance to trigger scroll

      if (Math.abs(deltaY) > minSwipeDistance) {
        handleScroll(deltaY);
      }
    },
    [touchStartY, handleScroll]
  );

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      handleWheel(e);
    };

    // Add wheel event for desktop
    window.addEventListener("wheel", onWheel, { passive: false });

    // Add touch events for mobile
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

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
    // Réinitialiser le temps de scroll pour permettre le prochain scroll
    setLastScrollTime(0);
  };

  // Optional: prevent scroll on body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Fonctions pour gérer le quiz
  const handleAnswerSelect = (questionId, answerIndex) => {
    if (quizQuestions.length === 0) return;

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
    setLastAnsweredQuestion({ id: questionId, answer: answerIndex });
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
      setLastAnsweredQuestion(null);
    } else {
      setQuizState("results");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRestartQuiz = () => {
    setQuizState("playing");
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowFeedback(false);
    setLastAnsweredQuestion(null);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

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

  // Subscription modal state for form success/errors handled in component

  // If assets not ready, show full-screen loading layout
  if (!assetsReady) {
    return (
      <div
        className="relative h-screen w-screen overflow-hidden bg-[#F5F1ED] flex items-center justify-center"
        style={{ height: "100vh", height: "100dvh" }}
      >
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-light tracking-wider text-gray-800 mb-4">
            DIDA SKIN
          </h1>

          <p className="text-sm text-gray-600 mb-6">
            Chargement de l'expérience…
          </p>
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 border-2 border-[#D4A574] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="landing-root relative h-screen w-screen overflow-hidden bg-transparent"
      style={{ height: "100vh", height: "100dvh" }}
    >
      <Header />
      {/* Render the current section as fixed background */}
      <div
        className={`fixed top-0 left-0 w-full flex flex-col bg-cover bg-center pt-[80px] ${
          sections[isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex]
            .isQuiz
            ? "items-center justify-center px-4 py-8 md:p-12 text-center"
            : sections[
                isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
              ].isAbout
            ? "items-center justify-center p-12 text-center"
            : sections[
                isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
              ].isFooter
            ? "items-start justify-start p-12 text-left"
            : "items-center justify-end p-12 text-center"
        }`}
        style={{
          height: "100vh",
          height: "100dvh",
          backgroundImage:
            sections[
              isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
            ].imageSrc === "none"
              ? "none"
              : `url(${
                  sections[
                    isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
                  ].imageSrc
                })`,
          backgroundColor:
            sections[
              isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
            ].imageSrc === "none"
              ? "#F5F1ED"
              : "transparent",
          zIndex: 1,
        }}
      >
        <div
          className={`absolute inset-0 ${
            sections[
              isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
            ].imageSrc === "none"
              ? "bg-[#F5F1ED]"
              : "bg-transparent"
          }`}
        ></div>
        <div
          className={`relative z-10 ${
            sections[
              isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
            ].isQuiz
              ? ""
              : sections[
                  isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
                ].isFooter
              ? "w-full mt-16"
              : "mb-12"
          }`}
        >
          {/* Affichage conditionnel : Titre et description seulement si pas sur la section Quiz, Footer ou About */}
          {!sections[
            isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
          ].isQuiz &&
            !sections[
              isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
            ].isFooter &&
            !sections[
              isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
            ].isAbout && (
              <>
                <h1 className="text-3xl md:text-4xl font-light tracking-wider mb-4 drop-shadow-lg">
                  {
                    sections[
                      isReverse && activeIndex > 0
                        ? activeIndex - 1
                        : activeIndex
                    ].title
                  }
                </h1>
                <p className="text-lg md:text-xl mb-8 drop-shadow-lg">
                  {
                    sections[
                      isReverse && activeIndex > 0
                        ? activeIndex - 1
                        : activeIndex
                    ].description
                  }
                </p>
              </>
            )}

          {/* Affichage conditionnel : About, Quiz, Footer ou bouton normal */}
          {sections[
            isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
          ].isAbout ? (
            <div className="flex items-center justify-center px-4 py-8 md:p-12">
              <div className="bg-[#F5F1ED] rounded-lg my-6 md:my-10 p-4 md:p-8 max-w-5xl mx-auto text-gray-800">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
                    <img
                      src={
                        sections[
                          isReverse && activeIndex > 0
                            ? activeIndex - 1
                            : activeIndex
                        ].aboutImage
                      }
                      alt="Centre Dida Skin"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-4 flex justify-center md:hidden">
                      <button
                        className="px-6 py-2 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide "
                        onClick={() => navigate("/booking")}
                      >
                        {
                          sections[
                            isReverse && activeIndex > 0
                              ? activeIndex - 1
                              : activeIndex
                          ].callToAction
                        }
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">L'INSTITUT</h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      {
                        sections[
                          isReverse && activeIndex > 0
                            ? activeIndex - 1
                            : activeIndex
                        ].aboutText
                      }
                    </p>
                    <div className="mt-6 text-center hidden md:block">
                      <button
                        className="px-8 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide "
                        onClick={() => navigate("/booking")}
                      >
                        {
                          sections[
                            isReverse && activeIndex > 0
                              ? activeIndex - 1
                              : activeIndex
                          ].callToAction
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : sections[
              isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
            ].isQuiz ? (
            // Section Quiz - Afficher le quiz directement
            <div className="bg-[#F5F1ED] rounded-lg p-4 max-w-2xl mx-auto text-gray-800">
              {quizLoading ? (
                <div className="text-center py-8">
                  <div className="text-lg text-gray-600">
                    Chargement du quiz...
                  </div>
                </div>
              ) : quizError ? (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-4">{quizError}</div>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c]"
                  >
                    Réessayer
                  </button>
                </div>
              ) : quizQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-600 mb-4">
                    Aucune question de quiz disponible pour le moment.
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c]"
                  >
                    Actualiser
                  </button>
                </div>
              ) : quizState === "playing" ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Question {currentQuestionIndex + 1} sur{" "}
                      {quizQuestions.length}
                    </h3>
                    <p className="text-lg text-gray-700">
                      {quizQuestions[currentQuestionIndex]?.question ||
                        "Chargement..."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {quizQuestions[currentQuestionIndex]?.options.map(
                      (option, index) => {
                        const questionId =
                          quizQuestions[currentQuestionIndex]?.id;
                        const isCorrect =
                          option.originalIndex ===
                          quizQuestions[currentQuestionIndex]?.correctAnswer;
                        const isSelected =
                          userAnswers[questionId] === option.originalIndex;
                        const showFeedbackForThisQuestion =
                          showFeedback &&
                          lastAnsweredQuestion?.id === questionId;

                        let buttonClass =
                          "w-full p-3 md:p-4 text-left rounded-lg border transition-colors break-words ";

                        if (showFeedbackForThisQuestion) {
                          if (isCorrect) {
                            buttonClass +=
                              "border-green-500 bg-green-100 text-green-800";
                          } else if (isSelected && !isCorrect) {
                            buttonClass +=
                              "border-red-500 bg-red-100 text-red-800";
                          } else {
                            buttonClass +=
                              "border-gray-300 bg-gray-50 text-gray-600";
                          }
                        } else {
                          if (isSelected) {
                            buttonClass +=
                              "border-[#D4A574] bg-[#D4A574] text-white";
                          } else {
                            buttonClass +=
                              "border-gray-300 hover:border-[#D4A574] hover:bg-gray-50";
                          }
                        }

                        return (
                          <button
                            key={index}
                            onClick={() =>
                              handleAnswerSelect(
                                questionId,
                                option.originalIndex
                              )
                            }
                            disabled={showFeedbackForThisQuestion}
                            className={buttonClass}
                          >
                            {option.text}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Affichage du feedback */}
                  {showFeedback &&
                    lastAnsweredQuestion?.id ===
                      quizQuestions[currentQuestionIndex]?.id && (
                      <div className="mt-4 p-4 rounded-lg border">
                        {userAnswers[
                          quizQuestions[currentQuestionIndex]?.id
                        ] ===
                        quizQuestions[currentQuestionIndex]?.correctAnswer ? (
                          <div className="text-green-700">
                            <div className="font-semibold mb-2">
                              ✅ Correct !
                            </div>
                            <p className="text-sm">
                              {quizQuestions[currentQuestionIndex]?.explanation}
                            </p>
                          </div>
                        ) : (
                          <div className="text-red-700">
                            <div className="font-semibold mb-2">
                              ❌ Incorrect
                            </div>
                            <p className="text-sm">
                              {quizQuestions[currentQuestionIndex]?.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="w-full md:flex-1 px-6 md:px-10 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide"
                    >
                      Précédent
                    </button>
                    <div className="h-2 md:h-0 md:w-2"></div>
                    <button
                      onClick={handleNextQuestion}
                      disabled={
                        userAnswers[quizQuestions[currentQuestionIndex]?.id] ===
                        undefined
                      }
                      className="w-full md:flex-1 px-6 md:px-10 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide"
                    >
                      {currentQuestionIndex === quizQuestions.length - 1
                        ? "Terminer"
                        : "Suivant"}
                    </button>
                  </div>
                </div>
              ) : quizState === "results" ? (
                <div className="text-center space-y-6">
                  <div className="mb-8">
                    <div className="text-4xl md:text-6xl font-bold text-[#000000] mb-4">
                      {Math.round(
                        (calculateScore() / quizQuestions.length) * 100
                      )}
                      %
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      Résultats du Quiz
                    </h3>
                    <p className="text-lg text-gray-600">
                      {calculateScore()} bonnes réponses sur{" "}
                      {quizQuestions.length} questions
                    </p>
                  </div>

                  {/* Message de félicitations basé sur le score */}
                  <div className="bg-gradient-to-r from-[#F5F1ED] to-[#E8E0D8] rounded-lg p-6 border border-[#D4A574]">
                    {Math.round(
                      (calculateScore() / quizQuestions.length) * 100
                    ) >= 80 ? (
                      <div className="text-black">
                        <div className="text-2xl mb-2"> Excellent !</div>
                        <p className="text-sm">
                          Vous maîtrisez parfaitement les bases du skincare.
                          Continuez comme ça !
                        </p>
                      </div>
                    ) : Math.round(
                        (calculateScore() / quizQuestions.length) * 100
                      ) >= 60 ? (
                      <div className="text-blue-700">
                        <div className="text-2xl mb-2">Bien joué !</div>
                        <p className="text-sm">
                          Vous avez de bonnes connaissances. Quelques révisions
                          et vous serez parfait !
                        </p>
                      </div>
                    ) : Math.round(
                        (calculateScore() / quizQuestions.length) * 100
                      ) >= 40 ? (
                      <div className="text-orange-700">
                        <div className="text-2xl mb-2">Pas mal !</div>
                        <p className="text-sm">
                          Vous avez les bases, mais il y a encore des choses à
                          apprendre. Continuez à vous informer !
                        </p>
                      </div>
                    ) : (
                      <div className="text-red-700">
                        <div className="text-2xl mb-2"> À améliorer !</div>
                        <p className="text-sm">
                          Pas de panique ! La skincare s'apprend. N'hésitez pas
                          à consulter nos conseils experts.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Statistiques détaillées */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-black">
                        {calculateScore()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Bonnes réponses
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-gray-400">
                        {quizQuestions.length - calculateScore()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Réponses incorrectes
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 mt-6">
                    <button
                      onClick={handleRestartQuiz}
                      className="w-full md:flex-1 px-6 md:px-8 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide"
                    >
                      Recommencer le Quiz
                    </button>
                    <div className="h-2 md:h-0 md:w-2"></div>
                    <button
                      onClick={() => (window.location.href = "/services")}
                      className="w-full md:flex-1 px-6 md:px-8 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide "
                    >
                      Découvrir nos Services
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : sections[
              isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
            ].isFooter ? (
            // Section Footer - Afficher le footer directement
            <div className="w-full max-w-6xl mx-auto text-black text-left">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Colonne 1 - HORAIRES */}
                <div>
                  <h3 className="text-sm font-semibold text-black mb-3">
                    HORAIRES
                  </h3>
                  <div className="space-y-1">
                    <div className="text-xs text-black">Lundi: 10h00-19h00</div>
                    <div className="text-xs text-black">
                      Mardi au Jeudi: 09h00-17h00
                    </div>
                    <div className="text-xs text-black">
                      Vendredi: 09h00-18h00
                    </div>
                    <div className="text-xs text-black">
                      Samedi: 09h00-19h00
                    </div>
                  </div>
                </div>

                {/* Colonne 2 - CONTACT */}
                <div>
                  <h3 className="text-sm font-semibold text-black mb-3">
                    CONTACT
                  </h3>
                  <div className="space-y-1">
                    <div className="text-xs text-black">
                      contact@didaskin.com
                    </div>
                  </div>
                </div>

                {/* Colonne 3 - INFOS */}
                <div>
                  <h3 className="text-sm font-semibold text-black mb-3">
                    INFOS
                  </h3>
                  <div className="space-y-1">
                    <div
                      className="text-xs text-black cursor-pointer "
                      onClick={handleOpenNewsletter}
                    >
                      Souscrire newsletter
                    </div>
                    <div
                      className="text-xs text-black cursor-pointer hover:underline"
                      onClick={() => navigate("/privacy-policy")}
                    >
                      Politique de confidentialité
                    </div>
                    <div
                      className="text-xs text-black cursor-pointer hover:underline"
                      onClick={() => navigate("/privacy-policy")}
                    >
                      Conditions générales de vente
                    </div>
                    <div
                      className="text-xs text-black cursor-pointer hover:underline"
                      onClick={() => navigate("/legal-notice")}
                    >
                      Mentions légales
                    </div>
                  </div>
                </div>

                {/* Colonne 4 - RÉSEAUX SOCIAUX */}
                <div>
                  <h3 className="text-sm font-semibold text-black mb-3">
                    RÉSEAUX SOCIAUX
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.facebook.com/share/1Zj4Z22sQk/?mibextid=wwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 border border-black rounded flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors"
                    >
                      <Facebook className="w-3 h-3" />
                    </a>
                    <a
                      href="https://www.instagram.com/dida.skin.institut?igsh=eXIxMDFsZHF1bnFj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 border border-black rounded flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors"
                    >
                      <Instagram className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="mt-12 pt-8 border-t border-gray-300">
                <div className="text-center space-y-2">
                  <div className="text-xs text-black">
                    ©2025 dida skin tout droit réservés
                  </div>
                  <div className="text-xs text-gray-600">
                    Ce site a été créé par{" "}
                    <a
                      href="https://www.instagram.com/isakode_conception/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:underline font-medium"
                    >
                      ISAKODE
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Autres sections - Bouton normal
            <button
              className="px-8 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide"
               onClick={() => {
                const currentSectionIndex =
                  isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex;

                // Si on est sur la section hero (index 0), faire défiler vers la section suivante
                if (currentSectionIndex === 0) {
                  scrollToNextSection();
                  return;
                }

                // Sinon, comportement normal
                const sec = sections[currentSectionIndex];
                if (sec && sec.navigateTo) {
                  navigate(sec.navigateTo);
                } else if (sec && sec.serviceId) {
                  navigate(`/service/${sec.serviceId}`);
                } else {
                  handleCategoryClick(sec && sec.categoryId);
                }
              }}
            >
              {
                sections[
                  isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
                ].callToAction
              }
            </button>
          )}
        </div>
      </div>

      {/* Animate the overlay section only when animating */}
      <AnimatePresence>
        {isAnimating &&
          overlayIndex !== null &&
          overlayIndex >= 0 &&
          overlayIndex < sections.length && (
            <motion.section
              key={overlayIndex + "-" + isReverse}
              custom={direction}
              variants={variants}
              initial="initial"
              animate={isReverse ? "exit" : "animate"}
              exit=""
              className={`fixed top-0 left-0 w-full flex flex-col bg-cover bg-center pt-[80px] ${
                sections[isReverse ? activeIndex : overlayIndex] &&
                sections[isReverse ? activeIndex : overlayIndex].isQuiz
                  ? "items-center justify-center p-12 text-center"
                  : sections[isReverse ? activeIndex : overlayIndex] &&
                    sections[isReverse ? activeIndex : overlayIndex].isAbout
                  ? "items-center justify-center p-12 text-center"
                  : sections[isReverse ? activeIndex : overlayIndex] &&
                    sections[isReverse ? activeIndex : overlayIndex].isFooter
                  ? "items-start justify-start p-12 text-left"
                  : "items-center justify-end p-12 text-center"
              }`}
              style={{
                height: "100vh",
                height: "100dvh",
                backgroundImage:
                  (sections[isReverse ? activeIndex : overlayIndex] &&
                    sections[isReverse ? activeIndex : overlayIndex]
                      .imageSrc) === "none"
                    ? "none"
                    : `url(${
                        sections[isReverse ? activeIndex : overlayIndex] &&
                        sections[isReverse ? activeIndex : overlayIndex]
                          .imageSrc
                      })`,
                backgroundColor:
                  (sections[isReverse ? activeIndex : overlayIndex] &&
                    sections[isReverse ? activeIndex : overlayIndex]
                      .imageSrc) === "none"
                    ? "#F5F1ED"
                    : "transparent",
                zIndex: 2,
              }}
              onAnimationComplete={handleOverlayAnimationComplete}
            >
              <div
                className={`absolute inset-0 ${
                  (sections[isReverse ? activeIndex : overlayIndex] &&
                    sections[isReverse ? activeIndex : overlayIndex]
                      .imageSrc) === "none"
                    ? "bg-[#F5F1ED]"
                    : "bg-transparent"
                }`}
              ></div>
              <div
                className={`relative z-10 ${
                  sections[isReverse ? activeIndex : overlayIndex] &&
                  sections[isReverse ? activeIndex : overlayIndex].isQuiz
                    ? ""
                    : sections[isReverse ? activeIndex : overlayIndex] &&
                      sections[isReverse ? activeIndex : overlayIndex].isFooter
                    ? "w-full mt-16"
                    : "mb-12"
                }`}
              >
                {/* Affichage conditionnel : About, Quiz, Footer ou bouton normal */}
                {sections[isReverse ? activeIndex : overlayIndex] &&
                sections[isReverse ? activeIndex : overlayIndex].isAbout ? (
                  <div className="flex items-center justify-center px-4 py-8 md:p-12">
                    <div className="bg-[#F5F1ED] rounded-lg my-6 md:my-10 p-4 md:p-8 max-w-5xl mx-auto text-gray-800">
                      <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
                          <img
                            src={
                              sections[isReverse ? activeIndex : overlayIndex]
                                .aboutImage
                            }
                            alt="Centre Dida Skin"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-4 flex justify-center md:hidden">
                            <button
                              className="px-6 py-2 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide"
                              onClick={() => navigate("/booking")}
                            >
                              {
                                sections[isReverse ? activeIndex : overlayIndex]
                                  .callToAction
                              }
                            </button>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-3">
                            L'INSTITUT
                          </h3>
                          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            {
                              sections[isReverse ? activeIndex : overlayIndex]
                                .aboutText
                            }
                          </p>
                          <div className="mt-6 text-center hidden md:block">
                            <button
                              className="px-8 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide "
                              onClick={() => navigate("/booking")}
                            >
                              {
                                sections[isReverse ? activeIndex : overlayIndex]
                                  .callToAction
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : sections[isReverse ? activeIndex : overlayIndex] &&
                  sections[isReverse ? activeIndex : overlayIndex].isQuiz ? (
                  // Section Quiz - Afficher le quiz directement
                  <div className="bg-[#F5F1ED] rounded-lg p-4 max-w-2xl mx-auto text-gray-800">
                    {quizLoading ? (
                      <div className="text-center py-8">
                        <div className="text-lg text-gray-600">
                          Chargement du quiz...
                        </div>
                      </div>
                    ) : quizError ? (
                      <div className="text-center py-8">
                        <div className="text-red-600 mb-4">{quizError}</div>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c]"
                        >
                          Réessayer
                        </button>
                      </div>
                    ) : quizQuestions.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-600 mb-4">
                          Aucune question de quiz disponible pour le moment.
                        </div>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c]"
                        >
                          Actualiser
                        </button>
                      </div>
                    ) : quizState === "playing" ? (
                      <div className="space-y-4">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Question {currentQuestionIndex + 1} sur{" "}
                            {quizQuestions.length}
                          </h3>
                          <p className="text-lg text-gray-700">
                            {quizQuestions[currentQuestionIndex]?.question ||
                              "Chargement..."}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {quizQuestions[currentQuestionIndex]?.options.map(
                            (option, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleAnswerSelect(
                                    quizQuestions[currentQuestionIndex].id,
                                    option.originalIndex
                                  )
                                }
                                className={`w-full p-3 md:p-4 text-left rounded-lg border transition-colors break-words ${
                                  userAnswers[
                                    quizQuestions[currentQuestionIndex]?.id
                                  ] === option.originalIndex
                                    ? "border-[#D4A574] bg-[#D4A574] text-white"
                                    : "border-gray-300 hover:border-[#D4A574] hover:bg-gray-50"
                                }`}
                              >
                                {option.text}
                              </button>
                            )
                          )}
                        </div>

                        {/* Affichage du feedback */}
                        {showFeedback &&
                          lastAnsweredQuestion?.id ===
                            quizQuestions[currentQuestionIndex]?.id && (
                            <div className="mt-4 p-4 rounded-lg border">
                              {userAnswers[
                                quizQuestions[currentQuestionIndex]?.id
                              ] ===
                              quizQuestions[currentQuestionIndex]
                                ?.correctAnswer ? (
                                <div className="text-green-700">
                                  <div className="font-semibold mb-2">
                                    ✅ Correct !
                                  </div>
                                  <p className="text-sm">
                                    {
                                      quizQuestions[currentQuestionIndex]
                                        ?.explanation
                                    }
                                  </p>
                                </div>
                              ) : (
                                <div className="text-red-700">
                                  <div className="font-semibold mb-2">
                                    ❌ Incorrect
                                  </div>
                                  <p className="text-sm">
                                    {
                                      quizQuestions[currentQuestionIndex]
                                        ?.explanation
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                        <div className="flex justify-between items-center mt-6">
                          <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="w-full md:flex-1 px-6 md:px-10 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide"
                          >
                            Précédent
                          </button>
                          <div className="h-2 md:h-0 md:w-2"></div>
                          <button
                            onClick={handleNextQuestion}
                            disabled={
                              userAnswers[
                                quizQuestions[currentQuestionIndex]?.id
                              ] === undefined
                            }
                            className="w-full md:flex-1 px-6 md:px-10 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide"
                          >
                            {currentQuestionIndex === quizQuestions.length - 1
                              ? "Terminer"
                              : "Suivant"}
                          </button>
                        </div>
                      </div>
                    ) : quizState === "results" ? (
                      <div className="text-center space-y-6">
                        <div className="mb-8">
                          <div className="text-4xl md:text-6xl font-bold text-black mb-4">
                            {Math.round(
                              (calculateScore() / quizQuestions.length) * 100
                            )}
                            %
                          </div>
                          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                            Résultats du Quiz
                          </h3>
                          <p className="text-lg text-gray-600">
                            {calculateScore()} bonnes réponses sur{" "}
                            {quizQuestions.length} questions
                          </p>
                        </div>

                        {/* Message de félicitations basé sur le score */}
                        <div className="bg-gradient-to-r from-[#F5F1ED] to-[#E8E0D8] rounded-lg p-6 border border-[#D4A574]">
                          {Math.round(
                            (calculateScore() / quizQuestions.length) * 100
                          ) >= 80 ? (
                            <div className="text-green-700">
                              <div className="text-2xl mb-2">Excellent !</div>
                              <p className="text-sm">
                                Vous maîtrisez parfaitement les bases du
                                skincare. Continuez comme ça !
                              </p>
                            </div>
                          ) : Math.round(
                              (calculateScore() / quizQuestions.length) * 100
                            ) >= 60 ? (
                            <div className="text-blue-700">
                              <div className="text-2xl mb-2">Bien joué !</div>
                              <p className="text-sm">
                                Vous avez de bonnes connaissances. Quelques
                                révisions et vous serez parfait !
                              </p>
                            </div>
                          ) : Math.round(
                              (calculateScore() / quizQuestions.length) * 100
                            ) >= 40 ? (
                            <div className="text-orange-700">
                              <div className="text-2xl mb-2"> Pas mal !</div>
                              <p className="text-sm">
                                Vous avez les bases, mais il y a encore des
                                choses à apprendre. Continuez à vous informer !
                              </p>
                            </div>
                          ) : (
                            <div className="text-red-700">
                              <div className="text-2xl mb-2">À améliorer !</div>
                              <p className="text-sm">
                                Pas de panique ! Le skincare s'apprend.
                                N'hésitez pas à consulter nos conseils experts.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Statistiques détaillées */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-2xl font-bold text-black">
                              {calculateScore()}
                            </div>
                            <div className="text-sm text-gray-600">
                              Bonnes réponses
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-2xl font-bold text-gray-400">
                              {quizQuestions.length - calculateScore()}
                            </div>
                            <div className="text-sm text-gray-600">
                              Réponses incorrectes
                            </div>
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 mt-6">
                          <button
                            onClick={handleRestartQuiz}
                            className="w-full md:flex-1 px-6 md:px-8 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide"
                          >
                            Recommencer le Quiz
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : sections[isReverse ? activeIndex : overlayIndex] &&
                  sections[isReverse ? activeIndex : overlayIndex].isFooter ? (
                  // Section Footer - Afficher le footer directement
                  <div className="w-full max-w-6xl mx-auto text-black text-left">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                      {/* Colonne 1 - HORAIRES */}
                      <div>
                        <h3 className="text-sm font-semibold text-black mb-3">
                          HORAIRES
                        </h3>
                        <div className="space-y-1">
                          <div className="text-xs text-black">
                            Lundi: 10h00-19h00
                          </div>
                          <div className="text-xs text-black">
                            Mardi au Jeudi: 09h00-17h00
                          </div>
                          <div className="text-xs text-black">
                            Vendredi: 09h00-18h00
                          </div>
                          <div className="text-xs text-black">
                            Samedi: 09h00-19h00
                          </div>
                        </div>
                      </div>

                      {/* Colonne 2 - CONTACT */}
                      <div>
                        <h3 className="text-sm font-semibold text-black mb-3">
                          CONTACT
                        </h3>
                        <div className="space-y-1">
                          <div className="text-xs text-black">
                            contact@didaskin.com
                          </div>
                        </div>
                      </div>

                      {/* Colonne 3 - INFOS */}
                      <div>
                        <h3 className="text-sm font-semibold text-black mb-3">
                          INFOS
                        </h3>
                        <div className="space-y-1">
                          <div
                            className="text-xs text-black cursor-pointer hover:underline"
                            onClick={handleOpenNewsletter}
                          >
                            Souscrire newsletter
                          </div>
                          <div
                            className="text-xs text-black cursor-pointer hover:underline"
                            onClick={() => navigate("/privacy-policy")}
                          >
                            Politique de confidentialité
                          </div>
                          <div
                            className="text-xs text-black cursor-pointer hover:underline"
                            onClick={() => navigate("/privacy-policy")}
                          >
                            Conditions générales de vente
                          </div>
                          <div
                            className="text-xs text-black cursor-pointer hover:underline"
                            onClick={() => navigate("/legal-notice")}
                          >
                            Mentions légales
                          </div>
                        </div>
                      </div>

                      {/* Colonne 4 - RÉSEAUX SOCIAUX */}
                      <div>
                        <h3 className="text-sm font-semibold text-black mb-3">
                          RÉSEAUX SOCIAUX
                        </h3>
                        <div className="flex space-x-4">
                          <a
                            href="https://www.facebook.com/share/1Zj4Z22sQk/?mibextid=wwXIfr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 border border-black rounded flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors"
                          >
                            <Facebook className="w-3 h-3" />
                          </a>
                          <a
                            href="https://www.instagram.com/dida.skin.institut?igsh=eXIxMDFsZHF1bnFj"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 border border-black rounded flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors"
                          >
                            <Instagram className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-12 pt-8 border-t border-gray-300">
                      <div className="text-center space-y-2">
                        <div className="text-xs text-black">
                          ©2025 dida skin tout droit réservés
                        </div>
                        <div className="text-xs text-gray-600">
                          Ce site a été créé par{" "}
                          <a
                            href="https://www.instagram.com/isakode_conception/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black hover:underline font-medium"
                          >
                            ISAKODE
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-4xl font-light tracking-wider mb-4 drop-shadow-lg">
                      {sections[isReverse ? activeIndex : overlayIndex] &&
                        sections[isReverse ? activeIndex : overlayIndex].title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 drop-shadow-lg">
                      {sections[isReverse ? activeIndex : overlayIndex] &&
                        sections[isReverse ? activeIndex : overlayIndex]
                          .description}
                    </p>
                    <button
                      className="px-8 py-3 bg-[#000000] border border-[#333333] text-white text-sm font-medium tracking-wide hover:border "
                      onClick={() =>
                        (() => {
                          const sec =
                            sections[isReverse ? activeIndex : overlayIndex];
                          if (sec && sec.navigateTo) {
                            navigate(sec.navigateTo);
                          } else if (sec && sec.serviceId) {
                            navigate(`/service/${sec.serviceId}`);
                          } else {
                            handleCategoryClick(sec && sec.categoryId);
                          }
                        })()
                      }
                    >
                      {sections[isReverse ? activeIndex : overlayIndex] &&
                        sections[isReverse ? activeIndex : overlayIndex]
                          .callToAction}
                    </button>
                  </>
                )}
              </div>
            </motion.section>
          )}
      </AnimatePresence>

      {/* Subscription Modal */}
      <NewsletterModal
        isOpen={showSubscribe}
        onClose={() => setShowSubscribe(false)}
        imageUrl={hero.image || undefined}
      />

      {/* Modal Newsletter */}
      {/* The NewsletterModal component is removed, so this block is no longer needed. */}
    </div>
  );
}
