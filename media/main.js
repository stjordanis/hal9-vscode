(function () {
    const vscode = acquireVsCodeApi();
    vscode.postMessage({ command: 'message', text: 'something' });

    const logHost = console.log;

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.command) {
            case 'run':
                logHost('Request to run: ' + message.code);
                
                var log = (message) => {
                    logHost('Logging message: ' + message);
                    vscode.postMessage({ command: 'message', text: message });
                }
                console.log = log;

                try {
                    eval("(async () => {" + message.code + "})()");
                }
                catch(e) {
                    logHost(e.toString());
                    vscode.postMessage({ command: 'error', text: e.toString() });
                }
                break;
        }
    });
}());