import React from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import MaterialMarkdown from "../../src/components/MaterialMarkdown";
import {
  getContentLists,
  getPage,
  listCodeChallenges,
  listTraceChallenges,
  getInteractions,
  loadQuiz,
} from "../../src/client";
import { saveQuizSlug, loadQuizSlug } from "../../src/cookies";
import { groupBySlug } from "../../src/models/interaction";
import ContentChallenges from "../../src/components/ContentChallenges";

function ContentPage(props) {
  const router = useRouter();
  const [contentSlug, pageSlug] = router.query.slug;

  if (pageSlug === "exercicios") return <ContentChallenges {...props} />;
  return <MaterialMarkdown>{props.mdContent}</MaterialMarkdown>;
}

export default ContentPage;

export async function getServerSideProps({ req, res, query }) {
  const [contentSlug, pageSlug] = query.slug;
  const session = await getSession({ req });
  let props = {};

  if (!session) {
    res.writeHead(302, {
      Location: `/auth/login?callbackUrl=/conteudo/${contentSlug}/${
        pageSlug || ""
      }`,
    });
    res.end();
    return { props: {} };
  }

  const contentLists = await getContentLists(session);
  props = { ...props, contentLists };

  if (pageSlug === "exercicios") {
    const content = contentLists.topics.find((c) => c.slug === contentSlug);
    if (content) {
      const concept = content.concept;
      const [
        challenges,
        traces,
        challengeInteractions,
        traceInteractions,
      ] = await Promise.all([
        listCodeChallenges(session, concept),
        listTraceChallenges(session, concept),
        getInteractions(session, "code"),
        getInteractions(session, "trace"),
      ]);

      const challengeInteractionsBySlug = groupBySlug(challengeInteractions);
      const traceInteractionsBySlug = groupBySlug(traceInteractions);

      props = {
        ...props,
        content,
        challenges,
        traces,
        challengeInteractionsBySlug,
        traceInteractionsBySlug,
      };
    } else {
      res.writeHead(404);
      res.end();
      return { props };
    }
  } else {
    props["mdContent"] = await getPage(session, contentSlug, pageSlug);
  }

  let currentQuiz = null;
  const quizSlug = loadQuizSlug(req, res);
  if (quizSlug) {
    currentQuiz = await loadQuiz(session, quizSlug);
    if (currentQuiz) currentQuiz.slug = quizSlug;
  } else {
    saveQuizSlug(null, req, res);
  }
  props["currentQuiz"] = currentQuiz;

  return {
    props,
  };
}
