import { put, del, list } from '@vercel/blob';

const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;

if (!token) {
  console.warn('Warning: VITE_BLOB_READ_WRITE_TOKEN is not set. Avatar upload will not work.');
}

const blob = {
  upload: (pathname, file, options = {}) => {
    return put(pathname, file, {
      access: 'public',
      ...options,
      token,
    });
  },
  
  del: (pathname, options = {}) => {
    return del(pathname, {
      ...options,
      token,
    });
  },
  
  list: (options = {}) => {
    return list({
      ...options,
      token,
    });
  },
};

export default blob;
