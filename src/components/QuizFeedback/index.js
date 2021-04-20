import React from "react";
import _ from "lodash";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import QuizSubmissionView from "../QuizSubmissionView";
import { computeQuizGrade } from "../../models/quiz";

export default function QuizFeedback({ schema, feedback }) {
  const {
    quiz_slug: quizSlug,
    title: quizTitle,
    has_manual_assessment: hasManualAssessment,
  } = schema;
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${quizSlug}-content`}
        id={`${quizSlug}-header`}
      >
        <Typography>
          {quizTitle}: {computeQuizGrade(feedback)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column">
          {_.entries(feedback).map(([challengeSlug, challengeFeedback]) => (
            <QuizSubmissionView
              key={`submission__${challengeFeedback.submission_id}`}
              challengeSlug={challengeSlug}
              challengeFeedback={challengeFeedback}
              hasManualAssessment={hasManualAssessment}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
