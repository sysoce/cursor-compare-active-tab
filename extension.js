const path = require('path');
const vscode = require('vscode');

let currentActiveResource;
let previousActiveResource;

function activate(context) {
  rememberActiveResource(getBestActiveResource());

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      const resource = editor && editor.document ? editor.document.uri : undefined;
      rememberActiveResource(resource);
    })
  );

  context.subscriptions.push(
    vscode.window.tabGroups.onDidChangeTabs(() => {
      rememberActiveResource(getBestActiveResource());
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'cursorCompareActiveTab.compareWithActiveTab',
      async (commandArg) => {
        const targetResource =
          getResourceFromCommandArg(commandArg) ||
          getBestActiveResource() ||
          currentActiveResource;

        if (!targetResource) {
          await vscode.window.showWarningMessage(
            'No file-backed tab was found to compare.'
          );
          return;
        }

        const compareResource = [
          currentActiveResource,
          previousActiveResource,
          getBestActiveResource()
        ].find(
          (candidate) =>
            candidate && !sameResource(candidate, targetResource)
        );

        if (!compareResource) {
          await vscode.window.showWarningMessage(
            'Open or focus another tab first, then right-click the tab you want to compare.'
          );
          return;
        }

        const diffTitle = `Compare: ${labelFor(compareResource)} <-> ${labelFor(targetResource)}`;

        await vscode.commands.executeCommand(
          'vscode.diff',
          compareResource,
          targetResource,
          diffTitle
        );
      }
    )
  );
}

function deactivate() {}

function rememberActiveResource(nextResource) {
  if (!nextResource) {
    return;
  }

  if (sameResource(currentActiveResource, nextResource)) {
    return;
  }

  previousActiveResource = currentActiveResource;
  currentActiveResource = nextResource;
}

function getBestActiveResource() {
  const activeEditorResource = vscode.window.activeTextEditor?.document?.uri;
  if (activeEditorResource) {
    return activeEditorResource;
  }

  const activeTab = vscode.window.tabGroups.activeTabGroup?.activeTab;
  return getResourceFromTab(activeTab);
}

function getResourceFromTab(tab) {
  if (!tab) {
    return undefined;
  }

  return getResourceFromTabInput(tab.input);
}

function getResourceFromTabInput(input) {
  if (!input) {
    return undefined;
  }

  if (typeof vscode.TabInputText !== 'undefined' && input instanceof vscode.TabInputText) {
    return input.uri;
  }

  if (typeof vscode.TabInputTextDiff !== 'undefined' && input instanceof vscode.TabInputTextDiff) {
    return input.modified;
  }

  if (typeof vscode.TabInputNotebook !== 'undefined' && input instanceof vscode.TabInputNotebook) {
    return input.uri;
  }

  if (typeof vscode.TabInputNotebookDiff !== 'undefined' && input instanceof vscode.TabInputNotebookDiff) {
    return input.modified;
  }

  if (typeof vscode.TabInputCustom !== 'undefined' && input instanceof vscode.TabInputCustom) {
    return input.uri;
  }

  return getUriLike(input.uri) || getUriLike(input.modified) || getUriLike(input.original);
}

function getResourceFromCommandArg(commandArg) {
  if (Array.isArray(commandArg)) {
    return commandArg.map(getResourceFromCommandArg).find(Boolean);
  }

  return (
    getUriLike(commandArg) ||
    getUriLike(commandArg?.resourceUri) ||
    getUriLike(commandArg?.uri)
  );
}

function getUriLike(value) {
  if (!value) {
    return undefined;
  }

  if (
    typeof value.scheme === 'string' &&
    typeof value.path === 'string' &&
    typeof value.toString === 'function'
  ) {
    return value;
  }

  return undefined;
}

function sameResource(left, right) {
  if (!left || !right) {
    return false;
  }

  return left.toString() === right.toString();
}

function labelFor(resource) {
  if (!resource) {
    return 'untitled';
  }

  if (resource.scheme === 'file') {
    return path.basename(resource.fsPath);
  }

  const fromPath = path.posix.basename(resource.path || '');
  return fromPath || resource.scheme;
}

module.exports = {
  activate,
  deactivate
};
