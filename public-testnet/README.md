# ProAi as a public testnet — plan

Current status (2026-10-30): the chain runs locally with 2 validators, chain ID 505, symbol PAI, 3 second block time. What is still missing is the public layer: RPC reachable by others, an explorer, a faucet, and documentation.

## 1. Move / add nodes to a VPS (required)

- Both validators currently run on one VM. That is a single point of failure: if that VM stops, the chain stops.
- For a public testnet: at least 1 VPS with a static public IP, ideally validators spread across 2–3 different machines.
- A starting spec is enough: 2 vCPU, 4 GB RAM, 50 GB disk, Ubuntu 22.04/24.04.
- On a VPS, run geth as a systemd service (see `proai-validator1.service`), not as a manual terminal process, so it restarts automatically after a reboot.
- Open the firewall for P2P 30303/30304 (TCP+UDP) and 443 for public RPC. Do not open raw geth RPC (8545/8546) to the internet.

## 2. Domain + HTTPS + reverse proxy (required)

- Use a domain, for example `rpc-testnet.proai.<your-domain>`.
- Point DNS A/AAAA records for that domain at the VPS IP.
- Put Nginx in front of geth, with free TLS from Certbot.
- Nginx should only forward safe methods (`eth_*`, `net_*`, `web3_*`) and rate-limit them. Never forward `personal_*` or `clique_propose` to the public — that would hand validator control to outsiders.
- An example configuration is in `nginx-rpc.conf` (replace the domain and port).

## 3. Wallet configuration for users

- Network name: ProAi Testnet
- RPC URL: `https://rpc-testnet.proai.<your-domain>`
- Chain ID: 505
- Symbol: PAI
- Explorer URL: `https://explorer-testnet.proai.<your-domain>`
- `chain.json` in this folder is the Chainlist format (replace `.example` with a real domain before submitting).

## 4. Explorer (strongly recommended)

- The standard choice is Blockscout. It needs Postgres and its own indexer process, and it is the heaviest component — plan a separate VPS/component for it.
- A light interim alternative: a public status page showing block height, the validator list, and the latest block hash from RPC.
- Without an explorer, users cannot verify transactions themselves, so a testnet looks unconvincing.

## 5. Faucet (required for a testnet)

- A small web app: the user enters an address, the faucet sends for example 1 PAI, limited to once per address per day, with a captcha.
- Faucet funds come from the premine, but use a separate faucet account with a limited balance. Never use a validator key for the faucet.
- The faucet key lives only on the server, never in the frontend.

## 6. Documentation and announcement

- One page: how to add the network to MetaMask, how to claim from the faucet, how to deploy an ERC20 token to ProAi, and the testnet rules (testnet PAI has no value, a testnet can be reset).
- Submit to Chainlist with `chain.json` after RPC and the explorer are live.
- Announce it on existing channels only after all of the above is verified.

## Free starting point

- Free domain: there is no free `.com` anymore. Free subdomains still work: DuckDNS (`proai.duckdns.org`, instant) or is-a.dev (`proai.is-a.dev`, via a GitHub pull request).
- Free VPS: Oracle Cloud Always Free is the only serious permanent free VPS (2 OCPU + 12 GB RAM total, 200 GB storage), but signup requires a credit/debit card and a phone number for verification, free capacity is sometimes unavailable, and idle instances can be reclaimed.
- Note from experience on the original VM: Cloudflare Quick Tunnel, localtunnel, SSH tunnels, and free ngrok behind a forced HTTP proxy did not work there, so a VPS with direct internet access is the realistic route to a public endpoint.
