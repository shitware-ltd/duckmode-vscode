import * as vscode from 'vscode';

export default class SpeciesViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'duck-mode.speciesView';

    private _view?: vscode.WebviewView;

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
            // I'm not going to hook this up yet. I just want to waste your precious CPU cycles. Welcome to the Cloud.
		});
    }

    public doQuack() {
        if (this._view) {
            this._view.show?.(true);
            this._view.webview.postMessage({ type: 'audioQuack'});
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {

		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'main.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'main.css'));

        const quackMp3Uri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources', 'quack.mp3'));
        const duckImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'resources'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; media-src ${webview.cspSource}; img-src ${webview.cspSource};">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				<title>Duck Mode</title>
			</head>
			<body>
                <button id="sound-button">Enable Audio</button>
				<audio src="${quackMp3Uri}"></audio>
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
