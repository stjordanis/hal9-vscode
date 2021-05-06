import * as vscode from 'vscode';

function getCodeText(textEditor: vscode.TextEditor) : String {
    const selection = textEditor.selection;       

    if (!selection) {
        return "";
    }

    if (selection.isEmpty) {
        return textEditor.document.getText();
    }

    let multilineSelection : string[] = [];
    for (let line = selection.start.line; line <= selection.end.line; line++){
        let currentLine = textEditor.document.lineAt(line).text;
        if (line === selection.end.line) {
            currentLine = currentLine.substring(0, selection.end.character);
        }
        if (line === selection.start.line) {
            currentLine = currentLine.substring(selection.start.character);
        }
        multilineSelection.push(currentLine);
    }

    return multilineSelection.join('\n');
}

export function activate(context: vscode.ExtensionContext) {
	let disposableWebView = vscode.commands.registerCommand('hal9.start', () => {
		JSPanel.createOrShow(context.extensionUri);
    });

	let disposableSendCode = vscode.commands.registerTextEditorCommand('hal9.sendToJS', (textEditor: vscode.TextEditor) => {
		var code = getCodeText(textEditor);
		JSPanel.runCode(code);
    });

	context.subscriptions.push(disposableSendCode);
	context.subscriptions.push(disposableWebView);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(JSPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
				JSPanel.revive(webviewPanel, context.extensionUri);
			}
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}

class JSPanel {
	public static currentPanel: JSPanel | undefined;

	public static readonly viewType = 'jsCoding';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (JSPanel.currentPanel) {
			JSPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			JSPanel.viewType,
			'Output',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		);

		JSPanel.currentPanel = new JSPanel(panel, extensionUri);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		JSPanel.currentPanel = new JSPanel(panel, extensionUri);
	}

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'error':
						vscode.window.showErrorMessage(message.text);
						return;
					case 'message':
						vscode.window.showInformationMessage(message.text);
						return;
					case 'log':
						console.log(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	public _runCode(code: String) {
		this._panel.webview.postMessage({ command: 'run', code: code });
	}

	public static runCode(code: String) {
		if (JSPanel.currentPanel === undefined) return;
		JSPanel.currentPanel._runCode(code);
	}

	public dispose() {
		JSPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;

		this._panel.title = 'Output';
		this._panel.webview.html = this._getHtmlForWebview(webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const scriptPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js');
		const scriptUri = webview.asWebviewUri(scriptPath);

		const requirePath = vscode.Uri.joinPath(this._extensionUri, 'media', 'require.js');
		const requireUri = webview.asWebviewUri(requirePath);

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>JSCode</title>
				<script src="${requireUri}"></script>
			</head>
			<body>
				<div id="code-history"></div>
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}
