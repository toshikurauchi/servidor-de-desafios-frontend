import React from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import MaterialMarkdown from "../../src/components/MaterialMarkdown";
import {
  getContentLists,
  getPage,
  listCodeChallenges,
  listTraceChallenges,
} from "../../src/client";
import ContentChallenges from "../../src/components/ContentChallenges";

function ContentPage(props) {
  const router = useRouter();
  const [contentSlug, pageSlug] = router.query.slug;

  if (pageSlug === "exercicios") return <ContentChallenges {...props} />;
  return <MaterialMarkdown>{props.mdContent}</MaterialMarkdown>;
}

export default ContentPage;

export async function getServerSideProps(context) {
  const [contentSlug, pageSlug] = context.query.slug;
  const session = await getSession({ req: context.req });
  let props = {};

  if (!session) {
    context.res.writeHead(302, { Location: "/login" });
    context.res.end();
  }

  const contentLists = await getContentLists(session);
  props = { ...props, contentLists };

  if (pageSlug === "exercicios") {
    const content = contentLists.topics.find((c) => c.slug === contentSlug);
    if (content) {
      const concept = content.concept;
      const [challenges, traces] = await Promise.all([
        listCodeChallenges(session, concept),
        listTraceChallenges(session, concept),
      ]);
      props = { ...props, content, challenges, traces };
    } else {
      context.res.writeHead(404);
      context.res.end();
    }
  } else {
    props["mdContent"] = await getPage(session, contentSlug, pageSlug);
  }

  return {
    props,
  };
}
