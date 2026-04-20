const storage = {
  get(key, fallback) {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return fallback;
    try {
      return JSON.parse(rawValue);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

export { storage };

