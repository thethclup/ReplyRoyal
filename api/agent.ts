export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Reply Royal Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Reply Royal",
      version: "1.0.0"
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      return res.status(200).json({
        name: "Reply Royal Orchestrator",
        status: "active",
        wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
        receivedData: body
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid request payload" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
