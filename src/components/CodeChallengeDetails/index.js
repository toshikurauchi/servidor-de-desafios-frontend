import React from "react";
import { Typography } from "@material-ui/core";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/cjs/styles/prism";
import MaterialMarkdown from "../MaterialMarkdown";

export default function CodeChallengeDetails({ challenge }) {
  const functionName =
    challenge && challenge.function_name ? (
      <Typography paragraph={true}>
        O nome da sua função deve ser{" "}
        <SyntaxHighlighter
          language="python"
          customStyle={{ padding: "0.1em" }}
          PreTag={"span"}
          style={prism}
        >
          {challenge.function_name}
        </SyntaxHighlighter>
      </Typography>
    ) : (
      ""
    );

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom={true}>
        {challenge.title}
      </Typography>
      <MaterialMarkdown>{challenge.question}</MaterialMarkdown>
      {functionName}
    </>
  );
}
