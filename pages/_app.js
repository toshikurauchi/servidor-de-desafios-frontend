import React, { useEffect } from "react";
import Head from "next/head";
import { Provider } from "next-auth/client";
import { ThemeProvider } from "styled-components";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Reset } from "styled-reset";
import theme from "../src/theme";
import AppBar from "../src/components/AppBar";

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
      </Head>
      <Reset />
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <Provider session={pageProps.session}>
            <AppBar />
            <Component {...pageProps} />
          </Provider>
        </ThemeProvider>
      </MuiThemeProvider>
    </React.Fragment>
  );
}
