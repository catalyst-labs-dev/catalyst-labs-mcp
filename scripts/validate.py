#!/usr/bin/env python3
"""Validate every servers/*/server.json against the official MCP Registry schema.
Usage: python3 scripts/validate.py [github-username-for-placeholder]   (needs: pip install jsonschema)"""
import glob, json, sys, urllib.request
import jsonschema
SCHEMA_URL = "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json"
schema = json.load(urllib.request.urlopen(SCHEMA_URL))
user = sys.argv[1] if len(sys.argv) > 1 else "example-user"
ok = True
for path in sorted(glob.glob("servers/*/server.json")):
    doc = json.loads(open(path).read().replace("GITHUB_USERNAME", user))
    try:
        jsonschema.Draft7Validator(schema).validate(doc)
        assert doc["$schema"] == SCHEMA_URL, "$schema mismatch"
        print(f"OK   {path}  ({doc['name']}, description {len(doc['description'])}/100 chars)")
    except Exception as e:
        ok = False; print(f"FAIL {path}: {e}")
sys.exit(0 if ok else 1)
