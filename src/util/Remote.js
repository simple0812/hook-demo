export default {
  get: () => Promise.resolve({ code: 0 }),
  post: () => Promise.resolve({ code: 0, data: [{ id: 1, tag2: 1 }] })
};
