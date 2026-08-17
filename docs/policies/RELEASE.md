# Release Rollback

**Version:** 3.0.0

When a break in production occurs, speed matters. This document provides the "break glass" procedure for reverting a release.

## When to Roll Back

Rollback is appropriate when:
- A critical bug is discovered post-release that affects core functionality
- A published package contains breaking changes that downstream consumers can't absorb
- Security vulnerability is introduced via a dependency

## Rollback Procedure

### Option A: Automated Rollback Script

```bash
# Dry run first — see what would happen
node scripts/release/rollback.mjs --dry-run --version 3.0.0

# Execute rollback to v3.0.0
node scripts/release/rollback.mjs --version 3.0.0
```

What the script does:
1. Creates a revert changeset with `patch` bump
2. Reverts `package.json` files to target version state
3. Runs `pnpm changeset version` to compute new version
4. Publishes via `pnpm changeset publish` with provenance
5. Tags the rollback release (e.g., `v3.0.1`)

### Option B: Manual Rollback

```bash
# 1. Identify target version
git tag --list "v*" --sort=-version:refname

# 2. Checkout target package versions
git checkout v3.0.0 -- packages/*/package.json apps/*/package.json

# 3. Create revert changeset
cat > .changeset/rollback.md << 'EOF'
---
"@stem-tuition/shell": patch
---

Rollback to v3.0.0
EOF

# 4. Version bump
pnpm changeset version

# 5. Publish
pnpm changeset publish

# 6. Tag
git tag v$(node -p "require('./package.json').version")
```

## Post-Rollback Checklist

- [ ] Verify published package version on npm registry
- [ ] Verify GitHub Release page shows correct version
- [ ] Update CHANGELOG.md with rollback entry
- [ ] Notify team via Discord/Slack
- [ ] Investigate root cause of the issue that necessitated rollback
- [ ] Create incident report in docs/adr/ if applicable

## Prevention

The best rollback is one you never need. Prevention measures:
- Pre-release validation via `pnpm verify-governance`
- Staged rollout (canary releases) for major versions
- Automated smoke tests before publish (Tier 3)
