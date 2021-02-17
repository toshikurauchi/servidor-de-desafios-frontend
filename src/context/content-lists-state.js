import { createContext, useContext, useState, useEffect } from "react";
import { getContentLists } from "../client";

const AppContext = createContext();

export function ContentListsProvider({ children }) {
  const [contentLists, setContentLists] = useState(null);
  const state = { contentLists };

  useEffect(() => {
    getContentLists().then(setContentLists);
  }, []);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useContentLists() {
  const { contentLists } = useContext(AppContext);
  return contentLists;
}
