# Compare With Active Tab

This is a small Cursor/VS Code extension that adds `Compare with Active Tab` to the editor tab right-click menu.

## What it does

1. Keep one tab focused.
2. Right-click another tab.
3. Choose `Compare with Active Tab`.
4. Open a diff view between the active tab and the tab you clicked.

The extension also keeps track of the previously focused tab so it still works in cases where right-clicking a tab changes focus before the command runs.

## Files

- `package.json`: extension manifest and tab menu contribution
- `extension.js`: command implementation

## Install locally in Cursor

1. Open the `cursor-compare-active-tab` folder in Cursor.
2. Run `Developer: Install Extension from Location...`
3. Select this folder.

If your Cursor build expects a packaged extension instead, package it first with:

```sh
npx @vscode/vsce package
```

Then install the generated `.vsix` file with `Extensions: Install from VSIX...`.
