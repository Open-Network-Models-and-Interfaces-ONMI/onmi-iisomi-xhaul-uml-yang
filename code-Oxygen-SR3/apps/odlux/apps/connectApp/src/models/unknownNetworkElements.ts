/**
* Represents data of Unknown Network Elements.
*/
export interface IUnknownNetworkElementsExtended {
  [key: string]: any;
  name: string,
  host: string,
  netConfPort: string,
  coreModel: string,
  airInterface: string,
  unknownConnectionStatus: string;
}

export interface IUnknownNetworkElements {
  unknownNetworkElements: IUnknownNetworkElementsExtended[],
  search: string
}