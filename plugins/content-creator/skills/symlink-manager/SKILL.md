---
name: symlink-manager
description: Create and remove symlinks to other content repos.
---

# Symlink Manager

This skill can create and remove symlinks in the content folder. This allows content files to live in knowledge repositories but be accessed from the project.

The symlink CLI tool is located at `skills/symlink-manager/symlink-cli/index.js`.
It requires a config file at `skills/symlink-manager/symlink-cli/config/config.json` (see `config.example.json` for the format).

## Instructions

### Create a symlink
```bash
node skills/symlink-manager/symlink-cli/index.js create -s "/absolute/path/to/source" -t "link-name"
```

### Remove a symlink
```bash
node skills/symlink-manager/symlink-cli/index.js remove "link-name"
```

### Sync all symlinks from config
```bash
node skills/symlink-manager/symlink-cli/index.js setup
```

### Check or validate a symlink
```bash
node skills/symlink-manager/symlink-cli/index.js check "link-name"
node skills/symlink-manager/symlink-cli/index.js validate "link-name"
```

## Notes
- On Windows, symlink creation requires Administrator privileges or Developer Mode enabled.
- Use `Read` and `Glob` to inspect existing symlinks or browse the content folder before making changes.