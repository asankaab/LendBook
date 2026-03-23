import { put, del, list } from '@vercel/blob';

const blob = {
  // The `BLOB_READ_WRITE_TOKEN` environment variable is automatically detected.
  upload: put,
  del,
  list,
};

export default blob;
