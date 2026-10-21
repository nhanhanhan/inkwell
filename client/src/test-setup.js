import "@testing-library/jest-dom";

// Node's experimental global localStorage can shadow jsdom's working one
// with a broken stub. A minimal in-memory polyfill sidesteps the conflict.
if (typeof window.localStorage?.getItem !== "function") {
  const store = new Map();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear(),
    },
  });
}
