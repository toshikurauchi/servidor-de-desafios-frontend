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
    const code = req.body.code;

    const [test_code, challenge] = await Promise.all([
      axios
        .get(`${backend_url}/code/${slug}/test-code?token=${backend_token}`, {
          headers: { Authorization: `Token ${session.token}` },
        })
        .then((res) => res.data)
        .catch(() => null),
      axios
        .get(`${backend_url}/code/${slug}`, {
          headers: { Authorization: `Token ${session.token}` },
        })
        .then((res) => res.data)
        .catch(() => null),
    ]);
    const function_name = challenge ? challenge.function_name : null;

    const result = await axios
      .post(`${lambda_url}/code`, { code, test_code, function_name, app_token })
      .then((res) => res.data)
      .catch(() => null);

    const serverRes = await axios
      .post(
        `${backend_url}/code/${slug}/`,
        { code, result },
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
