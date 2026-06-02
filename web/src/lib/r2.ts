import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Load environment variables for Cloudflare R2
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

// Check if Cloudflare R2 is fully configured
export function isR2Configured(): boolean {
  return !!(accessKeyId && secretAccessKey && endpoint && bucketName);
}

// Initialize S3 client for Cloudflare R2
let s3Client: S3Client | null = null;
if (isR2Configured()) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: endpoint as string,
    credentials: {
      accessKeyId: accessKeyId as string,
      secretAccessKey: secretAccessKey as string,
    },
  });
}

/**
 * Uploads a file (e.g., compressed course markdown or JSON) to Cloudflare R2 bucket.
 * Falls back gracefully with a warning if R2 is not configured yet.
 */
export async function uploadToR2(key: string, body: Buffer | string, contentType = 'text/markdown'): Promise<boolean> {
  if (!isR2Configured() || !s3Client) {
    console.warn(`⚠️ Cloudflare R2 is not configured. Skipped uploading key "${key}" to object storage.`);
    return false;
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    await s3Client.send(command);
    console.log(`☁️ Successfully uploaded key "${key}" to Cloudflare R2.`);
    return true;
  } catch (error: any) {
    console.error(`🚨 Failed to upload to Cloudflare R2 for key "${key}":`, error.message);
    throw error;
  }
}

/**
 * Fetches file content from Cloudflare R2 bucket.
 */
export async function getFromR2(key: string): Promise<string | null> {
  if (!isR2Configured() || !s3Client) {
    console.warn(`⚠️ Cloudflare R2 is not configured. Cannot fetch key "${key}" from object storage.`);
    return null;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const response = await s3Client.send(command);
    if (!response.Body) return null;
    
    const content = await response.Body.transformToString();
    return content;
  } catch (error: any) {
    if (error.name === 'NoSuchKey') {
      console.warn(`⚠️ Key "${key}" was not found in Cloudflare R2 bucket.`);
      return null;
    }
    console.error(`🚨 Failed to fetch from Cloudflare R2 for key "${key}":`, error.message);
    throw error;
  }
}

/**
 * Deletes a file from Cloudflare R2 bucket.
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  if (!isR2Configured() || !s3Client) {
    console.warn(`⚠️ Cloudflare R2 is not configured. Skipped deleting key "${key}" from object storage.`);
    return false;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await s3Client.send(command);
    console.log(`☁️ Successfully deleted key "${key}" from Cloudflare R2.`);
    return true;
  } catch (error: any) {
    console.error(`🚨 Failed to delete from Cloudflare R2 for key "${key}":`, error.message);
    throw error;
  }
}
