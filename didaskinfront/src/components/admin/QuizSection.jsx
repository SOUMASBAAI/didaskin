"use client";

import { useState } from "react";
import { Trash } from "lucide-react";

export default function QuizSection() {
  // États pour le quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", ""], // Commence avec 2 options minimum
    correctAnswer: 0,
    explanation: "",
  });

  // Données mock pour les questions du quiz
  const [quizQuestions, setQuizQuestions] = useState([
    {
      id: 1,
      question:
        "Quel est le premier geste essentiel d'une routine skincare matinale ?",
      options: [
        "Nettoyer avec un gel nettoyant",
        "Appliquer une crème hydratante",
        "Utiliser un sérum vitamine C",
        "Protéger avec un SPF",
      ],
      correctAnswer: 0,
      explanation:
        "Le nettoyage est la première étape essentielle pour éliminer les impuretés accumulées pendant la nuit.",
    },
    {
      id: 2,
      question:
        "Quelle vitamine est particulièrement efficace pour lutter contre les signes de l'âge ?",
      options: [
        "Vitamine A (Rétinol)",
        "Vitamine B",
        "Vitamine C",
        "Vitamine D",
      ],
      correctAnswer: 0,
      explanation:
        "Le rétinol (vitamine A) est considéré comme l'ingrédient anti-âge le plus efficace scientifiquement prouvé.",
    },
    {
      id: 3,
      question:
        "Combien de temps faut-il attendre entre l'application d'un sérum et d'une crème ?",
      options: [
        "Aucun temps d'attente",
        "30 secondes",
        "1-2 minutes",
        "5 minutes minimum",
      ],
      correctAnswer: 2,
      explanation:
        "Il est recommandé d'attendre 1-2 minutes pour permettre au sérum de pénétrer avant d'appliquer la crème.",
    },
    {
      id: 4,
      question: "Quel type de peau nécessite le plus d'hydratation ?",
      options: ["Peau grasse", "Peau sèche", "Peau mixte", "Peau normale"],
      correctAnswer: 1,
      explanation:
        "La peau sèche manque naturellement de lipides et nécessite une hydratation plus importante.",
    },
    {
      id: 5,
      question: "Qu'est-ce que l'exfoliation chimique ?",
      options: [
        "Utiliser un gommage mécanique",
        "Utiliser des acides (AHA, BHA)",
        "Utiliser une brosse de nettoyage",
        "Utiliser un masque à l'argile",
      ],
      correctAnswer: 1,
      explanation:
        "L'exfoliation chimique utilise des acides comme l'acide glycolique (AHA) ou l'acide salicylique (BHA) pour éliminer les cellules mortes.",
    },
  ]);

  // Fonctions pour le quiz
  const handleAnswerSelect = (questionId, answerIndex) => {
    console.log("Réponse sélectionnée:", { questionId, answerIndex });
    setUserAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: answerIndex,
      };
      console.log("Nouvelles réponses:", newAnswers);
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
      setShowQuizResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setShowQuizResults(false);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (
      !newQuestion.question ||
      newQuestion.options.some((opt) => !opt) ||
      !newQuestion.explanation
    ) {
      return;
    }
    setQuizQuestions((prev) => [
      ...prev,
      {
        ...newQuestion,
        id: prev.length ? Math.max(...prev.map((q) => q.id)) + 1 : 1,
      },
    ]);
    setNewQuestion({
      question: "",
      options: ["", ""],
      correctAnswer: 0,
      explanation: "",
    });
    setShowAddQuestion(false);
  };

  const handleDeleteQuestion = (id) => {
    setQuizQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Fonctions pour gérer les options de réponse
  const addOption = () => {
    if (newQuestion.options.length < 4) {
      setNewQuestion((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    }
  };

  const removeOption = (index) => {
    if (newQuestion.options.length > 2) {
      const newOptions = newQuestion.options.filter((_, i) => i !== index);
      setNewQuestion((prev) => ({
        ...prev,
        options: newOptions,
        // Ajuster la bonne réponse si nécessaire
        correctAnswer:
          prev.correctAnswer >= index
            ? Math.max(0, prev.correctAnswer - 1)
            : prev.correctAnswer,
      }));
    }
  };

  // Fonctions pour l'édition des questions
  const handleEditQuestion = (question) => {
    setEditingQuestion({
      ...question,
      options: [...question.options], // Copie profonde des options
    });
    setShowEditQuestion(true);
  };

  const handleUpdateQuestion = (e) => {
    e.preventDefault();
    if (
      !editingQuestion.question ||
      editingQuestion.options.some((opt) => !opt) ||
      editingQuestion.explanation === undefined
    ) {
      return;
    }

    setQuizQuestions((prev) =>
      prev.map((q) => (q.id === editingQuestion.id ? editingQuestion : q))
    );

    setEditingQuestion(null);
    setShowEditQuestion(false);
  };

  const addEditOption = () => {
    if (editingQuestion.options.length < 4) {
      setEditingQuestion((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    }
  };

  const removeEditOption = (index) => {
    if (editingQuestion.options.length > 2) {
      const newOptions = editingQuestion.options.filter((_, i) => i !== index);
      setEditingQuestion((prev) => ({
        ...prev,
        options: newOptions,
        // Ajuster la bonne réponse si nécessaire
        correctAnswer:
          prev.correctAnswer >= index
            ? Math.max(0, prev.correctAnswer - 1)
            : prev.correctAnswer,
      }));
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: quizQuestions.length,
      percentage: Math.round((correct / quizQuestions.length) * 100),
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Quiz Culture Générale - Esthétique & Skincare
        </h2>
        <button
          onClick={() => setShowAddQuestion(true)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D4A574] text-white text-2xl hover:bg-[#b88b5c] transition"
          title="Ajouter une question"
        >
          +
        </button>
      </div>

      {!showQuizResults && !quizCompleted && (
        <div className="max-w-4xl mx-auto">
          {/* Barre de progression */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Question {currentQuestionIndex + 1} sur {quizQuestions.length}
              </span>
              <span>
                {Math.round(
                  ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#D4A574] h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question actuelle */}
          {quizQuestions[currentQuestionIndex] && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {quizQuestions[currentQuestionIndex].question}
              </h3>

              <div className="space-y-3">
                {quizQuestions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAnswerSelect(
                          quizQuestions[currentQuestionIndex].id,
                          index
                        )
                      }
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        userAnswers[quizQuestions[currentQuestionIndex].id] ===
                        index
                          ? "border-[#D4A574] bg-[#D4A574] text-white"
                          : "border-gray-300 bg-white hover:border-[#D4A574] hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">
                        {String.fromCharCode(65 + index)}.
                      </span>{" "}
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                currentQuestionIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Précédent
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={
                userAnswers[quizQuestions[currentQuestionIndex]?.id] ===
                undefined
              }
              className={`px-6 py-2 rounded-lg font-medium transition ${
                userAnswers[quizQuestions[currentQuestionIndex]?.id] ===
                undefined
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#D4A574] text-white hover:bg-[#b88b5c]"
              }`}
            >
              {currentQuestionIndex === quizQuestions.length - 1
                ? "Terminer"
                : "Suivant"}
            </button>
          </div>
        </div>
      )}

      {/* Résultats du quiz */}
      {showQuizResults && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8 text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Résultats du Quiz
            </h3>
            {(() => {
              const score = calculateScore();
              return (
                <div className="mb-6">
                  <div className="text-6xl font-bold text-[#D4A574] mb-2">
                    {score.percentage}%
                  </div>
                  <div className="text-lg text-gray-600">
                    {score.correct} bonnes réponses sur {score.total} questions
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    {score.percentage >= 80
                      ? "Excellent ! Vous maîtrisez parfaitement le sujet."
                      : score.percentage >= 60
                      ? "Bien ! Vous avez de bonnes connaissances."
                      : score.percentage >= 40
                      ? "Pas mal ! Continuez à apprendre."
                      : "À améliorer ! N'hésitez pas à consulter nos ressources."}
                  </div>
                </div>
              );
            })()}
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3 bg-[#D4A574] text-white rounded-lg font-medium hover:bg-[#b88b5c] transition"
            >
              Recommencer le quiz
            </button>
          </div>

          {/* Détail des réponses */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              Détail des réponses
            </h4>
            {quizQuestions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-medium text-gray-800">
                    Question {index + 1}
                  </h5>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      userAnswers[question.id] === question.correctAnswer
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userAnswers[question.id] === question.correctAnswer
                      ? "Correct"
                      : "Incorrect"}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{question.question}</p>
                <div className="space-y-2 mb-3">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-2 rounded ${
                        optIndex === question.correctAnswer
                          ? "bg-green-50 border border-green-200"
                          : optIndex === userAnswers[question.id] &&
                            optIndex !== question.correctAnswer
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>{" "}
                      {option}
                      {optIndex === question.correctAnswer && (
                        <span className="ml-2 text-green-600 text-sm">
                          ✓ Bonne réponse
                        </span>
                      )}
                      {optIndex === userAnswers[question.id] &&
                        optIndex !== question.correctAnswer && (
                          <span className="ml-2 text-red-600 text-sm">
                            ✗ Votre réponse
                          </span>
                        )}
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Explication :</strong> {question.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des questions pour l'admin */}
      {!showQuizResults && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Questions du quiz
          </h3>
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              Questions existantes
            </h4>
            {quizQuestions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h5 className="font-medium text-gray-800 mb-1">
                    Question {index + 1}
                  </h5>
                  <p className="text-sm text-gray-600">{question.question}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Modifier cette question"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Supprimer cette question"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal pour ajouter une question */}
      {showAddQuestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded border border-gray-200 p-8 w-full max-w-2xl relative shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowAddQuestion(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Ajouter une question
            </h3>
            <form onSubmit={handleAddQuestion}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    value={newQuestion.question}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options de réponse ({newQuestion.options.length}/4)
                  </label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="mb-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion((prev) => ({
                            ...prev,
                            options: newOptions,
                          }));
                        }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {newQuestion.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer cette option"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {newQuestion.options.length < 4 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#D4A574] hover:text-[#D4A574] transition"
                    >
                      + Ajouter une option
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bonne réponse
                  </label>
                  <select
                    value={newQuestion.correctAnswer}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        correctAnswer: parseInt(e.target.value),
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    required
                  >
                    {newQuestion.options.map((option, index) => (
                      <option key={index} value={index}>
                        {option || `Option ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explication
                  </label>
                  <textarea
                    value={newQuestion.explanation}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        explanation: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    rows={3}
                    placeholder="Explication de la bonne réponse..."
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddQuestion(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-[#D4A574] text-white rounded hover:bg-[#b88b5c] transition"
                >
                  Ajouter la question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour éditer une question */}
      {showEditQuestion && editingQuestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded border border-gray-200 p-8 w-full max-w-2xl relative shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setShowEditQuestion(false);
                setEditingQuestion(null);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Modifier la question
            </h3>
            <form onSubmit={handleUpdateQuestion}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options de réponse ({editingQuestion.options.length}/4)
                  </label>
                  {editingQuestion.options.map((option, index) => (
                    <div key={index} className="mb-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.options];
                          newOptions[index] = e.target.value;
                          setEditingQuestion((prev) => ({
                            ...prev,
                            options: newOptions,
                          }));
                        }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {editingQuestion.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeEditOption(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer cette option"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {editingQuestion.options.length < 4 && (
                    <button
                      type="button"
                      onClick={addEditOption}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#D4A574] hover:text-[#D4A574] transition"
                    >
                      + Ajouter une option
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bonne réponse
                  </label>
                  <select
                    value={editingQuestion.correctAnswer}
                    onChange={(e) =>
                      setEditingQuestion((prev) => ({
                        ...prev,
                        correctAnswer: parseInt(e.target.value),
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    required
                  >
                    {editingQuestion.options.map((option, index) => (
                      <option key={index} value={index}>
                        {option || `Option ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explication
                  </label>
                  <textarea
                    value={editingQuestion.explanation}
                    onChange={(e) =>
                      setEditingQuestion((prev) => ({
                        ...prev,
                        explanation: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                    rows={3}
                    placeholder="Explication de la bonne réponse..."
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditQuestion(false);
                    setEditingQuestion(null);
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-[#D4A574] text-white rounded hover:bg-[#b88b5c] transition"
                >
                  Mettre à jour la question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
