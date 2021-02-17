import React from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import MaterialMarkdown from "../../src/components/MaterialMarkdown";
import { getPage } from "../../src/client";
import ContentChallenges from "../../src/components/ContentChallenges";
import { useContentLists } from "../../src/context/content-lists-state";

function ContentPage(props) {
  const router = useRouter();
  const [contentSlug, pageSlug] = router.query.slug;
  const contentLists = useContentLists();

  if (pageSlug === "exercicios") {
    if (!contentLists) return null;
    const content = contentLists.topics.find((c) => c.slug === contentSlug);
    return <ContentChallenges content={content} {...props} />;
  }
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

  if (pageSlug !== "exercicios") {
    props["mdContent"] = await getPage(session, contentSlug, pageSlug);
  }

  return {
    props,
  };
}
