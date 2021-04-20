import { Box, Typography } from "@material-ui/core";
import { getSession } from "next-auth/client";
import React from "react";
import _ from "lodash";
import { getGrades } from "../src/client";
import QuizFeedback from "../src/components/QuizFeedback";
import { computeQuizAvg } from "../src/models/quiz";

export default function PaginaNotas({ user, grades }) {
  if (!grades)
    return (
      <Typography>
        Não foi possível carregar as notas. Se o problema continuar, avise o
        professor.
      </Typography>
    );
  const schema = grades.schema;
  const quizzes = grades.quizzes[user.username];
  // const codeChallenges = grades.code_challenges[user.username];

  const quizAvg = computeQuizAvg(quizzes, schema.quizzes);
  const examAvg = computeQuizAvg(quizzes, schema.exams);

  return (
    <div>
      <Typography variant="h1" component="h2">
        Minhas notas
      </Typography>

      <Box mb={2} mt={2}>
        <Typography variant="h4" component="h4" gutterBottom>
          Quizzes (média atual: {quizAvg}/10)
        </Typography>
        {schema.quizzes.map((quizSchema) => (
          <QuizFeedback
            key={`quizgrade__${quizSchema.quiz_slug}`}
            schema={quizSchema}
            feedback={quizzes[quizSchema.quiz_slug]}
          />
        ))}
      </Box>

      <Box mb={2} mt={2}>
        <Typography variant="h4" component="h4" gutterBottom>
          Avaliações (média atual: {examAvg}/10)
        </Typography>
        {schema.exams.map((quizSchema) => (
          <QuizFeedback
            key={`examgrade__${quizSchema.quiz_slug}`}
            schema={quizSchema}
            feedback={quizzes[quizSchema.quiz_slug]}
          />
        ))}
      </Box>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, { Location: "/auth/login?callbackUrl=/" });
    res.end();
    return { props: {} };
  }

  const grades = await getGrades(session);

  return {
    props: {
      user: session.user,
      grades,
    },
  };
}
