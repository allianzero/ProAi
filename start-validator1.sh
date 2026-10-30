#!/bin/bash
# ProAi validator 1. Before running: create your own password.txt locally
# and your own validator keystore in data/keystore (never commit either).
# Download geth 1.13.15 and place it at bin/geth113.
cd "$(dirname "$0")"
./bin/geth113 --datadir data --networkid 505 --http --http.addr 127.0.0.1 --http.port 8545 --http.api eth,net,web3,clique,personal --http.corsdomain '*' --unlock 0x74EA90D9f08C6556AE4d260A6dCC04A84BF86184 --password password.txt --mine --miner.etherbase 0x74EA90D9f08C6556AE4d260A6dCC04A84BF86184 --allow-insecure-unlock --syncmode full
