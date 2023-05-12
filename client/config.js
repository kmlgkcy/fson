import { join } from 'path';

export const DIR = process.cwd();
export const TEMP_DIR = join(DIR, 'temp');
export const TRANSFER_DIR = join(DIR, 'transfer');
export const TRANSFER_DIR_UPLOAD = join(TRANSFER_DIR, 'uploaded');
export const TASK_DIR = join(DIR, 'tasks.fson');
