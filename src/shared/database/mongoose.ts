import mongoose from 'mongoose';

export async function connectDatabase(uri: string) {
  try {
    await mongoose.connect(uri);
    console.log('Database connected');
  } catch (error) {
    console.error('Error to connect in database', error);
    process.exit(1);
  }
}
