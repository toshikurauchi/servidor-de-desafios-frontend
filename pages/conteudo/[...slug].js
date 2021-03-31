import React from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import MaterialMarkdown from "../../src/components/MaterialMarkdown";
import { getPage, listPages } from "../../src/client";
import ContentChallenges from "../../src/components/ContentChallenges";
import { useContentLists } from "../../src/context/content-lists-state";

function ContentPage({ contentSlug, pageSlug, mdContent, ...props }) {
  const contentLists = useContentLists();

  if (pageSlug === "exercicios") {
    if (!contentLists) return null;
    const content = contentLists.topics.find((c) => c.slug === contentSlug);
    return <ContentChallenges content={content} {...props} />;
  }
  return <MaterialMarkdown>{mdContent}</MaterialMarkdown>;
}

export default ContentPage;

export async function getStaticProps({ params }) {
  const [contentSlug, pageSlug] = params.slug;
  const props = {
    contentSlug: contentSlug || null,
    pageSlug: pageSlug || null,
  };

  if (pageSlug !== "exercicios") {
    props["mdContent"] = await getPage(contentSlug, pageSlug);
  }

  return {
    props,
  };
}

export async function getStaticPaths() {
  const pages = await listPages();

  return {
    paths: pages.map((p) => ({
      params: {
        slug: p.split("/"),
      },
    })),
    fallback: true,
  };
}
