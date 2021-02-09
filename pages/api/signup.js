import axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    const token = process.env.BACKEND_TOKEN;

    const serverRes = await axios
      .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/signup/", {
        ...req.body,
        token,
      })
      .catch(() => ({ status: 500, data: null }));
    res.status(serverRes.status).json(serverRes.data);
  }
};
