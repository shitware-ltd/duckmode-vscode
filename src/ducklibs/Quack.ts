import { Disposable, commands, TextDocument, WebviewView, workspace } from "vscode";

/**
 * Play audio when saving a file when Duck Mode is activated
 *
 * Class, original concept and heavy drinking by Arko Elsenaar
 * Refactoring by Sonja Turo
 */
export default class Quack implements Disposable {

  private _listeners: Disposable[] = [];

  public register(): Disposable {
    return workspace.onDidSaveTextDocument(this.onDidSaveTextDocument, this, this._listeners);
  }

  public onDidSaveTextDocument(document: TextDocument) {
    if (! document.fileName.endsWith('settings.json')) {
      commands.executeCommand('duck-mode.quack');
    }
  }

  public dispose() {
    this._listeners.forEach(d => d.dispose());
  }
}
