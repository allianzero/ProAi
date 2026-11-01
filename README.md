# ProAi

ProAi is an own EVM chain built from scratch.

- Chain name: ProAi
- Native coin symbol: PAI
- Chain ID: 505 (0x1f9)
- Network ID: 505
- Consensus: Clique Proof of Authority, period 3 seconds, epoch 30000
- Client: geth 1.13.15. Geth 1.17 was tried first but no longer accepts `--unlock`, so mining uses 1.13.15.
- Genesis: `genesis.json`, genesis hash `d618d8..1491db`
- Validators (test only):
  - Validator 1: `0x74EA90D9f08C6556AE4d260A6dCC04A84BF86184` — RPC `http://127.0.0.1:8545`, P2P 30303, datadir `data/`
  - Validator 2: `0x202267EDDa5550920A5Dd4e6864C47Ff5F8bca25` — RPC `http://127.0.0.1:8546`, P2P 30304, authrpc 8552, datadir `data2/`
- Premine to validator 1: 100,000,000 PAI

## Status

- 2026-10-30, 1 validator: chain ID 505, blocks sealing about every 3 seconds.
- 2026-10-30, 2 validators: both nodes synced, sealing alternates — validator 2 seals even blocks, validator 1 seals odd blocks. Note: after adding the second validator, validator 1 alone could not seal ("signed recently, must wait for others") until validator 2 sealed a block. That is expected Clique rotation.
- 2026-10-30, later check: both validators synced at block 439, chain ID 505.
- 2026-11-01: both validators synced at block 18,433, peerCount 1, filtered proxy answering chain ID 505, faucet live. The chain is still a trial on a restart-prone VM; a VPS is not used in the trial phase and is only considered if ProAi becomes a real project.

## Run a local node

1. Download geth 1.13.15 and place the binary at `bin/geth113`.
2. Create your own validator account and your own `password.txt` locally. Never commit a keystore or a password — see `.gitignore`.
3. Initialise: `./bin/geth113 --datadir data init genesis.json`
4. Start validator 1: `./start-validator1.sh`
5. Add a second validator with `clique.propose(address, true)` from validator 1, initialise `data2` with the same genesis, then start it with `./start-validator2.sh`.

## Check

```
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://127.0.0.1:8545
curl -X POST -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' http://127.0.0.1:8545
```

## Filtered RPC proxy

`filtered_rpc.py` is a small Python proxy on port 8547 that forwards only safe JSON-RPC methods to the local node on port 8545. It blocks `personal_*`, `clique_*`, `admin_*`, `miner_*`, `eth_sendTransaction`, and `eth_sign`, so nobody outside can unlock an account or change validators through it. `eth_sendRawTransaction` stays allowed on purpose: the user signs locally in their own wallet, and the node never holds their key. Use this proxy — never the raw geth RPC — for any public demo or tunnel.

## Going public

See `public-testnet/` for the plan to turn ProAi into a public testnet: a VPS with a public IP, a domain with HTTPS behind Nginx, an explorer, a faucet, and Chainlist submission (`public-testnet/chain.json`, with the domain placeholder replaced by a real domain).

## Roadmap and Project

See `roadmap.md` for the full ProAi roadmap: trial, stabilise the trial without a VPS, public testnet only if ProAi becomes a real project, hardening, then mainnet readiness only after a proven testnet and a completed audit. No token price, token sale, funding amount, or mainnet date is promised.

Track progress in the ProAi GitHub Project: https://github.com/users/allianzero/projects/2

## Warnings

- This is a local test chain. It is not public mainnet, and testnet PAI has no value.
- The validator keys in the original local setup are test only. Do not send real funds to this chain, do not share a keystore, and do not reuse a test key anywhere else.
- To go public you still need validators on separate machines, public RPC with HTTPS, an explorer, a faucet, documentation, and an upgrade plan.
