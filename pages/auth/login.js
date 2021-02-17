import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useRouter } from "next/router";
import { signIn } from "next-auth/client";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import theme from "../../src/theme";
import Link from "../../src/components/Link";

const GlobalStyle = createGlobalStyle`
body {
  background-color: ${theme.colors.BLUE2} !important;
}
`;

const CenteredContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;
`;

const LogoImgBase = styled.img`
  max-height: 30vh;
`;

const LoginBackBase = styled(Paper)`
  background-color: ${(props) => props.theme.colors.GRAY2};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Login({ csrfToken }) {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [filled, setFilled] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();
  const hasError =
    router.query.error && router.query.error === "CredentialsSignin";

  const updateFilled = () => {
    setFilled(
      usernameRef.current &&
        usernameRef.current.value &&
        passwordRef.current &&
        passwordRef.current.value
    );
  };

  useEffect(updateFilled, [usernameRef.current, passwordRef.current]);

  const setError = (errorSetter) => {
    return (event) => {
      updateFilled();
      let value = event.target.value;
      let error = "";
      if (!value) error = "Não pode ser vazio";
      errorSetter(error);
    };
  };

  const handleUsernameChanged = setError(setUsernameError);
  const handlePasswordChanged = setError(setPasswordError);

  const handleSubmit = (event) => {
    event.preventDefault();

    let username = usernameRef.current.value;
    if (username.endsWith("insper.edu.br")) {
      username = username.substring(0, username.indexOf("@"));
    }
    signIn("credentials", {
      username: username,
      password: passwordRef.current.value,
      callbackUrl: router.query.callbackUrl || "/",
    });
  };

  return (
    <CenteredContent height="100%">
      <GlobalStyle />
      <LogoImgBase src="/img/logo-big-pt.png" />
      <LoginBackBase elevation={3}>
        <CenteredContent p={2}>
          <Typography variant="h2" color="textPrimary">
            Login
          </Typography>

          <CenteredContent
            component="form"
            m={2}
            style={{ minWidth: "40vw" }}
            onSubmit={handleSubmit}
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <TextField
              id="id-username"
              inputRef={usernameRef}
              onChange={handleUsernameChanged}
              label="Usuário"
              variant="outlined"
              required={true}
              name="username"
              autoFocus={true}
              autoCapitalize="none"
              autoComplete="username"
              maxLength="150"
              helperText={usernameError}
              error={Boolean(usernameError)}
              fullWidth
            />

            <TextField
              id="id-password"
              inputRef={passwordRef}
              onChange={handlePasswordChanged}
              label="Senha"
              variant="outlined"
              type="password"
              required={true}
              name="password"
              autoComplete="current-password"
              helperText={passwordError}
              error={Boolean(passwordError)}
              fullWidth
            />

            <Button
              variant="contained"
              color="secondary"
              type="submit"
              fullWidth
              disabled={!filled}
            >
              Login
            </Button>
            {hasError && (
              <FormHelperText error={true}>
                Usuário ou senha incorretos
              </FormHelperText>
            )}
            <Typography>
              Ainda não possui cadastro?{" "}
              <Link href="/auth/signup">Clique aqui para se cadastrar</Link>.
            </Typography>
          </CenteredContent>
        </CenteredContent>
      </LoginBackBase>
    </CenteredContent>
  );
}
