import React, { forwardRef } from "react";
import Typography from "@material-ui/core/Typography";
import CodeChallengeFeedback from "../CodeChallengeFeedback";

const CodeChallengeFeedbackList = forwardRef((props, ref) => {
  return (
    <React.Fragment>
      <Typography ref={ref} variant="h2" component="h1" gutterBottom={true}>
        Feedback
      </Typography>

      {props.submissions && props.submissions.length ? (
        props.submissions.map((submission, idx) => (
          <CodeChallengeFeedback
            key={`submission-${submission.id}`}
            submission={submission}
            onLoadButtonClick={props.onLoadButtonClick}
            expanded={idx === 0}
          />
        ))
      ) : (
        <Typography>Aguardando a sua submissão</Typography>
      )}
    </React.Fragment>
  );
});

export default CodeChallengeFeedbackList;
