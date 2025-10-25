import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
const sql = neon('postgresql://neondb_owner:npg_h4BuCaASO5HL@ep-rough-mouse-a1848oh9-pooler.ap-southeast-1.aws.neon.tech/SpendWise?sslmode=require&channel_binding=require');
export const db = drizzle(sql,{schema});