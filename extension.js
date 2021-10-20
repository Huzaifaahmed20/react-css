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
      let paste = !clipboard ? '' : convertCss(clipboard);
      clipboardy.writeSync(paste);
      vscode.commands.executeCommand('editor.action.clipboardPasteAction'); // this should be formatted paste
    }
  );

  context.subscriptions.push(disposable);
}

function convertCss(css = '') {
  const converted = css
    .trim()
    .split('\n')
    .map((item) => item.trim().split(':'))
    .reduce(rowIntoJsObject, {});

  return JSON.stringify(converted, null, 2)
    .split('\n')
    .map(convertCssCommentIntoJsComment)
    .join('\n')
    .replace('{', '')
    .replace('}', '')
    .trim();
}

function rowIntoJsObject(accumulatedRow = {}, [key, value] = ['', '']) {
  const propertyName = generatePropertyName(key);
  const sanitizedValue = generateSanitizedValue(value);
  return {
    ...accumulatedRow,
    [propertyName]: sanitizedValue,
  };
}

function generatePropertyName(key = '') {
  if (key.startsWith('-')) {
    return key;
  }
  return kebabToCamel(key);
}

function kebabToCamel(kebabCasedString = '') {
  const [firstSection, ...remainingSplittedPropertyName] =
    kebabCasedString.split('-');
  return [
    firstSection,
    remainingSplittedPropertyName.map(
      (item = '') => item.slice(0, 1).toUpperCase() + item.slice(1, item.length)
    ),
  ].join('');
}

function generateSanitizedValue(value = '') {
  const sanitizedValue = value.trim().replace(';', '');
  return Number.isNaN(+sanitizedValue) ? sanitizedValue : +sanitizedValue;
}

function convertCssCommentIntoJsComment(row = '') {
  return !row.includes('/*')
    ? row
    : '//'.concat(row.replace('/*', '').replace('*/', '').trim());
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
