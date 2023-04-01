import { ExtensionContext } from 'vscode';
import DuckModeManager from './DuckModeManager';

let duckModeManager: DuckModeManager;

export function activate({extensionUri}: ExtensionContext) {

  duckModeManager = new DuckModeManager(extensionUri);
  duckModeManager.activate();
}

// This method is called when your extension is deactivated
export function deactivate() {
  duckModeManager.deactivate();
}
