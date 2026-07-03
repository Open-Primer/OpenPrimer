const ts = require('typescript');

const program = ts.createProgram(['C:/Silvere/Encours/Developpement/OpenPrimer/web/src/lib/ai.ts'], {
  noEmit: true,
  target: ts.ScriptTarget.Latest,
  module: ts.ModuleKind.CommonJS
});

const diagnostics = ts.getPreEmitDiagnostics(program);

console.log(`Found ${diagnostics.length} diagnostics.`);
diagnostics.forEach(diag => {
  if (diag.file) {
    const { line, character } = ts.getLineAndCharacterOfPosition(diag.file, diag.start);
    const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
    console.log(`${diag.file.fileName} (${line + 1},${character + 1}): ${message}`);
  } else {
    console.log(ts.flattenDiagnosticMessageText(diag.messageText, '\n'));
  }
});
