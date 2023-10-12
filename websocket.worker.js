let socket = null;
let wsurl = "";
let isHBReqSent = true;
let hbReqTimerId = null;
let reattemptTimerId = null;
let reattempt = 1;
let clientId = null;
let deviceId = "";
const reattemptLimit = 8;

self.socketOnOpen = function() {
  if (reattemptTimerId) {
    self.postMessage({
      type: "RECONNECTWS"
    });
    clearInterval(reattemptTimerId);
    reattemptTimerId = null;
    reattempt = 1;
  }

  hbReqTimerId = setInterval(() => {
    self.heartbeat();
  }, 1000 * reattemptLimit);
};

self.socketOnMessage = function(message) {
  if (message.data instanceof ArrayBuffer) {
    self.onMessageRecieve(message.data);
  } else {
    if (!isHBReqSent && message.data == "pong") isHBReqSent = true;
  }
};
self.socketOnClose = function() {
  clearInterval(hbReqTimerId);
  hbReqTimerId = null;

  if (!reattemptTimerId) {
    reattemptTimerId = setInterval(() => {
      if (reattemptTimerId && reattempt <= reattemptLimit) {
        self.reInitWebsocket();
        reattempt++;
      }
      if (reattempt >= reattemptLimit) {
        clearInterval(reattemptTimerId);
        self.postMessage({
          type: "TRIGGER_RELOAD"
        });
        console.log("socket disconnected", reattempt);
      }
    }, 1000 * 5);
  }
};

self.socketOnError = function(error) {
  if (socket.readyState == 1) {
    socket.close();
  } else {
    // @TODO Need to display some toast for user to convey connectivity issue
    // location.reload();
    console.log("socketOnError", error);
  }
};

self.reInitWebsocket = function() {
  self
    .initWebsocket()
    .then(() => {
      self.postMessage({
        type: "RECONNECTWS"
      });
      isHBReqSent = true;
    })
    .catch(error => console.log("socket error", error));
};

self.heartbeat = function() {
  if (!socket) socket.close();

  if (isHBReqSent) {
    socket.send("ping");
    isHBReqSent = false;
  } else {
    socket.close();
  }
};

self.sendSocketMessage = function(req) {
  waitForSocketConnection(function() {
    socket.send(req);
  });
};

function waitForSocketConnection(callback) {
  setTimeout(function() {
    if (socket.readyState === 1) {
      if (callback != null) {
        callback();
      }
    } else {
      waitForSocketConnection(callback);
    }
  }, 5); // wait 5 milisecond for the connection...
}

self.onmessage = function(e) {
  const data = JSON.parse(e.data);
  const { type, payload } = data;
  switch (type) {
    case "INIT_WEBSOCKET":
      self.initWebsocket();
      break;
    case "SET_DATA":
      self.setData(payload);
      break;
    case "SEND_MESSAGE":
      self.sendSocketMessage(payload);
      break;
  }
};

self.setData = function(payload) {
  clientId = payload.clientId;
  wsurl = payload.wsurl;
  deviceId = payload.deviceId;
};

self.initWebsocket = function() {
  wsurl = wsurl.replace("{{deviceId}}", deviceId);
  // wsurl = wsurl.replace("{{clientId}}", store.getters.userData.ClientCode);
  wsurl = wsurl.replace("{{clientId}}", clientId);

  return new Promise(function(resolve, reject) {
    try {
      socket = new WebSocket(wsurl);
      socket.onopen = self.socketOnOpen;
      socket.onmessage = self.socketOnMessage;
      socket.onerror = self.socketOnError;
      socket.onclose = self.socketOnClose;
      socket.binaryType = "arraybuffer";
      resolve(socket);
    } catch (error) {
      reject(error);
    }
  });
};

self.onMessageRecieve = function(data) {
  const message = data;
  const resp = [];
  let obj = {};
  let iToken,
    iMktSegID,
    iLastPrice,
    iChange,
    oi,
    oiChange,
    name,
    iOpenPrice,
    iHighPrice,
    iLowPrice,
    iClosePrice,
    iAvgPrice,
    iTotalVolume,
    iLastUpdatedTime,
    iYearHigh,
    iYearLow,
    iTotalBuyQty,
    iTotalSellQty,
    iLcl,
    iUcl,
    bp,
    sp,
    bq,
    bs,
    bp1,
    sp1,
    bq1,
    bs1,
    bp2,
    sp2,
    bq2,
    bs2,
    bp3,
    sp3,
    bq3,
    bs3,
    bp4,
    sp4,
    bq4,
    bs4;

  let divider = 100;
  let precsn = 2;
  let dataView = new DataView(message);
  //   let miToken = dataView.getInt32(4, true);
  //   let a = dataView.getInt16(0);
  //   let len = dataView.getInt8(2);
  let iTransCode = dataView.getInt8(3);

  if (
    iTransCode == 100 ||
    iTransCode == 101 ||
    iTransCode == 106 ||
    iTransCode == 107
  ) {
    if (iTransCode == 100 || iTransCode == 106) {
      iToken = dataView.getInt32(4, true);
      iMktSegID = dataView.getInt8(8);
      iLastPrice = dataView.getInt32(9, true);
      iChange = dataView.getInt32(13, true);
      oi = dataView.getInt32(17, true);
      oiChange = dataView.getInt32(21, true);

      if (iTransCode == 106) iTotalVolume = dataView.getInt32(25, true);
    } else {
      const arrChar = [];
      for (let i = 4; i < 33; i++) {
        if (dataView.getUint8(i) > 0) arrChar.push(dataView.getUint8(i));
      }

      iToken = String.fromCharCode.apply(String, arrChar);

      iMktSegID = dataView.getInt8(34);
      iLastPrice = dataView.getInt32(35, true);
      iChange = dataView.getInt32(39, true);
      oi = dataView.getInt32(43, true);
      oiChange = dataView.getInt32(47, true);
      if (iTransCode == 107) iTotalVolume = dataView.getInt32(51, true);
    }

    name = "sf";

    if (iToken == 26000 || iToken == 26009 || iToken == 19000) name = "if";

    if (iMktSegID == 13) {
      divider = 10000000;
      precsn = 4;
    }

    let ltp = (iLastPrice / divider).toFixed(precsn);
    let chg = (iChange / divider).toFixed(precsn);
    let chgp = (
      (parseFloat(chg) / (parseFloat(ltp) - parseFloat(chg))) *
      100
    ).toFixed(2);

    if (ltp == chg) {
      chg = 0;
      chgp = 0;
    }

    obj = {
      name: name,
      mkt: iMktSegID,
      tk: iToken,
      ltp: ltp,
      cng: isNaN(chg) ? 0 : chg,
      nc: isNaN(chgp) ? 0 : parseFloat(chgp),
      oi: oi, //(oi / divider).toFixed(precsn),
      oicng: oiChange, //(oiChange / divider).toFixed(precsn),
      oicngp: isNaN((oiChange / oi) * 100)
        ? 0
        : ((oiChange / oi) * 100).toFixed(precsn),
      v: iTransCode == 106 || iTransCode == 107 ? iTotalVolume : 0
    };
  } else if (iTransCode == 102 || iTransCode == 103) {
    if (iTransCode == 102) {
      iToken = dataView.getInt32(4, true);
      iMktSegID = dataView.getInt8(8);
      iOpenPrice = dataView.getInt32(9, true);
      iHighPrice = dataView.getInt32(13, true);
      iLowPrice = dataView.getInt32(17, true);
      iLastPrice = dataView.getInt32(21, true);
      iClosePrice = dataView.getInt32(25, true);
      iAvgPrice = dataView.getInt32(29, true);
      iTotalVolume = dataView.getInt32(33, true);
      iLastUpdatedTime = dataView.getInt32(37, true);
      iChange = dataView.getInt32(41, true);
      iYearHigh = dataView.getInt32(45, true);
      iYearLow = dataView.getInt32(49, true);
      iTotalBuyQty = dataView.getInt32(53, true);
      iTotalSellQty = dataView.getInt32(57, true);
      iLcl = dataView.getInt32(61, true);
      iUcl = dataView.getInt32(65, true);

      bq = dataView.getInt32(69, true);
      bp = dataView.getInt32(73, true);
      // 77
      bq1 = dataView.getInt32(81, true);
      bp1 = dataView.getInt32(85, true);
      // 89
      bq2 = dataView.getInt32(93, true);
      bp2 = dataView.getInt32(97, true);
      // 101
      bq3 = dataView.getInt32(105, true);
      bp3 = dataView.getInt32(109, true);
      // 113
      bq4 = dataView.getInt32(117, true);
      bp4 = dataView.getInt32(121, true);
      // 125

      sp = dataView.getInt32(133, true);
      bs = dataView.getInt32(129, true);
      // 137
      sp1 = dataView.getInt32(145, true);
      bs1 = dataView.getInt32(141, true);
      // 149
      sp2 = dataView.getInt32(157, true);
      bs2 = dataView.getInt32(153, true);
      // 161
      sp3 = dataView.getInt32(169, true);
      bs3 = dataView.getInt32(165, true);
      // 173
      sp4 = dataView.getInt32(181, true);
      bs4 = dataView.getInt32(177, true);
      // 189
      /* == new oi fied added == */
      oi = dataView.getInt32(189, true);
    } else {
      const arrChar = [];
      for (let i = 4; i < 33; i++) {
        if (dataView.getUint8(i) > 0) arrChar.push(dataView.getUint8(i));
      }

      iToken = String.fromCharCode.apply(String, arrChar);

      iMktSegID = dataView.getInt8(34);
      iOpenPrice = dataView.getInt32(35, true);
      iHighPrice = dataView.getInt32(39, true);
      iLowPrice = dataView.getInt32(43, true);
      iLastPrice = dataView.getInt32(47, true);
      iClosePrice = dataView.getInt32(51, true);
      iAvgPrice = dataView.getInt32(55, true);
      iTotalVolume = dataView.getInt32(59, true);
      iLastUpdatedTime = dataView.getInt32(63, true);
      iChange = dataView.getInt32(67, true);
      iYearHigh = dataView.getInt32(71, true);
      iYearLow = dataView.getInt32(75, true);
      iTotalBuyQty = dataView.getInt32(79, true);
      iTotalSellQty = dataView.getInt32(83, true);
      iLcl = dataView.getInt32(87, true);
      iUcl = dataView.getInt32(91, true);

      bq = dataView.getInt32(95, true);
      bp = dataView.getInt32(99, true);
      // 103
      bq1 = dataView.getInt32(107, true);
      bp1 = dataView.getInt32(111, true);
      // 115
      bq2 = dataView.getInt32(119, true);
      bp2 = dataView.getInt32(123, true);
      // 127
      bq3 = dataView.getInt32(131, true);
      bp3 = dataView.getInt32(135, true);
      // 139
      bq4 = dataView.getInt32(143, true);
      bp4 = dataView.getInt32(147, true);
      // 151

      bs = dataView.getInt32(155, true);
      sp = dataView.getInt32(159, true);
      // 163
      bs1 = dataView.getInt32(167, true);
      sp1 = dataView.getInt32(171, true);
      // 175
      bs2 = dataView.getInt32(179, true);
      sp2 = dataView.getInt32(183, true);
      // 187
      bs3 = dataView.getInt32(191, true);
      sp3 = dataView.getInt32(195, true);
      // 199
      bs4 = dataView.getInt32(203, true);
      sp4 = dataView.getInt32(207, true);
      /* == new oi fied added == */
      oi = dataView.getInt32(215, true);
      // 211
    }

    name = "dp";

    // if (iToken == 26000 || iToken == 26009 || iToken == 19000) name = "if";

    if (iMktSegID == 13) {
      divider = 10000000;
      precsn = 4;
    }

    let ltp = (iLastPrice / divider).toFixed(precsn);
    let chg = (iChange / divider).toFixed(precsn);
    let chgp = (
      (parseFloat(chg) / (parseFloat(ltp) - parseFloat(chg))) *
      100
    ).toFixed(2);

    if (ltp == chg) {
      chg = 0;
      chgp = 0;
    }

    obj = {
      name: name,
      mkt: iMktSegID,
      tk: iToken,
      ltp: ltp,
      cng: isNaN(chg) ? 0 : chg,
      nc: isNaN(chgp) ? 0 : parseFloat(chgp),
      c: (iClosePrice / divider).toFixed(precsn),
      v: iTotalVolume,
      op: (iOpenPrice / divider).toFixed(precsn),
      h: (iHighPrice / divider).toFixed(precsn),
      lo: (iLowPrice / divider).toFixed(precsn),
      ltt: iLastUpdatedTime,
      tbq: iTotalBuyQty,
      tsq: iTotalSellQty,
      bq: bq,
      bp: (bp / divider).toFixed(precsn),
      sp: (sp / divider).toFixed(precsn),
      bs: bs,
      bq1: bq1,
      bp1: (bp1 / divider).toFixed(precsn),
      sp1: (sp1 / divider).toFixed(precsn),
      bs1: bs1,
      bq2: bq2,
      bp2: (bp2 / divider).toFixed(precsn),
      sp2: (sp2 / divider).toFixed(precsn),
      bs2: bs2,
      bq3: bq3,
      bp3: (bp3 / divider).toFixed(precsn),
      sp3: (sp3 / divider).toFixed(precsn),
      bs3: bs3,
      bq4: bq4,
      bp4: (bp4 / divider).toFixed(precsn),
      sp4: (sp4 / divider).toFixed(precsn),
      bs4: bs4,
      oi,
      atp: (iAvgPrice / divider).toFixed(precsn),
      YearHigh: (iYearHigh / divider).toFixed(precsn),
      YearLow: (iYearLow / divider).toFixed(precsn),
      Lcl: (iLcl / divider).toFixed(precsn),
      Ucl: (iUcl / divider).toFixed(precsn)
    };
  }

  resp.push(obj);
  const tick = {
    [obj.tk]: obj
  };
  self.postMessage({
    type: "SOCKET_DATA_RECEIVED",
    payload: {
      resp,
      tick
    }
  });
};
