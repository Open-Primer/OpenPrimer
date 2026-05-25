import { dbService } from '../lib/db';

declare global {
  interface Window {
    dbService: typeof dbService;
  }
}
