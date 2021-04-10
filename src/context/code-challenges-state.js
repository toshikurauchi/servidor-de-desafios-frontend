import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import { listCodeChallenges } from "../client";

const AppContext = createContext();

export function CodeChallengesProvider({ children }) {
  const [session, loading] = useSession();
  const [challenges, setChallenges] = useState(null);
  const state = { challenges };

  useEffect(() => {
    if (session)
      listCodeChallenges(session).then((challenges) => {
        challenges.sort((a, b) => {
          if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
          return a.weight - b.weight;
        });
        setChallenges(challenges);
      });
  }, [session]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useCodeChallenges(concept) {
  const { challenges } = useContext(AppContext);
  if (challenges && concept) {
    return challenges.filter((challenge) => challenge.concept.slug == concept);
  }
  return challenges;
}
