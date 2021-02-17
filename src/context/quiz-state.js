import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import { loadQuiz } from "../client";

const AppContext = createContext();

export function QuizProvider({ children }) {
  const [session, loading] = useSession();
  const [quiz, setQuiz] = useState(null);
  const quizState = { quiz, setQuiz };

  useEffect(() => {
    if (session) loadQuiz(session).then(setQuiz);
  }, [session]);

  return (
    <AppContext.Provider value={quizState}>{children}</AppContext.Provider>
  );
}

export function useQuiz() {
  return useContext(AppContext);
}
