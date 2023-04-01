import {
  CancellationToken, Disposable, Uri, Webview,
  WebviewView, WebviewViewProvider,
  WebviewViewResolveContext, window
} from "vscode";
import { DuckMessage } from "./commands/DuckModeQuack";
import Audio from "./ducklibs/Audio";
import QuackGPT from "./ducklibs/QuackGPT";

export default class SpeciesViewProvider implements WebviewViewProvider {

  public static readonly viewType = 'duck-mode.speciesView';

  private _view?: WebviewView;
  private _audio: Audio;
  private _quackGPT: QuackGPT = new QuackGPT();

  constructor(
    private readonly _extensionUri: Uri
  ) {
    this._audio = new Audio();
  }

  public static factory(extensionUri: Uri): SpeciesViewProvider {
    return (new SpeciesViewProvider(extensionUri));
  }

  public registerWebview(): Disposable {
    return window.registerWebviewViewProvider(SpeciesViewProvider.viewType, this);
  }

  get webviewView(): WebviewView | undefined {
    return this._view;
  }

  public sendMessage(message: DuckMessage): void {
    if (message.type === 'audio' && this._audio) {
      this._audio.quack(message);
    }
  }

  /**
   * This is called automatically by VsCode every time the view is shown as a new object,
   * so it needs registering each time
   * 
   * @param webviewView
   * @param context 
   * @param token 
   */
  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    token: CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView;
    this._audio.webviewView = webviewView;
    this._quackGPT.webviewView = webviewView;

    webviewView.webview.options = {
        enableScripts: true,

        localResourceRoots: [
            this._extensionUri
        ]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: Webview) {

    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, 'resources', 'species-view.js'));

    // Do the same for the stylesheet.
    const styleResetUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, 'resources', 'reset.css'));
    const styleVSCodeUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, 'resources', 'vscode.css'));
    const styleMainUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, 'resources', 'species-view.css'));
    const codiconsUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));

    const quackMp3Uri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, 'resources', 'quack.mp3'));
    const duckImageUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, 'resources'));

    // Use a nonce to only allow a specific script to be run.
    const nonce = this.getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; media-src ${webview.cspSource}; img-src ${webview.cspSource}; font-src ${webview.cspSource}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleResetUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <link href="${codiconsUri}" rel="stylesheet">
        <title>Duck Mode</title>
      </head>
      <body>
        <button appearance="secondary" id="sound-button" aria-label="Unmute">
            Ask <span class="codicon codicon-unmute"></span>
        </button>

        <button appearance="primary" id="quackgpt-button" aria-label="Ask QuackGPT a question." >
            Ask QuackGPT
        </button>

        <audio src="${quackMp3Uri}" id="audio-quack"></audio>
        <h4>Alabio</h4>
        <h6><i>Anas platyrhynchos Borneo</i></h6>
        <img src="${duckImageUri}/alabio.jpg">
        <h4>Bufflehead</h4>
        <h6><i>Bucephala albeola</i></h6>
        <img src="${duckImageUri}/bufflehead.jpg">
        <h4>Fulvous Whistling</h4>
        <h6><i>Dendrocygna bicolor</i></h6>
        <img src="${duckImageUri}/fulvous-whistling.jpg">
        <h4>Mallard</h4>
        <h6><i>Anas platyrhynchos</i></h6>
        <img src="${duckImageUri}/mallard.jpg">
        <h4>Marbled</h4>
        <h6><i>Marmaronetta angustirostris</i></h6>
        <img src="${duckImageUri}/marbled.jpg">
        <h4>Merganser</h4>
        <h6><i>Mergus serrator</i></h6>
        <img src="${duckImageUri}/merganser.jpg">
        <h4>Muscovy</h4>
        <h6><i>Cairina moschata</i></h6>
        <img src="${duckImageUri}/muscovy.jpg">
        <h4>Ring Necked</h4>
        <h6><i>Aythya collaris</i></h6>
        <img src="${duckImageUri}/ring-necked.jpg">
        <h4>White backed</h4>
        <h6><i>Thalassornis Leuconotus</i></h6>
        <img src="${duckImageUri}/white-backed.jpg">
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }

  getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
