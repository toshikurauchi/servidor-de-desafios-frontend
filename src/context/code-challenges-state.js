import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import { listCodeChallenges } from "../client";

const AppContext = createContext();

export function CodeChallengesProvider({ children }) {
  const [session, loading] = useSession();
  const [challenges, setChallenges] = useState(null);

  const update = () => {
    if (session)
      listCodeChallenges(session).then((challenges) => {
        challenges.sort((a, b) => {
          if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
          return a.weight - b.weight;
        });
        setChallenges(challenges);
      });
  };

  useEffect(update, [session]);

  const state = { challenges, update };
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useCodeChallenges(concept) {
  const { challenges, update } = useContext(AppContext);
  if (challenges?.length && !challenges[0].difficulty) update();
  if (challenges && concept) {
    return challenges.filter((challenge) => challenge.concept.slug == concept);
  }
  return challenges;
}
