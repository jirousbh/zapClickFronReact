export interface TtlStorage {
  set(key: string, value: any, ttl: any): void;
  get(key: string): any;
  delete(key: string): void;
  deleteAllThatStartWith(key: string): void;
}

// Copiado daqui => https://www.sohamkamani.com/javascript/localstorage-with-ttl-expiry/
const ttlStorage = {
  set(key: string, value: any, ttl: any) {
    const now = new Date();

    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };

    sessionStorage.setItem(`ttl-${key}`, JSON.stringify(item));
  },
  get(key: string) {
    const itemStr = sessionStorage.getItem(`ttl-${key}`);

    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      sessionStorage.removeItem(`ttl-${key}`);
      return null;
    }

    return item.value;
  },
  delete(key: string) {
    sessionStorage.removeItem(`ttl-${key}`);
  },
  deleteAllThatStartWith(key: string) {
    const ks = Object.keys(sessionStorage);

    for (let i = 0; i < ks.length; i++) {
      const k = ks[i];

      if (k.startsWith(`ttl-${key}`)) {
        console.log(`invalidating cache for ttl-${key}`);
        sessionStorage.removeItem(k);
      }
    }
  },
};

export { ttlStorage };
