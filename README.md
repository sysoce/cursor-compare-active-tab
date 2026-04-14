# Compare With Active Tab

This is a small Cursor/VS Code extension that adds `Compare with Active Tab` to the editor tab right-click menu.

## How to

1. Keep one tab focused.
2. Right-click another tab.
3. Choose `Compare with Active Tab`.
4. Open a diff view between the active tab and the tab you clicked.

The extension also keeps track of the previously focused tab so it still works in cases where right-clicking a tab changes focus before the command runs.

## Install from folder

1. Open the `cursor-compare-active-tab` folder in Cursor.
2. Run (CMD+Shift+P) `Developer: Install Extension from Location...`
3. Select this folder.

## Package and install

You can install it in VS Code the same way:

1. Package the extension:

```sh
npx @vscode/vsce package
```

2. In VS Code, run `Extensions: Install from VSIX...`
3. Select the generated `.vsix` file
