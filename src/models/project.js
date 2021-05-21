import _ from "lodash";

export function computeProjectGrade(projectData, projectSchema) {
  if (!projectData) return 0;
  const autoGrade = projectData.auto_grade || 0;
  const manualGrade = projectData.manual_grade || 0;
  return (
    ((autoGrade * (100 - projectSchema.manual_grade_weight) +
      manualGrade * projectSchema.manual_grade_weight) /
      100) *
    projectSchema.weight
  );
}

export function computeProjectAvg(codeChallenges, schema) {
  if (!codeChallenges || !schema) return 0;
  return (
    Math.round(
      schema
        .map((projectSchema) =>
          computeProjectGrade(codeChallenges[projectSchema.slug], projectSchema)
        )
        .reduce((a, b) => a + b)
    ) / 100
  );
}
