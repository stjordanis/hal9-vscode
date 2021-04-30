(function () {
    const vscode = typeof(acquireVsCodeApi) != 'undefined' ? acquireVsCodeApi() : {};

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.command) {
            case 'run':
                var log = (message) => {
                    vscode.postMessage({ command: 'log', text: message });
                }
                console.log = log;

                eval("(async () => {" + message.code + "})()");
                break;
        }
    });
}());