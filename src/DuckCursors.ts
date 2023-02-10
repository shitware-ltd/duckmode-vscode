import * as vscode from 'vscode';

// this method is called when vs code is activated
export default class DuckCursor {

    duckDecorationType: vscode.TextEditorDecorationType;
    timeout: NodeJS.Timer | undefined = undefined;
    activeEditor: vscode.TextEditor | undefined = undefined;
    showDecorations: boolean = false;

    constructor() {
        this.duckDecorationType = vscode.window.createTextEditorDecorationType({
            before: {
                contentText: '🦆',
                color: 'blue'
            }
        });
    }

    public start(subscriptions: vscode.Disposable[]) {

        if (this.activeEditor) {
            this.triggerUpdateDecorations();
        }

        vscode.window.onDidChangeActiveTextEditor(editor => {
            this.activeEditor = editor;
            if (editor) {
                this.triggerUpdateDecorations();
            }
        }, null, subscriptions);

        vscode.workspace.onDidChangeTextDocument(event => {
            if (this.activeEditor && event.document === this.activeEditor.document) {
                this.triggerUpdateDecorations(true);
            }
        }, null, subscriptions);
    }

    stop() {
       for (const editor of vscode.window.visibleTextEditors) {
            editor.setDecorations(this.duckDecorationType, []);
       }
    }

    updateDecorations() {
        this.activeEditor = vscode.window.activeTextEditor;

        if (!this.activeEditor) {
            return;
        }
        const regEx = /(\r\n|\r|\n)+/g;
        const text = this.activeEditor.document.getText();
        const duckTriggerWords: vscode.DecorationOptions[] = [];
        if (this.showDecorations) {
            let match;
            while ((match = regEx.exec(text))) {
                const startPos = this.activeEditor.document.positionAt(match.index);
                const endPos = this.activeEditor.document.positionAt(match.index + match[0].length);
                const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Quack! This is line ' + match[0].length + ' of your code.' };
                duckTriggerWords.push(decoration);
            }
        }
        this.activeEditor.setDecorations(this.duckDecorationType, duckTriggerWords);
    }

    triggerUpdateDecorations(throttle = false) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        if (throttle) {
            this.timeout = setTimeout(this.updateDecorations, 500);
        } else {
            this.updateDecorations();
        }
    }

    toggleDecorations(state:boolean) {
        this.showDecorations = state;
        this.triggerUpdateDecorations();
    }
}
