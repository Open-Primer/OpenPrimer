const ts = require('typescript');
const fs = require('fs');

const content = fs.readFileSync('src/lib/ai.ts', 'utf8');
const sourceFile = ts.createSourceFile('src/lib/ai.ts', content, ts.ScriptTarget.Latest, true);

function findMapConcurrent(node) {
  if (ts.isCallExpression(node)) {
    const expr = node.expression;
    if (ts.isIdentifier(expr) && expr.text === 'mapConcurrent') {
      return node;
    }
  }
  return ts.forEachChild(node, findMapConcurrent);
}

const node = findMapConcurrent(sourceFile);
if (!node) {
  console.error("Could not find mapConcurrent node!");
  process.exit(1);
}

const callback = node.arguments[2];
if (!callback || !ts.isArrowFunction(callback) || !ts.isBlock(callback.body)) {
  console.error("Callback is not an arrow function with a block body!");
  process.exit(1);
}

console.log(`Callback body has ${callback.body.statements.length} statements.`);
callback.body.statements.forEach((stmt, idx) => {
  const start = ts.getLineAndCharacterOfPosition(sourceFile, stmt.getStart());
  const end = ts.getLineAndCharacterOfPosition(sourceFile, stmt.getEnd());
  console.log(`Statement ${idx}: Kind = ${ts.SyntaxKind[stmt.kind]} (lines ${start.line + 1}-${end.line + 1})`);
  
  if (ts.isTryStatement(stmt)) {
    console.log(`  This is a TryStatement!`);
    console.log(`  TryBlock statements count: ${stmt.tryBlock.statements.length}`);
    stmt.tryBlock.statements.forEach((tStmt, tIdx) => {
      const tStart = ts.getLineAndCharacterOfPosition(sourceFile, tStmt.getStart());
      const tEnd = ts.getLineAndCharacterOfPosition(sourceFile, tStmt.getEnd());
      console.log(`    TryStmt ${tIdx}: Kind = ${ts.SyntaxKind[tStmt.kind]} (lines ${tStart.line + 1}-${tEnd.line + 1})`);
    });
  }
});
