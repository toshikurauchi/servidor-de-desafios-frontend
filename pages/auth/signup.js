import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { csrfToken } from "next-auth/client";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import theme from "../../src/theme";
import Link from "../../src/components/Link";
import axios from "axios";

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

export default function SignUp({ csrfToken }) {
  const [hasError, setHasError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(
    ""
  );

  const setOrError = (setter, errorSetter, validate) => {
    return (event) => {
      let value = event.target.value;
      let error = "";
      if (!value) error = "Não pode ser vazio";
      else if (validate) {
        error = validate(value);
      }
      setter(value);
      errorSetter(error);
    };
  };

  const handleFirstNameChanged = setOrError(setFirstName, setFirstNameError);
  const handleLastNameChanged = setOrError(setLastName, setLastNameError);
  const handleEmailChanged = setOrError(setEmail, setEmailError, (email) => {
    const atPos = email.indexOf("@");

    if (atPos < 0) return "Não é um endereço de e-mail válido";
    const username = email.substring(0, atPos);
    if (!username) return "Não é um endereço de e-mail válido";
    if (
      !email
        .substring(atPos + 1)
        .trim()
        .endsWith("insper.edu.br")
    )
      return "Por favor, utilize seu e-mail Insper";
    return "";
  });
  const handlePasswordChanged = setOrError(
    setPassword,
    setPasswordError,
    (password) => {
      if (password === passwordConfirmation) setPasswordConfirmationError("");
      else setPasswordConfirmationError("As senhas não são iguais");
      if (password.length < 6)
        return "Sua senha deve ter pelo menos 6 caracteres";
      return "";
    }
  );
  const handlePasswordConfirmationChanged = setOrError(
    setPasswordConfirmation,
    setPasswordConfirmationError,
    (confirmation) => {
      if (password !== confirmation) return "As senhas não são iguais";
      return "";
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("/api/signup", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      })
      .then((res) => {
        if (res.data.code === 0) setSubmitted(true);
        else setHasError(true);
      });
  };

  const isValid =
    firstName &&
    lastName &&
    email &&
    password &&
    !firstNameError &&
    !lastNameError &&
    !emailError &&
    !passwordError &&
    !passwordConfirmationError;
  return (
    <CenteredContent height="100%">
      <GlobalStyle />
      <LogoImgBase src="/img/logo-big-pt.png" />
      <LoginBackBase elevation={3}>
        <CenteredContent p={2}>
          <Typography variant="h2" color="textPrimary">
            Cadastro
          </Typography>

          {!submitted ? (
            <CenteredContent
              component="form"
              m={2}
              style={{ minWidth: "40vw" }}
              onSubmit={handleSubmit}
            >
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

              <TextField
                id="id-first-name"
                onChange={handleFirstNameChanged}
                label="Nome"
                variant="outlined"
                required={true}
                name="first-name"
                autoFocus={true}
                autoCapitalize="words"
                autoComplete="first-name"
                maxLength="150"
                helperText={firstNameError}
                error={Boolean(firstNameError)}
                fullWidth
              />

              <TextField
                id="id-last-name"
                onChange={handleLastNameChanged}
                label="Sobrenome"
                variant="outlined"
                required={true}
                name="last-name"
                autoCapitalize="words"
                autoComplete="last-name"
                maxLength="150"
                helperText={lastNameError}
                error={Boolean(lastNameError)}
                fullWidth
              />

              <TextField
                id="id-email"
                onChange={handleEmailChanged}
                label="E-mail"
                variant="outlined"
                type="email"
                required={true}
                name="email"
                autoCapitalize="none"
                autoComplete="email"
                maxLength="150"
                helperText={emailError}
                error={Boolean(emailError)}
                fullWidth
              />

              <TextField
                id="id-password"
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

              <TextField
                id="id-password-confirmation"
                onChange={handlePasswordConfirmationChanged}
                label="Digite a senha novamente"
                variant="outlined"
                type="password"
                required={true}
                name="password-confirmation"
                helperText={passwordConfirmationError}
                error={Boolean(passwordConfirmationError)}
                fullWidth
              />

              <Button
                variant="contained"
                color="secondary"
                type="submit"
                fullWidth
                disabled={!isValid}
              >
                Login
              </Button>
              {hasError && (
                <FormHelperText error={true}>
                  Ocorreu um erro no servidor. Por favor, tente novamente.
                </FormHelperText>
              )}
              <Typography>
                Já possui cadastro?{" "}
                <Link href="/auth/login">Clique aqui para entrar</Link>.
              </Typography>
            </CenteredContent>
          ) : (
            <Typography>
              Você receberá um e-mail em breve com as instruções.
            </Typography>
          )}
        </CenteredContent>
      </LoginBackBase>
    </CenteredContent>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await csrfToken(context),
    },
  };
}
