import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import { loadQuiz, getRemainingQuizTime } from "../client";

const AppContext = createContext();

export function QuizProvider({ children }) {
  const [session, loading] = useSession();
  const [quiz, setQuiz] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const setQuizAndTime = (quiz) => {
    if (quiz) {
      quiz.endTime = Date.now() + quiz.remaining_seconds * 1000;
    }
    setQuiz(quiz);
  };
  const quizState = {
    quiz,
    setQuiz: setQuizAndTime,
    reloadQuiz: () => setLoadingQuiz(true),
  };

  useEffect(() => {
    if (session && loadingQuiz) {
      loadQuiz(session)
        .then(setQuizAndTime)
        .finally(() => setLoadingQuiz(false));
    }
  }, [session, loadingQuiz]);

  return (
    <AppContext.Provider value={quizState}>{children}</AppContext.Provider>
  );
}

export function useQuiz() {
  return useContext(AppContext);
}
