import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/prism";
import _ from "lodash";
import { getChallenge, getSubmissionCode } from "../../client";
import { useSession } from "next-auth/client";
import CodeChallengeDetails from "../CodeChallengeDetails";
import StaticCodeHighlight from "../StaticCodeHighlight";

export default function QuizSubmissionView({
  challengeSlug,
  challengeFeedback,
  hasManualAssessment,
}) {
  const [challenge, setChallenge] = useState();
  const [code, setCode] = useState();
  const [session, loading] = useSession();

  const {
    submission_id: submissionId,
    feedback,
    manual_grade: manualGrade,
    auto_grade: autoGrade,
  } = challengeFeedback;
  console.log(challengeFeedback, hasManualAssessment);

  useEffect(() => {
    if (!_.isNumber(submissionId) || !session) return;
    getSubmissionCode(session, challengeSlug, submissionId).then((res) => {
      setCode(res.code);
    });
    getChallenge(session, "code", challengeSlug).then(setChallenge);
  }, [submissionId, session]);
  return (
    <Box m={1}>
      {challenge && <CodeChallengeDetails challenge={challenge} />}
      {code && <StaticCodeHighlight style={vs}>{code}</StaticCodeHighlight>}
      <Box mt={2} mb={4}>
        {feedback && (
          <>
            <Typography variant="h5" color="error">
              Feedback:
            </Typography>
            <pre style={{ color: "red" }}>{feedback}</pre>
          </>
        )}
        {hasManualAssessment && (
          <>
            <Typography color="error">
              Correção automática: {autoGrade}
            </Typography>
            <Typography color="error">
              Correção manual: {manualGrade || 0}
            </Typography>
          </>
        )}
        <Typography color="error">
          <b>TOTAL{hasManualAssessment ? "" : " (correção automática)"}:</b>{" "}
          {(manualGrade || 0) + (autoGrade || 0)}
        </Typography>
      </Box>
    </Box>
  );
}
