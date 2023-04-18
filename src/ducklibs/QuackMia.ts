import { WebviewView, window } from "vscode";

export default class QuackMia {

  private _webviewView?: WebviewView;

  set webviewView(webviewView: WebviewView) {
    this._webviewView = webviewView;

    webviewView.webview.onDidReceiveMessage(data => {
      if (data !== 'invokeMia') {
        return;
      }

      window.showInformationMessage('Throw your hands in the air!');
    });
  }
}
