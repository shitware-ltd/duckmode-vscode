// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import DuckCursor from './DuckCursors';
import SpeciesViewProvider from './SpeciesViewProvider';

let duckModeStatusBarItem: vscode.StatusBarItem;
let duckModeOn =true;
let duckCursor: DuckCursor | undefined = undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate({subscriptions, extensionUri}: vscode.ExtensionContext) {

	// speciessWebView
	const speciesViewProvider = new SpeciesViewProvider(extensionUri);
	subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			SpeciesViewProvider.viewType,
			speciesViewProvider
		)
	);

	const duckModeOnCommand = 'duck-mode.duckOn';
	subscriptions.push(vscode.commands.registerCommand(duckModeOnCommand, () => {
		duckModeOn = true;
		vscode.commands.executeCommand('setContext', 'duck-mode.duckModeActive', duckModeOn);
		displayDuckMode();
		vscode.window.showInformationMessage('Duck mode activated!');
	}));

	const duckModeOffCommand = 'duck-mode.duckOff';
	subscriptions.push(vscode.commands.registerCommand(duckModeOffCommand, () => {
		duckModeOn = false;
		vscode.commands.executeCommand('setContext', 'duck-mode.duckModeActive', duckModeOn);
		displayDuckMode();
		vscode.window.showInformationMessage('Duck mode deactivated!');
	}));

	const duckModeToggleCommand = 'duck-mode.toggle';
	subscriptions.push(vscode.commands.registerCommand(duckModeToggleCommand, () => {
		duckModeOn = !duckModeOn;
		vscode.commands.executeCommand('setContext', 'duck-mode.duckModeActive', duckModeOn);
		displayDuckMode();
	}));

	const duckModeQuackCommand = 'duck-mode.quack';
	subscriptions.push(vscode.commands.registerCommand(duckModeQuackCommand, () => {
		if (duckModeOn) {
			speciesViewProvider.doQuack();
			vscode.window.showInformationMessage('Quack!');
		}
	}));

	duckModeStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
	duckModeStatusBarItem.command = duckModeToggleCommand;
	
	duckModeStatusBarItem.show();

	subscriptions.push(duckModeStatusBarItem);

	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(displayDuckMode));
	subscriptions.push(vscode.window.onDidChangeTextEditorSelection(displayDuckMode));

	duckCursor = new DuckCursor();
	duckCursor.start(subscriptions);

	// update status bar item once at start
	displayDuckMode();
}

function stopDuckMode() {
	if (duckCursor) {
		duckCursor.stop();
	}
}

function displayDuckMode(): void {
	const modeText = duckModeOn ? "On" : "Off";
	duckModeStatusBarItem.text = `Duck Mode ${modeText} $(pd-duck)`;
	if (duckCursor) {
		duckCursor.toggleDecorations(duckModeOn);
	}
}

// This method is called when your extension is deactivated
export function deactivate() {
	stopDuckMode();
}
