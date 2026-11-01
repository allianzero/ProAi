# ProAi Roadmap

ProAi is an own EVM chain built from scratch. Current status is experimental trial.
No VPS is used in the trial phase. A VPS is only considered if ProAi becomes a real project.
No funding amount, token price, or launch date is promised in this roadmap.

## Phase 0 — Trial chain (done / live, fragile)
- Chain built from scratch: name ProAi, native coin PAI, chain ID 505
- Consensus: Clique Proof of Authority, about 3 second block time
- Validators: 2 validators, synced and sealing in turns
- Genesis: 100,000,000 PAI premine, test validator keys only, not for real funds
- Filtered RPC proxy and faucet for local testing
- Code published in English at github.com/allianzero/ProAi
- Success criteria: blocks keep sealing, both validators stay synced, RPC answers chain ID 505
- Known risk: the chain runs on a restart-prone VM, so a VM restart can stop it and it must be revived manually

## Phase 1 — Stabilise the trial (current, no VPS)
- Document how to add ProAi manually to a wallet: chain ID 505, symbol PAI, RPC URL
- Test basic flows end to end: send PAI, deploy a simple contract, read it back, use the faucet
- Test restart and recovery: validator 1, validator 2, proxy, faucet, in that order, then verify sync
- Keep secrets out of the repo: no passwords, keystores, validator keys, or tokens in GitHub
- Write clear English docs: README, chain.json, genesis, start scripts, public-testnet plan
- Decide the go / no-go question: is there a real use case and real users, or does ProAi stay a learning trial?
- Success criteria: a new user can follow the docs, add the network, and make a test transaction without private help
- Exit criteria for this phase: either stay as a trial, or move to Phase 2 only when the project is real

## Phase 2 — Public testnet (only if ProAi becomes a real project)
- Move validators to a permanent VPS with systemd, not the fragile VM
- Add a third validator run by a technical partner, so the chain is not single-operator only
- Public HTTPS RPC behind a filtered proxy: allow reads and signed transactions, block personal, clique, and signing methods on the public endpoint
- Domain with free DNS at first, for example DuckDNS, then a real domain when justified
- Block explorer, for example Blockscout, so anyone can verify blocks and transactions
- Faucet with a separate test account and a small, rate-limited drip
- Submit the chain to Chainlist with the correct chain ID, RPC, explorer, and symbol
- Public testnet docs: how to add the network, how to get test PAI, what is and is not supported
- Success criteria: public RPC stays up across restarts, explorer matches chain height, third validator stays synced
- Known risk: testnet PAI has no monetary value and must never be sold as an investment

## Phase 3 — Harden before any mainnet talk
- Monitoring and alerts for validator health, peer count, block height, disk, and RPC
- Backups of genesis, chain configuration, and operational runbooks, never of private keys in the repo
- RPC rate limits, request filtering, and abuse handling
- Incident runbook: what to do when a validator stops, when peers drop, or when RPC is abused
- Security review of the public RPC, faucet, explorer, and any deployed contracts
- Community and governance draft: who runs validators, how upgrades are decided, how disputes are handled
- Success criteria: the testnet survives a validator outage without stopping, and incidents are recovered from the runbook alone

## Phase 4 — Mainnet readiness (only after Phase 2 and 3 are proven)
- Independent security audit of chain configuration and core contracts, with findings fixed and published
- Decentralised validator set beyond the founding team, with clear onboarding and removal rules
- Funding and technical partnership agreed in writing, with the amount decided by the user, not invented here
- Mainnet launch checklist: genesis finalised, RPC and explorer production-ready, faucet replaced by a real distribution plan, docs and support channels ready
- No launch until: testnet has real users, audits are complete, validators are decentralised, and the user confirms the project is real
- Success criteria: mainnet is boring to run — stable, monitored, documented, and recoverable

## What this roadmap deliberately does NOT promise
- No token sale, no price target, no guaranteed return
- No mainnet date until the testnet phase is proven
- No VPS spending in the trial phase
- No user funds on the trial chain: test keys and test PAI only
