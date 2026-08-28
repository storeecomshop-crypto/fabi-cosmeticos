// Substitui a API window.storage (exclusiva do ambiente de artifacts do Claude)
// por uma implementação equivalente usando localStorage do navegador,
// para que o app funcione normalmente quando hospedado (ex: na Vercel).

function nsKey(key, shared) {
  return shared ? `fabi:shared:${key}` : `fabi:private:${key}`;
}

window.storage = {
  async get(key, shared = false) {
    try {
      const raw = localStorage.getItem(nsKey(key, shared));
      if (raw === null) return null;
      return { key, value: raw, shared };
    } catch (e) {
      return null;
    }
  },

  async set(key, value, shared = false) {
    try {
      localStorage.setItem(nsKey(key, shared), value);
      return { key, value, shared };
    } catch (e) {
      return null;
    }
  },

  async delete(key, shared = false) {
    try {
      const existed = localStorage.getItem(nsKey(key, shared)) !== null;
      localStorage.removeItem(nsKey(key, shared));
      return { key, deleted: existed, shared };
    } catch (e) {
      return null;
    }
  },

  async list(prefix = "", shared = false) {
    try {
      const nsPrefix = shared ? "fabi:shared:" : "fabi:private:";
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const full = localStorage.key(i);
        if (full && full.startsWith(nsPrefix)) {
          const bare = full.slice(nsPrefix.length);
          if (bare.startsWith(prefix)) keys.push(bare);
        }
      }
      return { keys, prefix, shared };
    } catch (e) {
      return null;
    }
  },
};
