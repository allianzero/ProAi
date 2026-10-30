# ProAi Faucet

Anyone who adds the ProAi network to their wallet and submits their address
here gets **5 PAI, once per address**.

## Why a faucet, not automatic payment on adding the network?

Adding a network in a wallet is local only: the chain never learns the
address, so no on-chain code can pay it automatically. The standard fix is
a faucet: the user gives their address once, and this server — which pays
the gas — sends 5 PAI.

A second problem it solves: a brand-new wallet holds 0 PAI, so it cannot
pay gas for an on-chain `claim()` transaction at all. With a faucet, the
server pays the gas.

## Run

1. Create a separate faucet account (never a validator key) and fund it
   from the premine, for example with `fund-faucet.mjs` (10,000 PAI funds
   2,000 claims of 5 PAI).
2. Create a local `password.txt` for that account's keystore. Never commit
   a keystore, a password, or `claims.json`.
3. `npm install ethers@6`
4. `node server.mjs` — listens on `http://127.0.0.1:8550`

## Use

- Open `/` for a simple claim form.
- Or: `GET /claim?address=0x...`
- Success returns `{ ok: true, amount: "5 PAI", tx, block }`.
- A second claim from the same address returns an "already claimed" error.

## Exposing it

This server binds to localhost only. To make it public, put it behind
HTTPS on a VPS (see `../public-testnet/`), with a captcha and rate limits
in front of it. Do not expose raw geth RPC to the internet.
