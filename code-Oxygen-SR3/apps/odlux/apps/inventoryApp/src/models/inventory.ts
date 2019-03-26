export { HitEntry, Result } from '../../../../framework/src/models';
export type Inventory = {
  treeLevel: number;
  parentUuid: string;
  mountpoint: string;
  uuid: string;
  containedHolder?: (string)[] | null;
  manufacturerName?: string ;
  manufacturerIdentifier: string;
  serial: string;
  date: string;
  version: string;
  description: string;
  partTypeId: string;
  modelIdentifier: string;
  typeName: string;
}
