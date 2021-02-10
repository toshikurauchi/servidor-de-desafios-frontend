import { getSession } from "next-auth/client";
import axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session || !session.token) {
      res.status(403);
      return;
    }
    const { slug, ...params } = req.body;
    const serverRes = await axios
      .post(process.env.NEXT_PUBLIC_BACKEND_URL + `/quiz/${slug}/`, params, {
        headers: {
          Authorization: `Token ${session.token}`,
        },
      })
      .catch((r) => ({
        status: (r.response && r.response.status) || 500,
        data: null,
      }));
    res.status(serverRes.status).json(serverRes.data);
  }
};
