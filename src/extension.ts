// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let duckModeStatusBarItem: vscode.StatusBarItem;
let duckModeOn = false;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate({subscriptions}: vscode.ExtensionContext) {

	const duckModeOnCommand = 'duck-mode.duckOn';
	subscriptions.push(vscode.commands.registerCommand(duckModeOnCommand, () => {
		duckModeOn = true;
		displayDuckMode();
		vscode.window.showInformationMessage('Duck mode activated!');
	}));

	const duckModeOffCommand = 'duck-mode.duckOff';
	subscriptions.push(vscode.commands.registerCommand(duckModeOffCommand, () => {
		duckModeOn = false;
		displayDuckMode();
		vscode.window.showInformationMessage('Duck mode deactivated!');
	}));

	const duckModeToggleCommand = 'duck-mode.toggle';
	subscriptions.push(vscode.commands.registerCommand(duckModeToggleCommand, () => {
		duckModeOn = !duckModeOn;
		displayDuckMode();
	}));

	duckModeStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
	duckModeStatusBarItem.command = duckModeToggleCommand;
	
	duckModeStatusBarItem.show();

	subscriptions.push(duckModeStatusBarItem);

	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(displayDuckMode));
	subscriptions.push(vscode.window.onDidChangeTextEditorSelection(displayDuckMode));

	// update status bar item once at start
	displayDuckMode();
}


function displayDuckMode(): void {
	const modeText = duckModeOn ? "On" : "Off";
	duckModeStatusBarItem.text = `Duck Mode ${modeText} $(pd-duck)`;	
}

// This method is called when your extension is deactivated
export function deactivate() {}
