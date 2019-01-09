import { ApplicationStore } from '../store/applicationStore';

let applicationStore: ApplicationStore | null = null;

export const setApplicationStore = (store: ApplicationStore) => {
  applicationStore = store;
}

class ApplicationApi {
  get applicationStore(): ApplicationStore | null {
    return applicationStore;
  }
}

export const applicationApi = new ApplicationApi();
export default applicationApi;