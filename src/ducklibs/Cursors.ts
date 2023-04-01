import {
    DecorationOptions, Disposable, Range,
    TextEditor, TextEditorDecorationType,
    window, workspace
} from 'vscode';

export default class Cursors implements Disposable {

  duckDecorationType: TextEditorDecorationType;
  timeout: NodeJS.Timer | undefined = undefined;
  activeEditor: TextEditor | undefined = undefined;
  showDecorations: boolean = false;

  private _listeners: Disposable[] = [];

  constructor() {

    const icon = Math.random() < 0.05 ? '🦜' : '🦆';

    this.duckDecorationType = window.createTextEditorDecorationType({
      before: {
        contentText: icon,
        color: 'blue'
      }
    });
  }

  public register(): Disposable {

    if (this.activeEditor) {
      this.triggerUpdateDecorations();
    }
    
    window.onDidChangeActiveTextEditor(editor => {
      this.activeEditor = editor;
      if (this.activeEditor) {
        this.triggerUpdateDecorations();
      }
    }, null, this._listeners);

    workspace.onDidChangeTextDocument(event => {
      if (this.activeEditor && event.document === this.activeEditor.document) {
        this.triggerUpdateDecorations(true);
      }
    }, null, this._listeners);

    return this;
  }

  updateDecorations(): void {
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

  dispose() {
    for (const editor of window.visibleTextEditors) {
      editor.setDecorations(this.duckDecorationType, []);
    }

    this._listeners.forEach(d => d.dispose());
    this._listeners.length = 0;
  }
}
