const Keyv = require("keyv");

const cache = new Keyv();

export const addCacheValue = async (key: string, value: any): Promise<void> => {
  await cache.set(key, value, 60000);
  // let tmp = await cache.get(key);
  // console.log("key_val: ", tmp);
};

export const addStaticCacheValue = async (
  key: string,
  value: any
): Promise<void> => {
  await cache.set(key, value);
};

export const getCacheValue = async (key: string): Promise<any> => {
  let tmp = await cache.get(key);
  if (typeof tmp === "undefined") return null;
  await cache.delete(key);
  return tmp;
};

export const deleteCacheValue = async (key: string): Promise<void> => {
  await cache.delete(key);
};
