import { getSession } from "next-auth/client";
import axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    const {
      query: { slug },
    } = req;

    const session = await getSession({ req });

    if (!session || !session.token) {
      res.status(403);
      return;
    }

    const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const lambda_url = process.env.NEXT_PUBLIC_LAMBDA_URL;
    const app_token = process.env.APP_TOKEN || "CHANGETHIS";
    const backend_token = process.env.BACKEND_TOKEN;
    const { state_index, memory, terminal, next_line, retval } = req.body;
    const received = JSON.stringify(memory);

    const expected = await axios
      .get(`${backend_url}/trace/${slug}/memory/${state_index}`, {
        headers: { Authorization: `Token ${session.token}` },
      })
      .then((res) => res.data)
      .catch(() => null);

    const memory_code = await axios
      .post(`${lambda_url}/memory`, {
        expected,
        received,
        app_token,
      })
      .then((res) => res.data)
      .catch(() => ({ code: -1 }));

    const serverRes = await axios
      .post(
        `${backend_url}/trace/${slug}/`,
        {
          state_index,
          memory,
          memory_code,
          terminal,
          next_line,
          retval,
        },
        {
          headers: {
            Authorization: `Token ${session.token}`,
          },
        }
      )
      .catch(() => null);
    res.status(serverRes.status).json(serverRes.data);
  }
};
