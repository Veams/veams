export const statusQuoQueryEscapeHatchExample = `const rawResult = userQuery.unsafe_getResult();
const rawClient = manager.unsafe_getClient();

rawClient.cancelQueries({ queryKey: ['user', 42] });`;
