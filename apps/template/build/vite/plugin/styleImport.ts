import type { Plugin } from 'vite';
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import';

export function configStyleImportPlugin(isBuild: boolean) : Plugin | Plugin[] {

  const plugins: Plugin[] = [];

  return createStyleImportPlugin({
    resolves: [
      VxeTableResolve()
    ],
  })
}
