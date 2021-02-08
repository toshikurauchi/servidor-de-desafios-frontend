import React from "react";
import _ from "lodash";
import { getSession } from "next-auth/client";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {
  getContentLists,
  getInteractions,
  listCodeChallenges,
  listTraceChallenges,
  listConcepts,
} from "../src/client";
import { groupBySlug } from "../src/models/interaction";
import ContentSummary from "../src/components/ContentSummary";

export default function Home({
  user,
  codeInteractionsBySlug,
  traceInteractionsBySlug,
  codeChallengesByConcept,
  traceChallengesByConcept,
  conceptsBySlug,
  contentLists,
}) {
  if (!user || _.isEmpty(user)) return null;
  return (
    <>
      <Typography variant="h1">{`${user.firstName} ${user.lastName}`}</Typography>
      <Typography variant="h3" paragraph={true}>
        Progresso
      </Typography>
      <Grid container spacing={1}>
        {contentLists.topics.map((content, idx) => (
          <Grid
            item
            key={content.slug}
            xs={3}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <ContentSummary
              style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
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

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    context.res.writeHead(302, { Location: "/login?callbackUrl=/" });
    context.res.end();
    return;
  }

  const [
    contentLists,
    codeInteractions,
    traceInteractions,
    concepts,
    codeChallenges,
    traceChallenges,
  ] = await Promise.all([
    getContentLists(session),
    getInteractions(session, "code"),
    getInteractions(session, "trace"),
    listConcepts(session),
    listCodeChallenges(session),
    listTraceChallenges(session),
  ]);

  const codeInteractionsBySlug = groupBySlug(codeInteractions);
  const traceInteractionsBySlug = groupBySlug(traceInteractions);
  const conceptsBySlug = _.fromPairs(
    concepts.map((concept) => [concept.slug, concept])
  );

  const codeChallengesByConcept = {};
  const traceChallengesByConcept = {};

  const addTo = (dst) => (challenge) => {
    const slug = challenge.concept.slug;
    if (!dst[slug]) dst[slug] = [];
    dst[slug].push(challenge);
  };

  codeChallenges.forEach(addTo(codeChallengesByConcept));
  traceChallenges.forEach(addTo(traceChallengesByConcept));

  return {
    props: {
      user: session.user,
      codeInteractionsBySlug,
      traceInteractionsBySlug,
      conceptsBySlug,
      contentLists,
      codeChallengesByConcept,
      traceChallengesByConcept,
    },
  };
}
