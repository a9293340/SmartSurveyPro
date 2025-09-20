export default defineEventHandler(async event => {
  return {
    success: true,
    message: 'Hello from Nuxt 4 API!',
    timestamp: new Date().toISOString(),
  };
});
