import {domUtils } from '@dfsj/utils';
const { addClass, hasClass, removeClass } =domUtils;

export async function updateThemeName(mode: string) {
  const htmlRoot = document.getElementById('htmlRoot');
  if (!htmlRoot || !mode) {
    return;
  }
  htmlRoot.setAttribute('data-theme-name', mode);
}
