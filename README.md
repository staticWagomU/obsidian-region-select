# Region Select

Emacs-inspired mark & point text selection for Obsidian, designed especially for mobile devices.

## Features

This plugin introduces Emacs-style "mark" and "point" concepts to make text selection easier on mobile:

- **Set Mark** (`set-mark`): Save current cursor position as the selection start point
- **Select to Mark** (`select-to-mark`): Select text from the saved mark to current cursor position
- **Clear Mark** (`clear-mark`): Remove the saved mark

## Usage

### Basic Workflow

1. Move cursor to the start of the text you want to select
2. Execute "Set Mark" command
3. Move cursor to the end of the text
4. Execute "Select to Mark" command
5. The text between mark and cursor is now selected

### Mobile Tips

- **Command Palette**: Swipe down to open, search for "mark"
- **Mobile Toolbar**: Add commands via Settings → Mobile → Toolbar
- **Commander Plugin**: Add ribbon buttons for one-tap access

## Installation

### From Obsidian Community Plugins

1. Open Settings → Community plugins
2. Search for "Region Select"
3. Install and enable

### Manual Installation

1. Download `main.js`, `manifest.json` from releases
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
```

## License

0-BSD
