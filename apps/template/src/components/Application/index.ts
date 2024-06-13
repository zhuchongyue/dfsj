
import appProvider from './src/AppProvider.vue';
import {withInstall} from "/@/utils";
export { useAppProviderContext } from './src/useAppContext';
export const AppProvider = withInstall(appProvider);
