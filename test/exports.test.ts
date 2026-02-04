import { describe, it, expect } from 'vitest';
import * as ts from 'typescript';
import path from 'path';

describe('SDK Type Exports Snapshot', () => {
  it('should match the documented API surface', () => {
    const entryPoint = path.resolve(__dirname, '../src/index.ts');

    const program = ts.createProgram([entryPoint], {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.CommonJS,
      lib: ['lib.esnext.d.ts', 'lib.dom.d.ts']
    });
    
    const checker = program.getTypeChecker();
    const sourceFile = program.getSourceFile(entryPoint);

    if (!sourceFile) throw new Error("Could not find source file");

    const symbol = checker.getSymbolAtLocation(sourceFile);
    const exports = checker.getExportsOfModule(symbol!);

    const snapshot: Record<string, any> = {};

    for (const exp of exports) {
      const name = exp.getName();
      const type = checker.getTypeOfSymbolAtLocation(exp, exp.valueDeclaration || sourceFile);
      const typeString = checker.typeToString(type);

      if (name === 'MapStyle') {
        const subProperties: Record<string, string[]> = {};
        const props = type.getProperties();
        
        for (const prop of props) {
          const propType = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration || sourceFile);

          const variants = propType.getProperties()
            .map(p => p.getName())
            .filter(n => n === n.toUpperCase())
            .sort();
            
          subProperties[prop.getName()] = variants;
        }

        snapshot[name] = subProperties;

      } else {
        snapshot[name] = typeString;
      }
    }

    expect(snapshot).toMatchSnapshot();
  });
});