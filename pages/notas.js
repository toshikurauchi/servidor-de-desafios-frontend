import { Box, Typography } from "@material-ui/core";
import { getSession } from "next-auth/client";
import React from "react";
import _ from "lodash";
import { getGrades } from "../src/client";
import QuizFeedback from "../src/components/QuizFeedback";
import { computeQuizAvg } from "../src/models/quiz";
import { computeProjectAvg } from "../src/models/project";

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
  const codeChallenges = grades.code_exercises[user.username];

  const quizAvg = computeQuizAvg(quizzes, schema.quizzes);
  const examAvg = computeQuizAvg(quizzes, schema.exams);
  const projectAvg = computeProjectAvg(codeChallenges, schema.code_exercises);
  const examGrade =
    Math.round(schema.quiz_weight * quizAvg + examAvg * 100) / 100;
  const finalGrade =
    examGrade >= 5 && projectAvg >= 5
      ? (examGrade + projectAvg) / 2
      : Math.min(examGrade, projectAvg);

  return (
    <div>
      <Typography variant="h1" component="h2">
        Minhas notas
      </Typography>

      <Box mb={2} mt={2} border={1} p={2}>
        <Typography variant="h5" component="p" gutterBottom>
          Nota de Avaliações:{" "}
          <span style={{ color: examGrade < 5 ? "red" : "green" }}>
            {examGrade}
          </span>
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Nota de Projetos:{" "}
          <span style={{ color: projectAvg < 5 ? "red" : "green" }}>
            {projectAvg}
          </span>
        </Typography>
        <Typography variant="h4" component="p" gutterBottom>
          Nota de Projetos:{" "}
          <span style={{ color: finalGrade < 5 ? "red" : "green" }}>
            {finalGrade}
          </span>
        </Typography>
        <Typography component="p">
          * As notas podem não ser finais. As avaliações e projetos que ainda
          não foram corrigidos foram considerados com nota zero.
        </Typography>
        <Typography component="p">
          ** Você precisa ter nota maior ou igual a 5 em ambos os critérios.
          Caso contrário, será considerada a menor das duas notas.
        </Typography>
      </Box>

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

      <Box mb={2} mt={2}>
        <Typography variant="h4" component="h4" gutterBottom>
          Projetos (média atual: {projectAvg}/10)
        </Typography>
        {schema.code_exercises.map((projectSchema) => {
          const projectData = codeChallenges[projectSchema.slug];
          return (
            <Box mb={1} mt={1} key={`project__${projectSchema.slug}`}>
              <Typography variant="h5">
                {projectSchema.name} (Peso: {projectSchema.weight}%)
              </Typography>
              {projectSchema.manual_grade_weight < 100 && (
                <div>
                  Nota Automática (peso{" "}
                  {100 - projectSchema.manual_grade_weight}%):{" "}
                  {projectData.auto_grade || 0}
                </div>
              )}
              {projectSchema.manual_grade_weight > 0 && (
                <div>
                  Nota Manual (peso {projectSchema.manual_grade_weight}%):{" "}
                  {projectData.manual_grade || 0}
                </div>
              )}
              {projectData.feedback && (
                <div>Feedback: {projectData.feedback}</div>
              )}
            </Box>
          );
        })}
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
