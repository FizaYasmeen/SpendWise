import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url:'postgresql://neondb_owner:npg_h4BuCaASO5HL@ep-rough-mouse-a1848oh9-pooler.ap-southeast-1.aws.neon.tech/SpendWise?sslmode=require&channel_binding=require'
  },
});