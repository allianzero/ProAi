import { ethers } from "ethers";
import fs from "fs";
import path from "path";
// Test-only funding script: sends PAI from validator 1 to the faucet account.
// Password is read from the local test password file and never printed.
const base = "/home/hatch/workspace/proai-chain";
const password = fs.readFileSync(path.join(base, "password.txt"), "utf8").trim();
const ksDir = path.join(base, "data/keystore");
const ksFile = fs.readdirSync(ksDir).find(f => f.endsWith(".json") || f.includes("--"));
const keystore = fs.readFileSync(path.join(ksDir, ksFile), "utf8");
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = await ethers.Wallet.fromEncryptedJson(keystore, password);
const signer = wallet.connect(provider);
console.log("sender:", signer.address);
const faucet = "0x45E3a6Fa876596172D9a10f613E592d024d89a0E";
const tx = await signer.sendTransaction({ to: faucet, value: ethers.parseEther("10000") });
console.log("tx:", tx.hash);
const receipt = await tx.wait();
console.log("status:", receipt.status, "block:", receipt.blockNumber);
console.log("faucet balance PAI:", ethers.formatEther(await provider.getBalance(faucet)));
