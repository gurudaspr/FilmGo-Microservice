import express from 'express';




const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ message: 'Identity service is up and running' });
});

export default router;