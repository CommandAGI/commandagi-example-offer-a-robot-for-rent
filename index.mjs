#!/usr/bin/env node
// Register your own hardware as a rentable device and list it for rent.
// Usage: COMMANDAGI_API_KEY=cagi_… node index.mjs [robot|computer|simulation] "Name" [creditsPerHour]

const API = process.env.COMMANDAGI_API_URL ?? "https://api.commandagi.com";
const KEY = process.env.COMMANDAGI_API_KEY;
if (!KEY) throw new Error("Set COMMANDAGI_API_KEY (https://commandagi.com/api-keys)");

const kind = process.argv[2] ?? "robot"; // robot | computer | simulation
const name = process.argv[3] ?? "My UR5 arm";
const creditsPerHour = Number(process.argv[4] ?? 1000); // 1000 credits/hr = $10/hr

async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { authorization: `Bearer ${KEY}`, "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

// 1. Register the device. You get a long-lived token + a ready-to-run standby command.
const dev = await api("/rental-devices", { method: "POST", body: { kind, name } });
console.log(`registered device ${dev.id}\n`);

// 2. List it for rent at $10/hr with a 1-hour minimum (a "block" price model).
const listing = await api("/listings", {
  method: "POST",
  body: {
    kind: kind === "computer" ? "compute_rental" : kind === "simulation" ? "sim_access" : "robot_rental",
    resourceType: "device",
    resourceId: dev.id,
    title: name,
    price: { type: "block", rate: creditsPerHour, unit: "hour", minUnits: 1 },
    capacity: 1,
  },
});
await api(`/listings/${listing.id}`, { method: "PATCH", body: { status: "active" } });
console.log(`listed: https://commandagi.com/market/listing/${listing.id}\n`);

// 3. Run this on your hardware to bring it online (it polls for rentals — nothing inbound to you):
console.log("Run this on the machine to go online:\n");
console.log("  " + dev.command + "\n");
console.log("Then wire your real hardware behind the runtime — see adapter.py.");
console.log("Set up payouts on https://commandagi.com/sell to cash out earnings.");
