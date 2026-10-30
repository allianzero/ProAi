#!/bin/bash
# Run AFTER adding your ngrok authtoken once with:
#   ./ngrok config add-authtoken <TOKEN>
# The token lives only in ~/.config/ngrok/ngrok.yml on that machine.
# This tunnel points at the filtered proxy on port 8547, NOT at raw geth RPC.
cd "$(dirname "$0")"
./ngrok http 8547
