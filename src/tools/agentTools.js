/**
 * Agent loop, function calling, and execution registry.
 */

class ToolRegistry {
  constructor() {
    this.tools = new Map();
  }

  register(name, handler, description = '') {
    this.tools.set(name, { handler, description });
  }

  async execute(name, params = {}) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool '${name}' is not registered in agent registry`);
    }
    return await tool.handler(params);
  }

  listTools() {
    return Array.from(this.tools.entries()).map(([name, meta]) => ({
      name,
      description: meta.description
    }));
  }
}

export const agentToolRegistry = new ToolRegistry();

// Default built-in agent tools
agentToolRegistry.register(
  'echo',
  async ({ message }) => `Agent Echo: ${message}`,
  'Echoes back a string parameter'
);

agentToolRegistry.register(
  'timestamp',
  async () => new Date().toISOString(),
  'Returns the current ISO timestamp'
);
