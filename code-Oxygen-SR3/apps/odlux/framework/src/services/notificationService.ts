import * as X2JS from 'x2js';

const socketUrl = [ location.protocol === 'https:' ? 'wss://' : 'ws://', 'admin', ':', 'admin', '@', location.hostname, ':8085/websocket'].join('');
const subscriptions: { [scope: string]: SubscriptionCallback[] } = { };

export interface IFormatedMessage {
  notifType: string | null;
  time: string;
}

export type SubscriptionCallback<TMessage extends IFormatedMessage = IFormatedMessage> = (msg: TMessage) => void;

function formatData(event: MessageEvent) : IFormatedMessage | undefined {

  var x2js = new X2JS();
  var jsonObj: { [key: string]: IFormatedMessage } = x2js.xml2js(event.data);
  if (jsonObj && typeof (jsonObj) === 'object') {

    const notifType = Object.keys(jsonObj)[0];
    const formated = jsonObj[notifType];
    formated.notifType = notifType ;
    formated.time = new Date().toISOString();
    return formated;
  }
  return undefined;

}

export function subscribe<TMessage extends IFormatedMessage = IFormatedMessage>(scope: string | string[], callback: SubscriptionCallback<TMessage>): Promise<boolean> {
  return socketReady.then((notificationSocket) => {
    const scopes = scope instanceof Array ? scope : [scope];
    
    // ind all new scopes to subscribe
    const newScopesToSubscribe: string[] = scopes.reduce((acc: string[], cur: string) => {
      const currentCallbacks = subscriptions[cur];
      if (currentCallbacks) {
        if (!currentCallbacks.some(c => c === callback)) {
          currentCallbacks.push(callback);
        }
      } else {
        subscriptions[cur] = [callback];
        acc.push(cur);
      }
      return acc;
    }, []);

    if (newScopesToSubscribe.length === 0) {
      return true;
    }

    // send a subscription to all active scopes
    const scopesToSubscribe = Object.keys(subscriptions);
    if (notificationSocket.readyState === notificationSocket.OPEN) {
      const data = {
        'data': 'scopes',
        'scopes': scopesToSubscribe
      };
      notificationSocket.send(JSON.stringify(data));
      return true;
    }
    return false;
  });
}

export function unsubscribe<TMessage extends IFormatedMessage = IFormatedMessage>(scope: string | string[], callback: SubscriptionCallback<TMessage>): Promise<boolean> {
  return socketReady.then((notificationSocket) => {
    const scopes = scope instanceof Array ? scope : [scope];
    scopes.forEach(s => {
      const callbacks = subscriptions[s];
      const index = callbacks && callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        subscriptions[s] === undefined;
      }
    });

    // send a subscription to all active scopes
    const scopesToSubscribe = Object.keys(subscriptions);
    if (notificationSocket.readyState === notificationSocket.OPEN) {
      const data = {
        'data': 'scopes',
        'scopes': scopesToSubscribe
      };
      notificationSocket.send(JSON.stringify(data));
      return true;
    }
    return false;
  });
}

const connect = (): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const notificationSocket = new WebSocket(socketUrl);

    notificationSocket.onmessage = (event) => {
      // process received event
      if (typeof event.data === 'string') {
        const formated = formatData(event);
        if (formated && formated.notifType) {
          const callbacks = subscriptions[formated.notifType];
          if (callbacks) {
            callbacks.forEach(cb => {
              // ensure all callbacks will be called 
              try {
                return cb(formated);
              } catch (reason) {
                console.error(reason);
              }
            });
          }
        }
      }
    };

    notificationSocket.onerror = function (error) {
      console.log("Socket error: " + error);
      reject("Socket error: " + error);
    };

    notificationSocket.onopen = function (event) {
      console.log("Socket connection opened.");
      resolve(notificationSocket);
    };

    notificationSocket.onclose = function (event) {
      socketReady = connect();
    };
  });
}

let socketReady = connect();




