import { NextResponse } from 'next/server';

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Reply Royal Orchestrator",
    status: "active",
    description: "High-performance AI Agent specialized in warp racing mechanics",
    capabilities: ["warp-racing", "multi-track-orchestration", "performance-optimization"],
    timestamp: new Date().toISOString(),
    tools: [
      { name: "get_race_status", description: "Get the current status of the race" },
      { name: "start_race", description: "Start a new race instance" },
      { name: "get_leaderboard", description: "Get the current leaderboard" },
      { name: "optimize_speed", description: "Optimize racing speed" },
      { name: "get_track_info", description: "Get information about the track" }
    ],
    prompts: [
      { name: "race_strategy", description: "Prompt to analyze and optimize race strategy" }
    ],
    resources: []
  }, { headers: getCorsHeaders() });
}

  export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, params, action, command, id, jsonrpc } = body;
    
    // JSON-RPC helper
    const createRpcResponse = (result: any) => {
      return NextResponse.json({
        jsonrpc: jsonrpc || "2.0",
        id: id !== undefined ? id : null,
        result
      }, { headers: getCorsHeaders() });
    };

    // MCP JSON-RPC standard
    if (method === "tools/list") {
      return createRpcResponse({
        tools: [
          { name: "get_race_status", description: "Get the current status of the race", inputSchema: { type: "object", properties: { raceId: { type: "string" } } } },
          { name: "start_race", description: "Start a new race instance", inputSchema: { type: "object", properties: { trackId: { type: "string" } } } },
          { name: "get_leaderboard", description: "Get the current leaderboard", inputSchema: { type: "object", properties: {} } },
          { name: "optimize_speed", description: "Optimize racing speed", inputSchema: { type: "object", properties: { targetSpeed: { type: "number" } } } },
          { name: "get_track_info", description: "Get information about the track", inputSchema: { type: "object", properties: { trackId: { type: "string" } } } }
        ]
      });
    }

    if (method === "prompts/list") {
      return createRpcResponse({
        prompts: [
          { name: "race_strategy", description: "Prompt to analyze and optimize race strategy", arguments: [{ name: "track", description: "Track context", required: true }] }
        ]
      });
    }

    if (method === "resources/list") {
      return createRpcResponse({ resources: [] });
    }

    if (method === "tools/call") {
      return createRpcResponse({
        content: [{ type: "text", text: `Mock execution successful for tool: ${params?.name}` }],
        isError: false
      });
    }

    if (method === "initialize") {
      return createRpcResponse({
        protocolVersion: "2024-11-05", // Standard MCP version
        capabilities: { tools: { listChanged: true }, prompts: { listChanged: true }, resources: {} },
        serverInfo: { name: "Reply Royal Orchestrator", version: "1.0.0" }
      });
    }

    // Agent legacy/custom command evaluation
    let result: any = {};
    const cmd = action || command;

    switch (cmd) {
      case "status":
      case "ping":
        result = { status: "online", agent: "Reply Royal Orchestrator", message: "Ready for warp racing" };
        break;
      case "execute":
        result = { success: true, action: cmd || params, executedAt: new Date().toISOString(), message: "Command executed successfully" };
        break;
      case "get_info":
        result = { name: "Reply Royal Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
        break;
      default:
        result = { success: true, message: "Command received by Agent", data: body };
    }

    return NextResponse.json({
      status: "success",
      agent: "Reply Royal Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, { headers: getCorsHeaders() });

  } catch (error) {
    return NextResponse.json({ status: "error", message: "Failed to process MCP command" }, { status: 400, headers: getCorsHeaders() });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders() });
}
