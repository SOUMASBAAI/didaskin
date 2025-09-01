"use client";

import { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { RESOURCE_ENDPOINTS } from "../../config/apiConfig";

export default function QuizSection() {
  const { getAuthHeaders, isAuthenticated, isLoading, handleApiResponse } =
    useAuth();
  // États pour le quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState({
    question: "",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    correctAnswer: 0,
    explanation: "",
  });
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    correctAnswer: 0,
    explanation: "",
  });

  // État des questions du quiz
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer toutes les questions du quiz
  const fetchQuizQuestions = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(RESOURCE_ENDPOINTS.QUIZ_QUESTIONS, {
        headers: getAuthHeaders(),
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setError("Réponse invalide du serveur");
        setLoading(false);
        return;
      }

      const result = await handleApiResponse(response);

      if (result.success) {
        // Transformer les données du backend en format frontend
        const transformedQuestions = result.data.map((q) => ({
          id: q.id,
          question: q.question,
          options: [q.choiceA, q.choiceB, q.choiceC, q.choiceD].filter(
            (choice) => choice && choice.trim() !== ""
          ),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        }));
        setQuizQuestions(transformedQuestions);
      } else {
        setError("Erreur lors de la récupération des questions du quiz");
      }
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message === "INVALID_RESPONSE") {
        setError("Réponse invalide du serveur");
      } else {
        setError("Erreur de connexion au serveur");
      }
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les questions au montage du composant
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchQuizQuestions();
    }
  }, [isAuthenticated, isLoading]);

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

  // Supprimer une question
  const handleDeleteQuestion = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      return;
    }

    try {
      const response = await fetch(
        `${RESOURCE_ENDPOINTS.QUIZ_QUESTIONS}/${id}/delete`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const result = await handleApiResponse(response);

      if (result.success) {
        // Recharger la liste des questions
        await fetchQuizQuestions();
      } else {
        setError(
          result.error || "Erreur lors de la suppression de la question"
        );
      }
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message === "INVALID_RESPONSE") {
        setError("Réponse invalide du serveur");
      } else {
        setError("Erreur de connexion au serveur");
      }
      console.error("Erreur:", error);
    }
  };

  // Fonctions pour l'édition des questions
  const handleEditQuestion = (question) => {
    setEditingQuestion({
      id: question.id,
      question: question.question,
      choiceA: question.options[0] || "",
      choiceB: question.options[1] || "",
      choiceC: question.options[2] || "",
      choiceD: question.options[3] || "",
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    });
    setShowEditQuestion(true);
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    if (
      !editingQuestion.question ||
      !editingQuestion.choiceA ||
      !editingQuestion.choiceB ||
      !editingQuestion.explanation
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${RESOURCE_ENDPOINTS.QUIZ_QUESTIONS}/${editingQuestion.id}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            question: editingQuestion.question,
            choiceA: editingQuestion.choiceA,
            choiceB: editingQuestion.choiceB,
            choiceC: editingQuestion.choiceC,
            choiceD: editingQuestion.choiceD,
            correctAnswer: editingQuestion.correctAnswer,
            explanation: editingQuestion.explanation,
          }),
        }
      );

      const result = await handleApiResponse(response);

      if (result.success) {
        // Recharger la liste des questions
        await fetchQuizQuestions();

        // Fermer le modal d'édition
        setEditingQuestion({
          question: "",
          choiceA: "",
          choiceB: "",
          choiceC: "",
          choiceD: "",
          correctAnswer: 0,
          explanation: "",
        });
        setShowEditQuestion(false);
      } else {
        setError(
          result.error || "Erreur lors de la modification de la question"
        );
      }
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message === "INVALID_RESPONSE") {
        setError("Réponse invalide du serveur");
      } else {
        setError("Erreur de connexion au serveur");
      }
      console.error("Erreur:", error);
    }
  };

  // Ajouter une nouvelle question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (
      !newQuestion.question ||
      !newQuestion.choiceA ||
      !newQuestion.choiceB ||
      !newQuestion.explanation
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${RESOURCE_ENDPOINTS.QUIZ_QUESTIONS}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            question: newQuestion.question,
            choiceA: newQuestion.choiceA,
            choiceB: newQuestion.choiceB,
            choiceC: newQuestion.choiceC,
            choiceD: newQuestion.choiceD,
            correctAnswer: newQuestion.correctAnswer,
            explanation: newQuestion.explanation,
          }),
        }
      );

      const result = await handleApiResponse(response);

      if (result.success) {
        // Recharger la liste des questions
        await fetchQuizQuestions();

        // Réinitialiser le formulaire
        setNewQuestion({
          question: "",
          choiceA: "",
          choiceB: "",
          choiceC: "",
          choiceD: "",
          correctAnswer: 0,
          explanation: "",
        });
        setShowAddQuestion(false);
      } else {
        setError(result.error || "Erreur lors de l'ajout de la question");
      }
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.message === "INVALID_RESPONSE") {
        setError("Réponse invalide du serveur");
      } else {
        setError("Erreur de connexion au serveur");
      }
      console.error("Erreur:", error);
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
    <>
      {/* Authentication check */}
      {!isAuthenticated && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="text-center text-gray-600">
            Veuillez vous connecter pour accéder à cette section.
          </div>
        </div>
      )}

      {/* Main content - only show when authenticated */}
      {isAuthenticated && (
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

          {/* Affichage des erreurs */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Affichage du chargement */}
          {loading && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              Chargement des questions du quiz...
            </div>
          )}

          {!showQuizResults && !quizCompleted && (
            <div className="max-w-4xl mx-auto">
              {quizQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">
                    {loading
                      ? "Chargement..."
                      : "Aucune question de quiz trouvée"}
                  </div>
                  {!loading && (
                    <button
                      onClick={() => setShowAddQuestion(true)}
                      className="px-6 py-3 bg-[#D4A574] text-white rounded-lg font-medium hover:bg-[#b88b5c] transition"
                    >
                      Ajouter la première question
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Barre de progression */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>
                        Question {currentQuestionIndex + 1} sur{" "}
                        {quizQuestions.length}
                      </span>
                      <span>
                        {Math.round(
                          ((currentQuestionIndex + 1) / quizQuestions.length) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#D4A574] h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            ((currentQuestionIndex + 1) /
                              quizQuestions.length) *
                            100
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
                                userAnswers[
                                  quizQuestions[currentQuestionIndex].id
                                ] === index
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
                </>
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
                        {score.correct} bonnes réponses sur {score.total}{" "}
                        questions
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
                      <p className="text-sm text-gray-600">
                        {question.question}
                      </p>
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
                        Options de réponse
                      </label>

                      {/* Option A */}
                      <div className="mb-2">
                        <input
                          type="text"
                          value={newQuestion.choiceA}
                          onChange={(e) =>
                            setNewQuestion((prev) => ({
                              ...prev,
                              choiceA: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                          placeholder="Option A"
                          required
                        />
                      </div>

                      {/* Option B */}
                      <div className="mb-2">
                        <input
                          type="text"
                          value={newQuestion.choiceB}
                          onChange={(e) =>
                            setNewQuestion((prev) => ({
                              ...prev,
                              choiceB: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                          placeholder="Option B"
                          required
                        />
                      </div>

                      {/* Option C */}
                      <div className="mb-2">
                        <input
                          type="text"
                          value={newQuestion.choiceC}
                          onChange={(e) =>
                            setNewQuestion((prev) => ({
                              ...prev,
                              choiceC: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                          placeholder="Option C (optionnel)"
                        />
                      </div>

                      {/* Option D */}
                      <div className="mb-2">
                        <input
                          type="text"
                          value={newQuestion.choiceD}
                          onChange={(e) =>
                            setNewQuestion((prev) => ({
                              ...prev,
                              choiceD: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                          placeholder="Option D (optionnel)"
                        />
                      </div>
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
                        <option value={0}>
                          Option A: {newQuestion.choiceA || "Option A"}
                        </option>
                        <option value={1}>
                          Option B: {newQuestion.choiceB || "Option B"}
                        </option>
                        {newQuestion.choiceC && (
                          <option value={2}>
                            Option C: {newQuestion.choiceC}
                          </option>
                        )}
                        {newQuestion.choiceD && (
                          <option value={3}>
                            Option D: {newQuestion.choiceD}
                          </option>
                        )}
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
                    setEditingQuestion({
                      question: "",
                      choiceA: "",
                      choiceB: "",
                      choiceC: "",
                      choiceD: "",
                      correctAnswer: 0,
                      explanation: "",
                    });
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
                        Options de réponse
                      </label>

                      {/* Option A */}
                      <div className="mb-2">
                        <input
                          type="text"
                          value={editingQuestion.choiceA}
                          onChange={(e) =>
                            setEditingQuestion((prev) => ({
                              ...prev,
                              choiceA: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                          placeholder="Option A"
                          required
                        />
                      </div>

                      {/* Option B */}
                      <div className="mb-2">
                        <input
                          type="text"
                          value={editingQuestion.choiceB}
                          onChange={(e) =>
                            setEditingQuestion((prev) => ({
                              ...prev,
                              choiceB: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                          placeholder="Option B"
                          required
                        />
                      </div>

                      {/* Option C */}
                      <div className="mb-2">
                        <input
                          type="text"
                          value={editingQuestion.choiceC}
                          onChange={(e) =>
                            setEditingQuestion((prev) => ({
                              ...prev,
                              choiceC: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                          placeholder="Option C (optionnel)"
                        />
                      </div>

                      {/* Option D */}
                      <div className="mb-2">
                        <input
                          type="text"
                          value={editingQuestion.choiceD}
                          onChange={(e) =>
                            setEditingQuestion((prev) => ({
                              ...prev,
                              choiceD: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                          placeholder="Option D (optionnel)"
                        />
                      </div>
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
                        <option value={0}>
                          Option A: {editingQuestion.choiceA || "Option A"}
                        </option>
                        <option value={1}>
                          Option B: {editingQuestion.choiceB || "Option B"}
                        </option>
                        {editingQuestion.choiceC && (
                          <option value={2}>
                            Option C: {editingQuestion.choiceC}
                          </option>
                        )}
                        {editingQuestion.choiceD && (
                          <option value={3}>
                            Option D: {editingQuestion.choiceD}
                          </option>
                        )}
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
      )}
    </>
  );
}
