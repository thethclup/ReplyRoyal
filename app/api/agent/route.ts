import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: "Reply Royal Orchestrator",
    status: "active",
    wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
    platform: "Reply Royal",
    version: "1.0.0"
  });
}
