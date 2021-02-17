import React, { useState, useEffect } from "react";
import _ from "lodash";
import { getSession } from "next-auth/client";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { getInteractions, listConcepts } from "../src/client";
import { groupBySlug } from "../src/models/interaction";
import ContentSummary from "../src/components/ContentSummary";
import { useContentLists } from "../src/context/content-lists-state";
import { useCodeChallenges } from "../src/context/code-challenges-state";
import { useTraceChallenges } from "../src/context/trace-challenges-state";

function addTo(dst) {
  return (challenge) => {
    const slug = challenge.concept.slug;
    if (!dst[slug]) dst[slug] = [];
    dst[slug].push(challenge);
  };
}

export default function Home({
  user,
  codeInteractionsBySlug,
  traceInteractionsBySlug,
  conceptsBySlug,
}) {
  const [codeChallengesByConcept, setCodeChallengesByConcept] = useState({});
  const [traceChallengesByConcept, setTraceChallengesByConcept] = useState({});
  const contentLists = useContentLists();
  const codeChallenges = useCodeChallenges();
  const traceChallenges = useTraceChallenges();

  useEffect(() => {
    if (!codeChallenges) return;
    const byConcept = {};
    codeChallenges.forEach(addTo(byConcept));
    setCodeChallengesByConcept(byConcept);
  }, codeChallenges);

  useEffect(() => {
    if (!traceChallenges) return;
    const byConcept = {};
    traceChallenges.forEach(addTo(byConcept));
    setTraceChallengesByConcept(byConcept);
  }, traceChallenges);

  if (!user || _.isEmpty(user)) return null;
  return (
    <>
      <Typography variant="h1">{`${user.firstName} ${user.lastName}`}</Typography>
      <Typography variant="h3" paragraph={true}>
        Progresso
      </Typography>
      <Grid container spacing={1}>
        {contentLists &&
          contentLists.topics.map((content, idx) => (
            <Grid
              item
              key={content.slug}
              xs={3}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <ContentSummary
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
                idx={idx}
                content={content}
                codeInteractionsBySlug={codeInteractionsBySlug}
                traceInteractionsBySlug={traceInteractionsBySlug}
                codeChallenges={codeChallengesByConcept[content.concept]}
                traceChallenges={traceChallengesByConcept[content.concept]}
                conceptsBySlug={conceptsBySlug}
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/auth/login?callbackUrl=/" });
    res.end();
    return { props: {} };
  }

  const [codeInteractions, traceInteractions, concepts] = await Promise.all([
    getInteractions(session, "code"),
    getInteractions(session, "trace"),
    listConcepts(session),
  ]);

  const codeInteractionsBySlug = groupBySlug(codeInteractions);
  const traceInteractionsBySlug = groupBySlug(traceInteractions);
  const conceptsBySlug = _.fromPairs(
    concepts.map((concept) => [concept.slug, concept])
  );

  return {
    props: {
      user: session.user,
      codeInteractionsBySlug,
      traceInteractionsBySlug,
      conceptsBySlug,
    },
  };
}
