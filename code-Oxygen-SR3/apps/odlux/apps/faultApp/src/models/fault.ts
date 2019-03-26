export type FaultType = {
  nodeName: string;
  counter: string;
  timeStamp: string;
  objectId: string;
  problem: string;
  severity: null | 'Warning' | 'Minor' | 'Major' | 'Critical' ;
  type: string;
}
export type FaultResult = { faultCurrent: FaultType };

export type FaultLog = { fault: FaultType };

export type Fault = FaultType & { _id: string };
