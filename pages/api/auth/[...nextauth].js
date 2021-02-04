import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";

// References:
// https://arunoda.me/blog/add-auth-support-to-a-next-js-app-with-a-custom-backend
// https://next-auth.js.org/configuration/providers

const providers = [
  Providers.Credentials({
    name: "login e senha",
    credentials: {
      username: {
        label: "Login",
        type: "text",
        placeholder: "fulano123",
      },
      password: { label: "Senha", type: "password" },
    },
    async authorize({ username, password }) {
      const baseUrl = process.env.BACKEND_URL;
      const tokenData = await axios
        .post(baseUrl + "/token/", { username, password })
        .then((res) => res.data)
        .catch(() => null);
      if (!tokenData || !tokenData.token) return null;
      const token = tokenData.token;
      const user = await axios
        .get(baseUrl + "/user/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => res.data)
        .catch(() => null);
      if (!user) return null;
      user.token = token;
      return user;
    },
  }),
];

const callbacks = {
  jwt: async function jwt(token, user) {
    return user || token;
  },
  session: async function session(session, token) {
    session.user = {
      username: token.username,
      firstName: token.first_name,
      lastName: token.last_name,
    };
    session.token = token.token;
    return session;
  },
};

const options = {
  providers,
  callbacks,
  pages: {
    signIn: "/login",
  },
};

export default (req, res) => NextAuth(req, res, options);
