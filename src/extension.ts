import * as vscode from 'vscode';
import DuckCursor from './DuckCursors';
import DuckModeManager from './DuckModeManager';
import Quack from './Quack';

let duckCursor: DuckCursor | undefined = undefined;
let quack: Quack | undefined = undefined;
let duckModeManager: DuckModeManager;

export function activate({subscriptions, extensionUri}: vscode.ExtensionContext) {

  duckModeManager = new DuckModeManager(extensionUri);
  duckModeManager.activate();

  duckCursor = new DuckCursor();
  duckCursor.start(subscriptions);

  quack = new Quack();
  quack.start(subscriptions);

// update status bar item once at start
// displayDuckMode();
}

function stopDuckMode() {
  if (duckCursor) {
    duckCursor.stop();
  }
}

// function displayDuckMode(): void {
// 	const modeText = duckModeOn ? "On" : "Off";
// 	duckModeStatusBarItem.text = `Duck Mode ${modeText} $(pd-duck)`;
// 	if (duckCursor) {
// 		duckCursor.toggleDecorations(duckModeOn);
// 	}
// }

// This method is called when your extension is deactivated
export function deactivate() {
  duckModeManager.deactivate();
  stopDuckMode();
}
