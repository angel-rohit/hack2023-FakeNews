import indices from "../store/indices.store";
import { updateSocket } from "../store/socket.store";

const commonWebSocketWorker = new Worker('../websocket.worker.js');

export function sendCommonSocketDataToWorker(data) {
  commonWebSocketWorker.postMessage(data);
}

/* webSocket onMessage listener */
commonWebSocketWorker.onmessage = function(e) {
  const data = e.data;
  const { type, payload } = data;
  const obj = payload?.tick ?? {};
  const key = Object.keys(obj)[0];
  const value = Object.values(obj)[0];
  switch (type) {
    case "SOCKET_DATA_RECEIVED":
      updateSocket(key, value);
      break;
    case "TRIGGER_RELOAD":
      location.reload();
      break;
    case "RECONNECTWS":
      console.error('reconnecting websocket from worker-api');
      break;
  }
};

function getPinnedStocksSubscription(){
  let tokenString = '';
  indices.forEach((row)=>{
    tokenString+=`1=${row.mktSegID}$7=${row.token}|`;
  });
  return tokenString;
}

export const subscribeWatchlist = (watchlist) => { 
  let subscriptionString = `63=FT3.0|64=206|65=1|${getPinnedStocksSubscription()}`;
  watchlist.forEach((row)=>{
      subscriptionString+=`1=${row.mktSegID}$7=${row.token}|`;
  });
  subscriptionString+='230=3';
  console.log('* sendign socket message : ', subscriptionString);
  try {
    sendCommonSocketDataToWorker(
      JSON.stringify({
        type: "SEND_MESSAGE",
        payload: subscriptionString
      })
    );
  } catch {
    console.log("err connecting ws");
  }
};
