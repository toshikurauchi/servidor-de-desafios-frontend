import React from "react";
import Typography from "@material-ui/core/Typography";
import { Box, Button, LinearProgress, Paper } from "@material-ui/core";
import _ from "lodash";
import Link from "../Link";
import DifficultyBar from "../DifficultyBar";
import LinearProgressWithLabel from "../LinearProgressWithLabel";

function groupInteractionsByDifficulty(
  codeChallenges,
  codeInteractionsBySlug,
  countAttempts = false
) {
  if (!codeChallenges) return {};

  return codeChallenges
    .map((codeChallenge) => {
      const interactions = codeInteractionsBySlug[codeChallenge.slug];
      return [
        codeChallenge.difficulty,
        interactions?.completed || (countAttempts && interactions?.attempts)
          ? 1
          : 0,
      ];
    })
    .reduce((a, b) => {
      const [difficulty, count] = b;
      if (!a) return { [difficulty]: count };
      if (a[difficulty]) a[difficulty] += count;
      else a[difficulty] = count;
      return a;
    }, {});
}

function countByDifficulty(codeChallenges) {
  if (!codeChallenges) return {};

  return codeChallenges
    .map((codeChallenge) => codeChallenge.difficulty)
    .reduce((a, b) => {
      if (!a) return { [b]: 0 };
      if (a[b]) a[b] += 1;
      else a[b] = 1;
      return a;
    }, {});
}

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
  const totalCodeChallenges = countByDifficulty(codeChallenges);
  const totalTraceChallenges = traceChallenges ? traceChallenges.length : 0;
  const completedCodeChallenges = groupInteractionsByDifficulty(
    codeChallenges,
    codeInteractionsBySlug
  );
  const completedTraceChallenges = traceChallenges
    ? traceChallenges
        .map((trace) => {
          const interactions = traceInteractionsBySlug[trace.slug];
          return interactions?.completed ? 1 : 0;
        })
        .reduce((a, b) => a + b, 0)
    : 0;
  const attemptedCodeChallenges = groupInteractionsByDifficulty(
    codeChallenges,
    codeInteractionsBySlug,
    true
  );
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
        {_.isEmpty(totalCodeChallenges) ? null : (
          <>
            <Typography>Exercícios de Programação:</Typography>
            {_.toPairs(totalCodeChallenges).map(([difficulty, total]) => (
              <div key={`difficulty__${difficulty}`}>
                <Typography>
                  <DifficultyBar difficulty={difficulty} />
                </Typography>
                <LinearProgressWithLabel
                  value={completedCodeChallenges[difficulty]}
                  intermediateValue={attemptedCodeChallenges[difficulty]}
                  maxValue={total}
                />
              </div>
            ))}
          </>
        )}
        {totalTraceChallenges ? (
          <>
            <Typography>Testes de Mesa:</Typography>
            <LinearProgressWithLabel
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
