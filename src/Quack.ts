import * as vscode from 'vscode';

// this method is called when vs code is activated
export default class Quack {

    timeout: NodeJS.Timer | undefined = undefined;
    activeEditor: vscode.TextEditor | undefined = undefined;
    webview: vscode.WebviewView | undefined = undefined;
    showDecorations: boolean = false;

    constructor() {
    }

    public start(subscriptions: vscode.Disposable[]) {
        vscode.workspace.onDidSaveTextDocument(this.onDidSaveTextDocument, this, subscriptions);
    }

    public onDidSaveTextDocument(document: vscode.TextDocument) {
        vscode.commands.executeCommand('duck-mode.quack');
    }
}
