import { Disposable, OutputChannel, WebviewView, window } from "vscode";
import { DuckMessage } from "../commands/DuckModeQuack";

export default class QuackGPT {

  private _webviewView?: WebviewView;
  private _quackGPTchannel?: OutputChannel;

  private audio: DuckMessage = {
    type: 'audio',
    domElementId: 'audio-quack'
  }

  constructor() {
    this._quackGPTchannel = window.createOutputChannel('QuackGPT');
  }

  set webviewView(webviewView: WebviewView) {
    this._webviewView = webviewView;

    webviewView.webview.onDidReceiveMessage(data => {
      if (data !== 'askQuackGPT') {
        return;
      }
      window.showInputBox({
        prompt: 'Ask QuackGPT showcases the latest breakthroughs in duck centric AI. Ask me anything!'
      }).then((value) => {
        if (value === undefined || this._quackGPTchannel === undefined) {
          return;
        }
        this._quackGPTchannel.appendLine(this.getQuackGPTResponse(value || 'Quack.'));
        this._quackGPTchannel.show();
        this.quack(this.audio);
      })
    });
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

  protected getQuackGPTResponse(value: string) : string {
    const sentences = new Array(Math.ceil(Math.random() * 3));
    for (let i = 0; i < sentences.length; i++) {
      sentences[i] = this.getSentence();
    }

    return sentences.join(this.getSentenceEnd() + ' ') + this.getSentenceEnd();
  }

  protected getSentence() {
    const quacks = new Array(Math.ceil(Math.random() * 20) + 2);
    for (let i = 0; i < quacks.length; i++) {
      quacks[i] =  i === 0 ? 'Quack': 'quack';
    }

    return quacks.join(' ');
  }

  protected getSentenceEnd() : string
  {
    return Math.ceil(Math.random() * 100) <= 70 ? '.' :
      (Math.ceil(Math.random() * 100) <= 60 ? '!' : '?');
  }

}
