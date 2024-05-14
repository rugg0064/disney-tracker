// middleware/cors.ts
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

const cors = Cors({
  origin: 'http://localhost:8888', // Specify your allowed origin(s)
  methods: ['GET', 'OPTIONS'], // Specify allowed HTTP methods
});

const middleware = (handler: Function) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await cors(req, res);
  return handler(req, res);
};

export default middleware;
