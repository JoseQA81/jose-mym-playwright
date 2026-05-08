import dotenv from 'dotenv';

dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const config = {
  mentor: {
    email: requiredEnv('MENTOR_EMAIL'),
    password: requiredEnv('MENTOR_PASSWORD'),
  },
  emptyMentor: {
    email: requiredEnv('EMPTY_MENTOR_EMAIL'),
    password: requiredEnv('EMPTY_MENTOR_PASSWORD'),
  },
  replyMentor: {
    email: requiredEnv('REPLY_MENTOR_EMAIL'),
    password: requiredEnv('REPLY_MENTOR_PASSWORD'),
  },
} as const;