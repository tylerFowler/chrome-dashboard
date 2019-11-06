import { ApplicationStore } from './interface';
import LocalStorage from './localStorage';
import ChromeStorage from './chromeStorage';

// this global variable should be inserted by the build tooling to determine what
// should be used as the settings storage mechanism
declare var __SETTINGS_STORE__: 'chromeStorage'|'localStorage';

// TODO: when it's possible we want to do conditional importing
let applicationStore: ApplicationStore;
switch (__SETTINGS_STORE__) {
case 'chromeStorage':
  if (chrome && chrome.storage) {
    applicationStore = new ChromeStorage();
    break;
  }

  console.warn('Chrome storage not detected in this environment, falling back to localStorage');
case 'localStorage':
default:
  applicationStore = new LocalStorage();
}

export default applicationStore;
