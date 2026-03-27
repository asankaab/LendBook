import { put, del, list } from '@vercel/blob';

const token = process.env.BLOB_READ_WRITE_TOKEN;

if (!token) {
  throw new Error('BLOB_READ_WRITE_TOKEN environment variable is required');
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { action, userId } = req.body;

    if (action === 'upload') {
      const { file, fileName } = req.body;
      
      // Convert base64 to buffer
      const buffer = Buffer.from(file, 'base64');
      
      // Delete old avatars first
      try {
        const listResult = await list({ prefix: `${userId}/`, token });
        const oldBlobs = listResult.blobs || [];
        if (oldBlobs.length > 0) {
          await Promise.all(oldBlobs.map(b => del(b.pathname, { token })));
        }
      } catch (error) {
        console.warn('Could not delete old avatars:', error.message);
      }

      // Upload new avatar
      const uploadResult = await put(`${userId}/${fileName}`, buffer, {
        access: 'public',
        token,
      });

      return res.status(200).json({ url: uploadResult.url });
    }

    if (action === 'delete') {
      const listResult = await list({ prefix: `${userId}/`, token });
      const userBlobs = listResult.blobs || [];
      
      if (userBlobs.length > 0) {
        await Promise.all(userBlobs.map(b => del(b.pathname, { token })));
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}
