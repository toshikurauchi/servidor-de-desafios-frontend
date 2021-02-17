import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import { listTraceChallenges } from "../client";

const AppContext = createContext();

export function TraceChallengesProvider({ children }) {
  const [session, loading] = useSession();
  const [challenges, setChallenges] = useState(null);
  const state = { challenges };

  useEffect(() => {
    if (session) listTraceChallenges(session).then(setChallenges);
  }, [session]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useTraceChallenges(concept) {
  const { challenges } = useContext(AppContext);
  if (challenges && concept) {
    return challenges.filter((challenge) => challenge.concept.slug == concept);
  }
  return challenges;
}
