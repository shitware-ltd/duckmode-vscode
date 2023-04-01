import {
    DecorationOptions, Disposable, Range,
    TextEditor, TextEditorDecorationType,
    window, workspace
} from 'vscode';

// this method is called when vs code is activated
export default class Cursors {

  duckDecorationType: TextEditorDecorationType;
  timeout: NodeJS.Timer | undefined = undefined;
  activeEditor: TextEditor | undefined = undefined;
  showDecorations: boolean = false;

  constructor() {
    this.duckDecorationType = window.createTextEditorDecorationType({
      before: {
        contentText: '🦆',
        color: 'blue'
      }
    });
  }

  public register(): Disposable[] {

    if (this.activeEditor) {
      this.triggerUpdateDecorations();
    }
    const subscriptions: Disposable[] = [];

    window.onDidChangeActiveTextEditor(editor => {
      this.activeEditor = editor;
      if (this.activeEditor) {
        this.triggerUpdateDecorations();
      }
    }, null, subscriptions);

    workspace.onDidChangeTextDocument(event => {
      if (this.activeEditor && event.document === this.activeEditor.document) {
        this.triggerUpdateDecorations(true);
      }
    }, null, subscriptions);

    return subscriptions;
  }

    stop() {
      for (const editor of window.visibleTextEditors) {
        editor.setDecorations(this.duckDecorationType, []);
      }
    }

    updateDecorations() {
      this.activeEditor = window.activeTextEditor;

      if (!this.activeEditor) {
        return;
      }
      const regEx = /(\r\n|\r|\n)+/g;
      const text = this.activeEditor.document.getText();
      const duckTriggerWords: DecorationOptions[] = [];
      if (this.showDecorations) {
        let match;
        while ((match = regEx.exec(text))) {
          const startPos = this.activeEditor.document.positionAt(match.index);
          const endPos = this.activeEditor.document.positionAt(match.index + match[0].length);
          const decoration = { range: new Range(startPos, endPos), hoverMessage: 'Quack! This is line ' + match[0].length + ' of your code.' };
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
