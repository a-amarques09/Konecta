// pages/api/hello.ts
// This will cause the error because there's no handler exported
import type { NextApiRequest, NextApiResponse } from 'next';

console.log("API Route");
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ message: "Hello, API!" });
}
