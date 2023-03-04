import * as vscode from 'vscode';

export default class SpeciesViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'duck-mode.speciesView';

    private _view?: vscode.WebviewView;
    private _quackGPTchannel?: vscode.OutputChannel;
    

    constructor(
        private readonly _extensionUri: vscode.Uri
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView, 
        context: vscode.WebviewViewResolveContext, 
        token: vscode.CancellationToken
    ): void | Thenable<void> {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,

            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(data => {
            vscode.window.showInputBox({
                prompt: 'Ask QuackGPT showcases the latest breakthroughs in duck centric AI. Ask me anything!'
            }).then((value) => {
                if (value === undefined) {
                    return;
                }
                this.getQuackGPTChannel().appendLine(this.getQuackGPTResponse(value || 'Quack.'));
                this.getQuackGPTChannel().show();
                if (this._view) {
                    this._view.show?.(true);
                    this._view.webview.postMessage({ type: 'audioQuack'});
                }
            })
		});
    }

    public doQuack() {
        if (this._view) {
            this._view.show?.(true);
            this._view.webview.postMessage({ type: 'audioQuack'});
        }
    }

    
    protected getQuackGPTChannel() : vscode.OutputChannel {
        if(!this._quackGPTchannel) {
            this._quackGPTchannel = vscode.window.createOutputChannel('QuackGPT');
        }
        
        return this._quackGPTchannel;
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

    private _getHtmlForWebview(webview: vscode.Webview) {

		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'main.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'main.css'));
        const codiconsUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));

        const quackMp3Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'quack.mp3'));
        const duckImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

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

				<audio src="${quackMp3Uri}"></audio>
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

}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
