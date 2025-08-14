"use client";

import Header from "../components/header";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/categories");
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log("Categories fetched:", result.data); // Debug log
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
    // Function removed since NewsletterModal is no longer used
  };

  // Données du quiz (simplifiées pour l'exemple)
  const [quizQuestions] = useState([
    {
      id: 1,
      question:
        "Quel est le premier geste essentiel pour une routine de soin efficace ?",
      options: [
        "Nettoyer la peau",
        "Appliquer une crème hydratante",
        "Utiliser un sérum",
        "Protéger du soleil",
      ],
      correctAnswer: 0,
      explanation:
        "Le nettoyage est la base de toute routine de soin. Il permet d'éliminer les impuretés, le maquillage et l'excès de sébum pour préparer la peau aux soins suivants.",
    },
    {
      id: 2,
      question: "Combien de fois par jour faut-il nettoyer sa peau ?",
      options: [
        "Une fois le matin",
        "Une fois le soir",
        "Deux fois par jour",
        "Trois fois par jour",
      ],
      correctAnswer: 2,
      explanation:
        "Il est recommandé de nettoyer sa peau deux fois par jour : le matin pour éliminer les sécrétions nocturnes et le soir pour retirer le maquillage et les impuretés accumulées.",
    },
    {
      id: 3,
      question: "Quel type de peau nécessite le plus d'hydratation ?",
      options: ["Peau grasse", "Peau sèche", "Peau mixte", "Peau normale"],
      correctAnswer: 1,
      explanation:
        "La peau sèche manque naturellement de lipides et d'eau, ce qui la rend plus sensible aux agressions extérieures. Elle nécessite donc une hydratation plus importante.",
    },
  ]);

  // Create sections: first section + categories + quiz + footer
  const sections = [
    // Section 0: Page d'accueil (ne pas toucher)
    {
      title: "BIENVENUE CHEZ DIDA SKIN",
      description: "Votre sanctuaire de beauté et de bien-être.",
      imageSrc:
        "https://media.istockphoto.com/id/1304547222/photo/glamour-portrait-of-beautiful-woman.jpg?s=612x612&w=0&k=20&c=kiRKdJDxdqEz-lXRCqAuDzEoNsTk-_NZ-SsB2OLGM8Y=",
      callToAction: "DÉCOUVRIR NOS SERVICES",
      categoryId: null, // Pas de catégorie pour la page d'accueil
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
      : categories.slice(0, 3).map((category, index) => ({
          title: category.label || `CATÉGORIE ${index + 1}`,
          description:
            category.shortDescription ||
            "Découvrez nos services exceptionnels.",
          imageSrc: category.image_link || "/placeholder.svg",
          callToAction: `EXPLORER ${
            category.label?.toUpperCase() || "NOS SERVICES"
          }`,
          categoryId: category.id,
        }))),
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
  const sectionCount = 6; // Forcer à 6 sections: accueil + 3 catégories + quiz + footer
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReverse, setIsReverse] = useState(false); // true if animating out (scroll up)
  const [lastScrollTime, setLastScrollTime] = useState(0); // Pour éviter les scrolls multiples

  // Navigation handler for category sections
  const handleCategoryClick = (categoryId) => {
    if (categoryId) {
      navigate(`/categories?category=${categoryId}`);
    }
  };

  // Scroll navigation handler
  const handleWheel = useCallback(
    (e) => {
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime;

      // Protection contre les scrolls trop rapides (minimum 800ms entre chaque scroll)
      if (isAnimating || timeSinceLastScroll < 800) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 0 && activeIndex < sectionCount - 1) {
        setLastScrollTime(now);
        setDirection(1);
        setOverlayIndex(activeIndex + 1);
        setIsReverse(false);
        setIsAnimating(true);
      } else if (e.deltaY < 0 && activeIndex > 0) {
        setLastScrollTime(now);
        setDirection(-1);
        setOverlayIndex(activeIndex);
        setIsReverse(true);
        setIsAnimating(true);
      }
    },
    [activeIndex, sectionCount, isAnimating, lastScrollTime]
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

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Header />
      {/* Render the current section as fixed background */}
      <div
        className={`fixed top-0 left-0 h-screen w-full flex flex-col bg-cover bg-center pt-[80px] ${
          sections[isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex]
            .isQuiz
            ? "items-center justify-center p-12 text-center"
            : sections[
                isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
              ].isFooter
            ? "items-start justify-start p-12 text-left"
            : "items-center justify-end p-12 text-center"
        }`}
        style={{
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
              : "bg-black opacity-20"
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
          {/* Affichage conditionnel : Titre et description seulement si pas sur la section Quiz ou Footer */}
          {!sections[
            isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
          ].isQuiz &&
            !sections[
              isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
            ].isFooter && (
              <>
                <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4 drop-shadow-lg">
                  {
                    sections[
                      isReverse && activeIndex > 0
                        ? activeIndex - 1
                        : activeIndex
                    ].title
                  }
                </h2>
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

          {/* Affichage conditionnel : Quiz, Footer ou bouton normal */}
          {sections[
            isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
          ].isQuiz ? (
            // Section Quiz - Afficher le quiz directement
            <div className="bg-[#F5F1ED] rounded-lg p-4 max-w-2xl mx-auto text-gray-800">
              {quizState === "playing" ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Question {currentQuestionIndex + 1} sur{" "}
                      {quizQuestions.length}
                    </h3>
                    <p className="text-lg text-gray-700">
                      {quizQuestions[currentQuestionIndex]?.question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {quizQuestions[currentQuestionIndex]?.options.map(
                      (option, index) => {
                        const questionId =
                          quizQuestions[currentQuestionIndex]?.id;
                        const isCorrect =
                          index ===
                          quizQuestions[currentQuestionIndex]?.correctAnswer;
                        const isSelected = userAnswers[questionId] === index;
                        const showFeedbackForThisQuestion =
                          showFeedback &&
                          lastAnsweredQuestion?.id === questionId;

                        let buttonClass =
                          "w-full p-3 text-left rounded-lg border transition-colors ";

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
                              handleAnswerSelect(questionId, index)
                            }
                            disabled={showFeedbackForThisQuestion}
                            className={buttonClass}
                          >
                            {option}
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
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      disabled={
                        userAnswers[quizQuestions[currentQuestionIndex]?.id] ===
                        undefined
                      }
                      className="px-6 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="text-6xl font-bold text-[#D4A574] mb-4">
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
                        <div className="text-2xl mb-2">🎉 Excellent !</div>
                        <p className="text-sm">
                          Vous maîtrisez parfaitement les bases du skincare.
                          Continuez comme ça !
                        </p>
                      </div>
                    ) : Math.round(
                        (calculateScore() / quizQuestions.length) * 100
                      ) >= 60 ? (
                      <div className="text-blue-700">
                        <div className="text-2xl mb-2">👍 Bien joué !</div>
                        <p className="text-sm">
                          Vous avez de bonnes connaissances. Quelques révisions
                          et vous serez parfait !
                        </p>
                      </div>
                    ) : Math.round(
                        (calculateScore() / quizQuestions.length) * 100
                      ) >= 40 ? (
                      <div className="text-orange-700">
                        <div className="text-2xl mb-2">📚 Pas mal !</div>
                        <p className="text-sm">
                          Vous avez les bases, mais il y a encore des choses à
                          apprendre. Continuez à vous informer !
                        </p>
                      </div>
                    ) : (
                      <div className="text-red-700">
                        <div className="text-2xl mb-2">💡 À améliorer !</div>
                        <p className="text-sm">
                          Pas de panique ! Le skincare s'apprend. N'hésitez pas
                          à consulter nos conseils experts.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Statistiques détaillées */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="text-2xl font-bold text-[#D4A574]">
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
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleRestartQuiz}
                      className="px-8 py-3 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors font-medium"
                    >
                      🔄 Recommencer le Quiz
                    </button>
                    <button
                      onClick={() => (window.location.href = "/services")}
                      className="px-8 py-3 border border-[#D4A574] text-[#D4A574] rounded-lg hover:bg-[#D4A574] hover:text-white transition-colors font-medium"
                    >
                      💆‍♀️ Découvrir nos Services
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
                      className="text-xs text-black hover:text-[#D4A574] cursor-pointer transition-colors"
                      onClick={handleOpenNewsletter}
                    >
                      Souscrire newsletter
                    </div>
                    <div className="text-xs text-black hover:text-[#D4A574] cursor-pointer transition-colors">
                      Politique de confidentialité
                    </div>
                    <div className="text-xs text-black hover:text-[#D4A574] cursor-pointer transition-colors">
                      Conditions générales de vente
                    </div>
                    <div className="text-xs text-black hover:text-[#D4A574] cursor-pointer transition-colors">
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
                    <div className="w-6 h-6 border border-black rounded flex items-center justify-center cursor-pointer hover:bg-[#D4A574] hover:border-[#D4A574] transition-colors">
                      <Facebook className="w-3 h-3 text-black" />
                    </div>
                    <div className="w-6 h-6 border border-black rounded flex items-center justify-center cursor-pointer hover:bg-[#D4A574] hover:border-[#D4A574] transition-colors">
                      <Instagram className="w-3 h-3 text-black" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="mt-12 pt-8 border-t border-gray-300">
                <div className="text-center">
                  <div className="text-xs text-black">
                    ©2025 dida skin tout droit réservés
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Autres sections - Bouton normal
            <button
              className="px-8 py-3 border border-white text-white text-sm font-medium tracking-wide hover:bg-white hover:text-black transition-colors duration-300"
              onClick={() =>
                handleCategoryClick(
                  sections[
                    isReverse && activeIndex > 0 ? activeIndex - 1 : activeIndex
                  ].categoryId
                )
              }
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
        {isAnimating && overlayIndex !== null && (
          <motion.section
            key={overlayIndex + "-" + isReverse}
            custom={direction}
            variants={variants}
            initial="initial"
            animate={isReverse ? "exit" : "animate"}
            exit=""
            className={`fixed top-0 left-0 h-screen w-full flex flex-col bg-cover bg-center pt-[80px] ${
              sections[isReverse ? activeIndex : overlayIndex].isQuiz
                ? "items-center justify-center p-12 text-center"
                : sections[isReverse ? activeIndex : overlayIndex].isFooter
                ? "items-start justify-start p-12 text-left"
                : "items-center justify-end p-12 text-center"
            }`}
            style={{
              backgroundImage:
                sections[isReverse ? activeIndex : overlayIndex].imageSrc ===
                "none"
                  ? "none"
                  : `url(${
                      sections[isReverse ? activeIndex : overlayIndex].imageSrc
                    })`,
              backgroundColor:
                sections[isReverse ? activeIndex : overlayIndex].imageSrc ===
                "none"
                  ? "#F5F1ED"
                  : "transparent",
              zIndex: 2,
            }}
            onAnimationComplete={handleOverlayAnimationComplete}
          >
            <div
              className={`absolute inset-0 ${
                sections[isReverse ? activeIndex : overlayIndex].imageSrc ===
                "none"
                  ? "bg-[#F5F1ED]"
                  : "bg-black opacity-20"
              }`}
            ></div>
            <div
              className={`relative z-10 ${
                sections[isReverse ? activeIndex : overlayIndex].isQuiz
                  ? ""
                  : sections[isReverse ? activeIndex : overlayIndex].isFooter
                  ? "w-full mt-16"
                  : "mb-12"
              }`}
            >
              {/* Affichage conditionnel : Titre et description seulement si pas sur la section Quiz ou Footer */}
              {!sections[isReverse ? activeIndex : overlayIndex].isQuiz &&
              !sections[isReverse ? activeIndex : overlayIndex].isFooter ? (
                <>
                  <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-4 drop-shadow-lg">
                    {sections[isReverse ? activeIndex : overlayIndex].title}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 drop-shadow-lg">
                    {
                      sections[isReverse ? activeIndex : overlayIndex]
                        .description
                    }
                  </p>
                  <button
                    className="px-8 py-3 border border-white text-white text-sm font-medium tracking-wide hover:bg-white hover:text-black transition-colors duration-300"
                    onClick={() =>
                      handleCategoryClick(
                        sections[isReverse ? activeIndex : overlayIndex]
                          .categoryId
                      )
                    }
                  >
                    {
                      sections[isReverse ? activeIndex : overlayIndex]
                        .callToAction
                    }
                  </button>
                </>
              ) : sections[isReverse ? activeIndex : overlayIndex].isQuiz ? (
                // Section Quiz - Afficher le quiz directement
                <div className="bg-[#F5F1ED] rounded-lg p-4 max-w-2xl mx-auto text-gray-800">
                  {quizState === "playing" ? (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Question {currentQuestionIndex + 1} sur{" "}
                          {quizQuestions.length}
                        </h3>
                        <p className="text-lg text-gray-700">
                          {quizQuestions[currentQuestionIndex]?.question}
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
                                  index
                                )
                              }
                              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                                userAnswers[
                                  quizQuestions[currentQuestionIndex]?.id
                                ] === index
                                  ? "border-[#D4A574] bg-[#D4A574] text-white"
                                  : "border-gray-300 hover:border-[#D4A574] hover:bg-gray-50"
                              }`}
                            >
                              {option}
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
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Précédent
                        </button>
                        <button
                          onClick={handleNextQuestion}
                          disabled={
                            userAnswers[
                              quizQuestions[currentQuestionIndex]?.id
                            ] === undefined
                          }
                          className="px-6 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className="text-6xl font-bold text-[#D4A574] mb-4">
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
                            <div className="text-2xl mb-2">🎉 Excellent !</div>
                            <p className="text-sm">
                              Vous maîtrisez parfaitement les bases du skincare.
                              Continuez comme ça !
                            </p>
                          </div>
                        ) : Math.round(
                            (calculateScore() / quizQuestions.length) * 100
                          ) >= 60 ? (
                          <div className="text-blue-700">
                            <div className="text-2xl mb-2">👍 Bien joué !</div>
                            <p className="text-sm">
                              Vous avez de bonnes connaissances. Quelques
                              révisions et vous serez parfait !
                            </p>
                          </div>
                        ) : Math.round(
                            (calculateScore() / quizQuestions.length) * 100
                          ) >= 40 ? (
                          <div className="text-orange-700">
                            <div className="text-2xl mb-2">📚 Pas mal !</div>
                            <p className="text-sm">
                              Vous avez les bases, mais il y a encore des choses
                              à apprendre. Continuez à vous informer !
                            </p>
                          </div>
                        ) : (
                          <div className="text-red-700">
                            <div className="text-2xl mb-2">
                              💡 À améliorer !
                            </div>
                            <p className="text-sm">
                              Pas de panique ! Le skincare s'apprend. N'hésitez
                              pas à consulter nos conseils experts.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Statistiques détaillées */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="text-2xl font-bold text-[#D4A574]">
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
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={handleRestartQuiz}
                          className="px-8 py-3 bg-[#D4A574] text-white rounded-lg hover:bg-[#b88b5c] transition-colors font-medium"
                        >
                          🔄 Recommencer le Quiz
                        </button>
                        <button
                          onClick={() => (window.location.href = "/services")}
                          className="px-8 py-3 border border-[#D4A574] text-[#D4A574] rounded-lg hover:bg-[#D4A574] hover:text-white transition-colors font-medium"
                        >
                          💆‍♀️ Découvrir nos Services
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
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
                        <div className="text-xs text-black hover:text-[#D4A574] cursor-pointer transition-colors">
                          Souscrire newsletter
                        </div>
                        <div className="text-xs text-black hover:text-[#D4A574] cursor-pointer transition-colors">
                          Politique de confidentialité
                        </div>
                        <div className="text-xs text-black hover:text-[#D4A574] cursor-pointer transition-colors">
                          Conditions générales de vente
                        </div>
                        <div className="text-xs text-black hover:text-[#D4A574] cursor-pointer transition-colors">
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
                        <div className="w-6 h-6 border border-black rounded flex items-center justify-center cursor-pointer hover:bg-[#D4A574] hover:border-[#D4A574] transition-colors">
                          <Facebook className="w-3 h-3 text-black" />
                        </div>
                        <div className="w-6 h-6 border border-black rounded flex items-center justify-center cursor-pointer hover:bg-[#D4A574] hover:border-[#D4A574] transition-colors">
                          <Instagram className="w-3 h-3 text-black" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Copyright */}
                  <div className="mt-12 pt-8 border-t border-gray-300">
                    <div className="text-center">
                      <div className="text-xs text-black">
                        ©2025 dida skin tout droit réservés
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Modal Newsletter */}
      {/* The NewsletterModal component is removed, so this block is no longer needed. */}
    </div>
  );
}
