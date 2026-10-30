import { ethers } from "ethers";
import fs from "fs";
import http from "http";
import path from "path";

// ProAi faucet: anyone who submits their wallet address gets 5 PAI, once.
// Why a server, not "automatic on adding the network"? Adding a network in
// a wallet is local only: the chain never learns the address, so nothing
// on-chain can pay it automatically. The faucet is the standard fix: the
// user gives their address once, this server (which pays the gas) sends 5 PAI.
// Test-only faucet account; its keystore is never committed to GitHub.
const base = "/home/hatch/workspace/proai-chain";
const password = fs.readFileSync(path.join(base, "password.txt"), "utf8").trim();
const ksDir = path.join(base, "faucet-data/keystore");
const ksFile = fs.readdirSync(ksDir)[0];
const keystore = fs.readFileSync(path.join(ksDir, ksFile), "utf8");
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = await ethers.Wallet.fromEncryptedJson(keystore, password);
const signer = wallet.connect(provider);
console.log("faucet account:", signer.address);

const claimsFile = path.join(base, "faucet/claims.json");
let claims = {};
try { claims = JSON.parse(fs.readFileSync(claimsFile, "utf8")); } catch {}
const save = () => fs.writeFileSync(claimsFile, JSON.stringify(claims, null, 2));

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  res.setHeader("Content-Type", "application/json");
  if (url.pathname === "/") {
    res.setHeader("Content-Type", "text/html");
    res.end(`<h1>ProAi Faucet</h1><p>Add ProAi to your wallet (Chain ID 505, symbol PAI), then claim 5 PAI, once per address.</p>
<form action="/claim"><input name="address" placeholder="0x..." size="50" required><button>Claim 5 PAI</button></form>
<p>Faucet account: ${signer.address}</p>`);
    return;
  }
  if (url.pathname === "/claim") {
    const address = url.searchParams.get("address") || "";
    if (!ethers.isAddress(address)) {
      res.statusCode = 400; res.end(JSON.stringify({ ok: false, error: "Invalid address" })); return;
    }
    const key = address.toLowerCase();
    if (claims[key]) {
      res.statusCode = 409; res.end(JSON.stringify({ ok: false, error: "Address already claimed", tx: claims[key].tx, at: claims[key].at })); return;
    }
    try {
      const tx = await signer.sendTransaction({ to: address, value: ethers.parseEther("5") });
      const receipt = await tx.wait();
      claims[key] = { tx: tx.hash, at: new Date().toISOString(), block: receipt.blockNumber };
      save();
      res.end(JSON.stringify({ ok: true, address, amount: "5 PAI", tx: tx.hash, block: receipt.blockNumber }));
    } catch (e) {
      res.statusCode = 500; res.end(JSON.stringify({ ok: false, error: String(e.message || e).slice(0, 200) }));
    }
    return;
  }
  res.statusCode = 404; res.end(JSON.stringify({ ok: false, error: "Not found" }));
});
server.listen(8550, "127.0.0.1", () => console.log("ProAi faucet listening on http://127.0.0.1:8550"));
