import { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from '@/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await signIn('github');
      res.redirect('/');
    } catch (error: unknown) {
      // Ensure `error` is an instance of `Error` before accessing `message`
      if (error instanceof Error) {
        res.status(500).json({ message: 'Sign-in failed', error: error.message });
      } else {
        res.status(500).json({ message: 'Sign-in failed', error: 'Unknown error' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
