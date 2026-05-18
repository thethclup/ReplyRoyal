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
    description: "Active and responsive MCP server for Reply Royal Orchestrator Agent",
    capabilities: {
      tools: {},
      prompts: {},
      resources: {}
    },
    timestamp: new Date().toISOString()
  }, { headers: getCorsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { method, params, action, command } = body;

    if (method === "tools/list") {
      return NextResponse.json({
        tools: [
          { name: "get_race_status", description: "Get the current status of the race", inputSchema: { type: "object", properties: {} } },
          { name: "start_race", description: "Start a new race instance", inputSchema: { type: "object", properties: {} } },
          { name: "get_leaderboard", description: "Get the current leaderboard", inputSchema: { type: "object", properties: {} } },
          { name: "optimize_speed", description: "Optimize racing speed", inputSchema: { type: "object", properties: {} } },
          { name: "get_track_info", description: "Get information about the track", inputSchema: { type: "object", properties: {} } }
        ]
      }, { headers: getCorsHeaders() });
    }

    if (method === "tools/call") {
      return NextResponse.json({
        content: [{ type: "text", text: `Mock execution successful for tool: ${params?.name}` }],
        isError: false
      }, { headers: getCorsHeaders() });
    }

    if (method === "initialize") {
      return NextResponse.json({
        protocolVersion: "1.0.0",
        capabilities: { tools: {}, prompts: {}, resources: {} },
        serverInfo: { name: "Reply Royal Orchestrator", version: "1.0.0" }
      }, { headers: getCorsHeaders() });
    }

    if (method === "prompts/list" || method === "resources/list") {
      return NextResponse.json({ [method.split('/')[0]]: [] }, { headers: getCorsHeaders() });
    }

    let result: any = {};
    const cmd = action || command;

    switch (cmd) {
      case "status":
      case "ping":
        result = { status: "online", agent: "Reply Royal Orchestrator", message: "Ready for royal engagement" };
        break;
      case "execute":
        result = { success: true, action: cmd || params, executedAt: new Date().toISOString(), message: "Royal reply command executed successfully" };
        break;
      case "get_info":
        result = { name: "Reply Royal Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
        break;
      default:
        result = { success: true, message: "Command received by Reply Royal", data: body };
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
