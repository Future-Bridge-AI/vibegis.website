#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///

import sys
import json
import os
from datetime import datetime
from pathlib import Path

# Debug: Log everything to debug file
debug_file = Path(".claude/logs/hook_debug.log")
debug_file.parent.mkdir(exist_ok=True)

try:
    with open(debug_file, 'a') as f:
        f.write(f"=== Hook called at {datetime.now()} ===\n")
        f.write(f"Working dir: {os.getcwd()}\n")
        f.write(f"Python: {sys.executable}\n")
    
    payload = json.loads(sys.stdin.read())
    
    with open(debug_file, 'a') as f:
        f.write(f"Payload: {json.dumps(payload)}\n")
    
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "session_id": payload.get("session_id", "unknown"),
        "prompt": payload.get("prompt", "")
    }
    
    log_file = Path("logs/user_prompts.json")
    log_file.parent.mkdir(exist_ok=True)
    
    with open(log_file, 'a') as f:
        f.write(json.dumps(log_entry) + '\n')
    
    with open(debug_file, 'a') as f:
        f.write(f"SUCCESS! Logged to {log_file.absolute()}\n\n")
        
except Exception as e:
    with open(debug_file, 'a') as f:
        f.write(f"ERROR: {e}\n\n")
    sys.exit(1)

sys.exit(0)
