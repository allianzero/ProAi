#!/bin/bash
# ProAi validator 2. Before running: create your own password.txt locally
# and your own validator keystore in data2/keystore (never commit either).
# Download geth 1.13.15 and place it at bin/geth113.
# The bootnode enode below is the original local validator 1; replace it
# with the enode of the validator 1 you actually run.
cd "$(dirname "$0")"
./bin/geth113 --datadir data2 --networkid 505 --port 30304 --authrpc.port 8552 --http --http.addr 127.0.0.1 --http.port 8546 --http.api eth,net,web3,clique,personal --http.corsdomain '*' --unlock 0x202267EDDa5550920A5Dd4e6864C47Ff5F8bca25 --password password.txt --mine --miner.etherbase 0x202267EDDa5550920A5Dd4e6864C47Ff5F8bca25 --allow-insecure-unlock --bootnodes "enode://a393eef56b2312c2d8a99cdc7d4ae288830cc74624a234d403996d148f16d4128e29ea259e254811044e6547fba5e3b73eb403d5809c0b2e3b37eee9c6d43607@127.0.0.1:30303" --syncmode full
