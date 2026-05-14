import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Agent Main API
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Reply Royal Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Reply Royal",
      version: "1.0.0"
    });
  });

  // MCP GET
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Reply Royal MCP Endpoint",
      status: "active",
      description: "Active and responsive MCP server for Reply Royal Orchestrator Agent",
      capabilities: ["royal-reply-management", "smart-response-generation", "engagement-automation"],
      timestamp: new Date().toISOString()
    });
  });

  // MCP POST
  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const { action, command, params } = body || {};

      let result: any = {};
      const actionOrCommand = action || command;

      switch (actionOrCommand) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Reply Royal Orchestrator",
            message: "Ready for royal engagement" 
          };
          break;

        case "execute":
          result = {
            success: true,
            action: command || params,
            executedAt: new Date().toISOString(),
            message: "Royal reply command executed successfully"
          };
          break;

        case "get_info":
          result = {
            name: "Reply Royal Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Command received by Reply Royal",
            data: body
          };
      }

      res.json({
        status: "success",
        agent: "Reply Royal Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
