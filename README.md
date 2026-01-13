# Region Select

[日本語版](./README.ja.md)

Emacs-inspired mark & point text selection for Obsidian, designed especially for mobile devices.

## Why This Plugin?

Text selection on mobile devices is notoriously difficult. Long-press gestures are imprecise, and dragging selection handles across long passages is frustrating. This plugin solves that problem with an Emacs-inspired approach:

1. **Set a mark** at your starting position
2. **Move freely** using Obsidian's keyboard or navigation
3. **Select to mark** to capture everything between

No more fighting with touch selection!

## Features

| Command | Icon | Description |
|---------|------|-------------|
| **Set Mark** | 📍 | Save current cursor position as selection start |
| **Select to Mark** | 📝 | Select text from mark to current cursor |
| **Clear Mark** | ✕ | Remove the saved mark |
| **Toggle Mark** | 🎯 | One-tap workflow: set mark → move → tap again to select |

### Toggle Mark (Recommended for Mobile)

The **Toggle Mark** command provides the simplest workflow:

1. Tap once → Sets mark at cursor
2. Move cursor to destination
3. Tap again → Selects text and clears mark

A ribbon icon shows the current state:
- `locate` icon: No mark set (ready to set)
- `target` icon: Mark is set (ready to select)

## Usage

### Basic Workflow

```
1. Position cursor at selection start
2. Run "Set Mark" command
3. Move cursor to selection end
4. Run "Select to Mark" command
5. Text is now selected!
```

### Mobile Setup (Recommended)

#### Option 1: Mobile Toolbar
1. Settings → Mobile → Manage toolbar buttons
2. Add "Toggle mark" command
3. One-tap selection from your toolbar!

#### Option 2: Command Palette
- Swipe down to open palette
- Search for "mark" to find all commands

## Installation

### From Obsidian Community Plugins

1. Open Settings → Community plugins
2. Browse and search for "Region Select"
3. Install and enable

### Manual Installation

1. Download `main.js`, `manifest.json` from [Releases](https://github.com/staticWagomU/obsidian-region-select/releases)
2. Create folder: `VaultFolder/.obsidian/plugins/region-select/`
3. Copy files into the folder
4. Enable in Settings → Community plugins

## Development

```bash
# Install dependencies
pnpm install

# Development build (watch mode)
pnpm run dev

# Production build
pnpm run build

# Run tests
pnpm test

# Lint
pnpm run lint
```

## License

0-BSD
