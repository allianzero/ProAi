#!/usr/bin/env python3
"""Filtered ProAi RPC proxy for the public demo tunnel.

Only allows safe JSON-RPC methods. Blocks anything where the node itself
would sign, unlock accounts, or change validators: personal_*, clique_*,
admin_*, miner_*, eth_sendTransaction, eth_sign, etc. eth_sendRawTransaction
stays allowed because the user signs locally in their own wallet.
Forwards allowed calls to the local geth node on 127.0.0.1:8545.
"""
import json, urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer

UPSTREAM = "http://127.0.0.1:8545"
ALLOWED_PREFIXES = ("eth_", "net_", "web3_")
BLOCKED_METHODS = {
    # eth_sendRawTransaction is ALLOWED on purpose: the user signs locally
    # in their own wallet, the node never holds their key. What is blocked
    # is anything where the node itself would sign or unlock.
    "eth_sendTransaction", "eth_sign",
    "eth_signTransaction", "eth_signTypedData", "eth_signTypedData_v3",
    "eth_signTypedData_v4", "personal_sign",
}
BLOCKED_PREFIXES = ("personal_", "clique_", "admin_", "miner_", "debug_", "txpool_")

class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass
    def _send(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length)
            req = json.loads(raw) if raw else {}
        except Exception:
            return self._send(400, {"jsonrpc": "2.0", "id": None,
                "error": {"code": -32700, "message": "Parse error"}})
        method = req.get("method", "")
        req_id = req.get("id")
        if (not method.startswith(ALLOWED_PREFIXES)
                or method in BLOCKED_METHODS
                or method.startswith(BLOCKED_PREFIXES)):
            return self._send(403, {"jsonrpc": "2.0", "id": req_id,
                "error": {"code": -32000, "message": "Method blocked by ProAi demo proxy"}})
        try:
            upstream_req = urllib.request.Request(
                UPSTREAM, data=raw, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(upstream_req, timeout=15) as resp:
                self._send(resp.status, json.loads(resp.read() or b"{}"))
        except Exception as e:
            self._send(502, {"jsonrpc": "2.0", "id": req_id,
                "error": {"code": -32000, "message": f"Upstream error: {e}"}})
    def do_GET(self):
        self._send(200, {"name": "ProAi demo RPC proxy",
                         "note": "POST JSON-RPC only, safe methods only"})

if __name__ == "__main__":
    HTTPServer(("127.0.0.1", 8547), H).serve_forever()
