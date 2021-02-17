import React, { useEffect } from "react";
import styled from "styled-components";
import Head from "next/head";
import { Provider } from "next-auth/client";
import { ThemeProvider } from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import theme from "../src/theme";
import AppBar from "../src/components/AppBar";
import { QuizProvider } from "../src/context/quiz-state";

const MainBase = styled.main`
  width: 500px;
  flex-grow: 1;
`;

const ToolbarDiv = styled.div`
  ${(props) => props.theme.mixins.toolbar}
`;

const FlexBox = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Root = styled.div`
  display: flex;
`;

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode)
      jssStyles.parentNode.removeChild(jssStyles);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Academia Python</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
          integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
          crossorigin="anonymous"
        ></link>
      </Head>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <Provider session={pageProps.session}>
            <QuizProvider>
              <Root>
                <AppBar contentLists={pageProps.contentLists} />
                <MainBase>
                  {pageProps.contentLists && <ToolbarDiv />}
                  <FlexBox m={3}>
                    <Component {...pageProps} />
                  </FlexBox>
                </MainBase>
              </Root>
            </QuizProvider>
          </Provider>
        </ThemeProvider>
      </MuiThemeProvider>
    </React.Fragment>
  );
}
