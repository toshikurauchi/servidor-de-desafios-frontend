import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/client";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/cjs/styles/prism";
import _ from "lodash";
import unified from "unified";
import parse from "remark-parse";
import remark2rehype from "remark-rehype";
import rehype2react from "rehype-react";
import math from "remark-math";
import katex from "rehype-katex";
import raw from "rehype-raw";
import directive from "remark-directive";
import visit from "unist-util-visit";
import h from "hastscript";
import gfm from "remark-gfm";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InfoIcon from "@material-ui/icons/Info";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import ErrorIcon from "@material-ui/icons/Error";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StaticCodeHighlight from "../StaticCodeHighlight";
import Link from "../Link";
import { getChallenge } from "../../client";

const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;

function MarkdownParagraph({ children }) {
  if (children && children[0].type === MarkdownImage) return children;
  return <Typography paragraph={true}>{children}</Typography>;
}

function MarkdownLink({ href, ...props }) {
  let safeHref = href;
  if (href.startsWith("raw/")) safeHref = STATIC_URL + href;
  else if (href.startsWith("/")) safeHref = "/conteudo" + href;
  return <Link href={safeHref} {...props} />;
}

const BaseTable = styled.table`
  margin-bottom: 1rem;
`;

const BaseTd = styled.td`
  padding: 5px 1rem;
`;

const CenteredImg = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  padding: ${(props) => props.theme.spacing(2)}px 0;
`;

function MarkdownImage({ src, alt, ...props }) {
  let safeSrc = src;
  if (src.startsWith("raw/")) safeSrc = STATIC_URL + src;
  return <CenteredImg src={safeSrc} alt={alt} {...props} />;
}

const AdmonitionInfoIcon = styled(InfoIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  color: ${(props) => props.theme.colors.INFO};
`;

const AdmonitionDangerIcon = styled(ErrorIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  color: ${(props) => props.theme.colors.DANGER};
`;

const AdmonitionExerciseIcon = styled(FitnessCenterIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  color: ${(props) => props.theme.colors.EXERCISE};
`;

const AdmonitionSuccessIcon = styled(FitnessCenterIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  color: ${(props) => props.theme.colors.SUCCESS};
`;

const AdmonitionCard = styled(Card)`
  margin: ${(props) => props.theme.spacing(3, 0)};
  border-left: ${(props) => {
    const color = props.theme.colors[props.type.toUpperCase()] || "";
    return props.theme.admonitionLeftBorder + "px solid " + color;
  }};
`;

const AdmonitionCardHeader = styled(CardHeader)`
  padding: ${(props) => props.theme.spacing(1)}px
    ${(props) => props.theme.spacing(2)}px !important;
  background-color: ${(props) =>
    props.theme.colors[
      props.type && props.type.toUpperCase() + "_BACKGROUND"
    ] || ""};
  .MuiTypography-root {
    display: flex !important;
    flex-direction: row;
    align-items: center;
  }
`;

const AdmonitionCardContent = styled(CardContent)`
  padding: ${(props) => {
    const p2 = props.theme.spacing(2) + "px";
    return p2 + " " + p2 + " 0";
  }} !important;
`;

// Admonitions had to be implemented by hand: https://github.com/elviswolcott/remark-admonitions/issues/27
// Implementation based on: https://github.com/remarkjs/remark-directive
// Style and more from: https://squidfunk.github.io/mkdocs-material/reference/admonitions/
function MarkdownAdmonition({ children, type, title, collapse }) {
  const [open, setOpen] = useState(!_.isNil(collapse) ? collapse : true);
  const collapsable = !_.isNil(collapse);

  const toggleOpen = () => {
    setOpen((op) => !op);
    return true;
  };

  const icon =
    (type === "info" && <AdmonitionInfoIcon />) ||
    (type === "danger" && <AdmonitionDangerIcon />) ||
    (type === "exercise" && <AdmonitionExerciseIcon />) ||
    (type === "success" && <AdmonitionSuccessIcon />) ||
    null;

  return (
    <AdmonitionCard type={type}>
      {title && (
        <AdmonitionCardHeader
          type={type}
          title={
            <>
              {icon}
              <MaterialMarkdown raw>{title}</MaterialMarkdown>
            </>
          }
          action={
            collapsable && (
              <IconButton aria-label="mostrar mais">
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )
          }
          onClick={toggleOpen}
          titleTypographyProps={{
            noWrap: true,
          }}
        />
      )}
      <Collapse in={open || !collapsable}>
        <AdmonitionCardContent>{children}</AdmonitionCardContent>
      </Collapse>
    </AdmonitionCard>
  );
}

function MarkdownCodeSnippet({ file, ...props }) {
  const [content, setContent] = useState();

  useEffect(() => {
    fetch(STATIC_URL + file)
      .then((response) => response.text())
      .then(setContent)
      .catch(console.error);
  }, []);

  if (!content) return null;
  return <MarkdownCode {...props}>{[content]}</MarkdownCode>;
}

function MarkdownChallenge({ type, slug }) {
  const [challenge, setChallenge] = useState(undefined);
  useEffect(() => {
    getSession()
      .then((session) => getChallenge(session, type, slug, true))
      .then(setChallenge)
      .catch(console.error);
  }, []);

  const url =
    (type === "trace" && `/teste-de-mesa/${slug}`) ||
    (type === "code" && `/programacao/${slug}`) ||
    null;
  if (!url) return null;
  return <Link href={url}>{challenge ? challenge.title : slug}</Link>;
}

function MarkdownCode({ children, showLineNumbers, className, props }) {
  // We assume there is always a single child
  let language = "python";
  if (_.split(children, "\n").length <= 1) {
    let newChildren = children;
    if (children && children[0].startsWith("#!")) {
      const start = children[0].indexOf(" ");
      language = children[0].substring(2, start);
      newChildren = [children[0].substring(start + 1)];
    }
    return (
      <SyntaxHighlighter
        language={language}
        customStyle={{ padding: "0.1em" }}
        PreTag={"span"}
        style={prism}
        {...props}
      >
        {newChildren}
      </SyntaxHighlighter>
    );
  }
  if (className && className.startsWith("language-"))
    language = className.substring(9);
  return (
    <StaticCodeHighlight
      language={language}
      customStyle={{
        padding: "8px",
      }}
      {...props}
      showLineNumbers={!_.isNil(showLineNumbers)}
    >
      {[_.trim(children[0])]}
    </StaticCodeHighlight>
  );
}

function makeDirectives(directives) {
  return () => (tree) => {
    visit(
      tree,
      ["textDirective", "leafDirective", "containerDirective"],
      (node) => {
        if (!directives.includes(node.name)) return;
        const data = node.data || (node.data = {});
        var hast = h(node.name, node.attributes);

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    );
  };
}

function parseMarkdown(markdown, components) {
  return unified()
    .use(parse)
    .use(gfm)
    .use(directive)
    .use(makeDirectives(["admonition", "snip", "challenge"]))
    .use(math)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(katex)
    .use(raw)
    .use(rehype2react, {
      createElement: React.createElement,
      components: components,
    })
    .processSync(markdown).result;
}

function MaterialMarkdown(props) {
  const { children, raw } = props;

  return parseMarkdown(children, {
    admonition: MarkdownAdmonition,
    snip: MarkdownCodeSnippet,
    challenge: MarkdownChallenge,
    img: MarkdownImage,
    a: MarkdownLink,
    code: MarkdownCode,
    p: _.isNil(raw) ? MarkdownParagraph : "span",
    table: BaseTable,
    td: BaseTd,
  });
}

export default MaterialMarkdown;
