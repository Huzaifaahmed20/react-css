const vscode = require('vscode');
const clipboardy = require('clipboardy');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "react-css-copypaste" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    'react-css-copypaste.pasteCSS',
    function () {
      const clipboard = clipboardy.readSync();
      let paste = '';
      if (clipboard) {
        const rows = clipboard.trim().split('\n');
        rows.forEach((row) => {
          const _row = row.trim().split(':');
          let rules = _row[0].trim().split('-');
          let rule = rules.shift();
          for (let i = 0; i < rules.length; i++) {
            rule +=
              rules[i][0].toUpperCase() +
              rules[i].substring(1, rules[i].length).toLowerCase();
          }
          let value = _row[1].trim().replace(';', '');
          paste += `${rule}: '${value}',\n`;
        });
        clipboardy.writeSync(paste);
        vscode.commands.executeCommand('editor.action.clipboardPasteAction'); // this should be formated paste
        //   clipboardy.writeSync(clipboard);
      }
    }
  );

  context.subscriptions.push(disposable);
}
function convertCss(css = '') {
  const converted = css
    .trim()
    .split('\n')
    .map((item) => item.trim().split(':'))
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key
          .split('-')
          .map((item, idx) =>
            idx === 0
              ? item
              : item.slice(0, 1).toUpperCase() + item.slice(1, item.length)
          )
          .join('')]: value.trim(),
      }),
      {}
    );
  return converted;
}
// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
