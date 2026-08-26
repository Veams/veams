export const statusQuoQuerySpecificExample = `// A handle (Query or Mutation) knows its own key and context.
const userQuery = manager.createUntrackedQuery(['user', 42], fetchUser);

// Specific action: no keys required.
await userQuery.refetch();
await userQuery.invalidate();`;

export const statusQuoQueryGlobalExample = `// The Manager acts on the entire cache using filters.
await manager.invalidateQueries({ 
  queryKey: ['user'], 
  exact: false 
});

// Orchestrate state across different keys.
manager.setQueryData(['user', 42], (user) => ({ ...user, name: 'Grace' }));`;
