import 'dotenv/config';
import { connectDatabase } from './infrastructure/database/mongoose';
import { startServer } from './http/server';

const uri = process.env.DATABASE as string;

async function bootstrap() {
  await connectDatabase(uri);
  startServer();
}

bootstrap();