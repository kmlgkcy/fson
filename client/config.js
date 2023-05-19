import { join } from 'path';
import { fileURLToPath } from 'url';

export const DIR = process.cwd();
export const TEMP_DIR = join(DIR, 'temp');
export const TRANSFER_DIR = join(DIR, 'transfer');
export const TRANSFER_DIR_UPLOAD = join(TRANSFER_DIR, 'uploaded');
export const TASK_DIR = join(DIR, 'tasks.fson');
export const CONFIG_DIR = join(DIR, 'config.fson');

export const HOST = () => {
  return process.env.HOST;
};

export const PWD = () => {
  return process.env.PWD;
};

// const __filename = fileURLToPath(DIR);
export const APP_DIR = join(DIR, 'public', 'transfer_app');
export const APP_PATH = join(DIR, 'public', 'transfer_app', 'index.html');
export const ADMIN_APP_DIR = join(DIR, 'public', 'app');
export const ADMIN_APP_PATH = join(DIR, 'public', 'app', 'index.html');
