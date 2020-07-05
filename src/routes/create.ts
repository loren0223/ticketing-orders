import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/api/orders', async (req: Request, res: Response) => {
  res.send({ ticketId: '1213213123' });
});

export { router as createOrderRouter };
