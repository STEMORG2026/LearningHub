#!/usr/bin/env python3
"""Verify LearningHub repository.

Usage:
  python3 scripts/verify.py
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    cmd = ["bash", "-c", "cd LearningHub && pnpm typecheck && pnpm verify-governance"]
    print(f"→ Verifying LearningHub: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=REPO_ROOT.parent)
    if result.returncode == 0:
        print("✓ LearningHub verification PASS")
    else:
        print(f"✗ LearningHub verification FAIL (exit {result.returncode})", file=sys.stderr)
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())