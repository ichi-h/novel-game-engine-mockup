export const murmurhash3 = (key: unknown, seed = 0) => {
  const data = typeof key === 'string' ? key : JSON.stringify(key);
  let h = seed;

  for (let i = 0; i < data.length; i++) {
    h = Math.imul(h ^ data.charCodeAt(i), 2654435761);
  }

  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;

  return (h >>> 0).toString(16).padStart(8, '0');
};
