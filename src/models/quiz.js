import _ from "lodash";

export function computeQuestionGrade(questionData) {
  return (questionData.auto_grade || 0) + (questionData.manual_grade || 0);
}

export function computeQuizGrade(quizData) {
  return (
    Math.round(
      _.values(quizData)
        .map(computeQuestionGrade)
        .reduce((a, b) => a + b, 0) * 100
    ) / 100
  );
}

export function computeQuizAvg(quizzes, schema, discardOne = true) {
  const quizGrades = schema.map(
    ({ quiz_slug: quizSlug, weight }) =>
      computeQuizGrade(quizzes[quizSlug]) * weight
  );
  let minQuizGrade;
  if (discardOne) {
    const quizTotalWeight = schema
      .map(({ weight }) => weight)
      .reduce((a, b) => a + b, 0);
    if (quizTotalWeight < 100) quizGrades.push(0);
    minQuizGrade = Math.min(...quizGrades);
  } else minQuizGrade = 0;
  return Math.round(quizGrades.reduce((a, b) => a + b, 0) - minQuizGrade) / 100;
}
