const vscode = require('vscode');
var net = require('net');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('mari-bridge.runInMari', () => run());
	context.subscriptions.push(disposable);

    // Status bar button
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
    statusBarItem.command = "mari-bridge.runInMari";
    statusBarItem.text = "Run in Mari";
    statusBarItem.show();
}

function run() {
    // Confing values
    const config = vscode.workspace.getConfiguration('mari-bridge');
    host = config.get('host').toString();
    port = config.get('port');

    console.log("Host="+host);
    console.log("Port="+port.toString());

    // Create connection
    connection = net.createConnection(port, host);
    connection.on('error', function(error) {
        vscode.window.showErrorMessage("Unable to connect to " + host + ":" + port + "\n" + error.code);
    });
    connection.on('data', function(data) {
        console.log(data.toString());
    });
    
    // Get text
    var editor = vscode.window.activeTextEditor;
    var selection = editor.selection;
    
    var text;
    if (selection.isEmpty)
    {
        text = editor.document.getText();
    }
    else
    {
        text = editor.document.getText(selection);     
    }
    
    // Execute
    connection.write(text + '\x04');
    vscode.window.setStatusBarMessage("Code executed in Mari", 2000);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

