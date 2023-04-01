import { WebviewView } from "vscode";
import { DuckMessage } from "../commands/DuckModeQuack";

export default class Audio {

  private _webviewView?: WebviewView;

  set webviewView(webviewView: WebviewView) {
    this._webviewView = webviewView;
  }

  public quack(quack: DuckMessage): void {
    if (this._webviewView) {
      this.showView();
      this._webviewView.webview.postMessage(quack);
    }
  }

  /**
   * Ensures that the webview is visible onscreen before attempting to
   * play audio, otherwise it won't work.
   */
  protected showView(): void {
    if (this._webviewView && this._webviewView.show) {
      this._webviewView.show(true);
    }
  }
}
