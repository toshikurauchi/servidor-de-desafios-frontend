import React from "react";
import Typography from "@material-ui/core/Typography";
import { Box, Button, Paper } from "@material-ui/core";
import _ from "lodash";

import CircularProgressWithLabel from "../CircularProgressWithLabel";
import Link from "../Link";

export default function ContentSummary({
  content,
  codeInteractionsBySlug,
  traceInteractionsBySlug,
  codeChallenges,
  traceChallenges,
  conceptsBySlug,
  idx,
  ...props
}) {
  const totalCodeChallenges = codeChallenges ? codeChallenges.length : 0;
  const totalTraceChallenges = traceChallenges ? traceChallenges.length : 0;
  const completedCodeChallenges = codeChallenges
    ? codeChallenges
        .map((codeChallenge) => {
          const interactions = codeInteractionsBySlug[codeChallenge.slug];
          return interactions ? interactions.completed : 0;
        })
        .reduce((a, b) => a + b, 0)
    : 0;
  const completedTraceChallenges = traceChallenges
    ? traceChallenges
        .map((trace) => {
          const interactions = traceInteractionsBySlug[trace.slug];
          return interactions ? interactions.completed : 0;
        })
        .reduce((a, b) => a + b, 0)
    : 0;
  const concept = conceptsBySlug[content.concept];
  const conceptName = concept ? concept.name : "";

  return (
    <Paper {...props}>
      <Box
        p={1}
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <Typography variant="h5" component="h3" gutterBottom>
          {_.padStart(idx + 1, 2, "0") + ". " + conceptName}
        </Typography>
        {totalCodeChallenges ? (
          <>
            <Typography>Exercícios de Programação:</Typography>
            <CircularProgressWithLabel
              value={completedCodeChallenges}
              maxValue={totalCodeChallenges}
            />
          </>
        ) : null}
        {totalTraceChallenges ? (
          <>
            <Typography>Testes de Mesa:</Typography>
            <CircularProgressWithLabel
              value={completedTraceChallenges}
              maxValue={totalTraceChallenges}
            />
          </>
        ) : null}
        <Box mt="auto">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            href={`/conteudo/${content.slug}`}
          >
            Handout
          </Button>
        </Box>
        <Box mt={1}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            href={`/conteudo/${content.slug}/exercicios`}
          >
            Exercícios
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
