import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/test', async (req, res) => {
  // Create a new user
  const newUser = await prisma.test.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  });

  // Fetch all users
  const allUsers = await prisma.user.findMany();

  // Send the list of users as the response
  res.json(allUsers);
});

export default router;