// tests/setup.ts
import fs from 'fs/promises';
import path from 'path';
import config from '../src/config/config';

export const setupTestEnvironment = async () => {
  // Create test directories
  await fs.mkdir(config.dataDir, { recursive: true });
  await fs.mkdir(config.uploadDir, { recursive: true });
};

export const cleanupTestEnvironment = async () => {
  // Clean up test data
  try {
    await fs.rm(config.dataDir, { recursive: true, force: true });
    await fs.rm(config.uploadDir, { recursive: true, force: true });
  } catch (error) {
    console.error('Error cleaning up test environment:', error);
  }
};

export const createTestFile = async (filename: string, content: any) => {
  const filePath = path.join(config.dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(content, null, 2));
  return filePath;
};