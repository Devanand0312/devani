const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const { createClient } = require("redis");
const jwt = require("jsonwebtoken");
const cors = require("cors");

var XtsMarketDataAPI = require("./xts/lib/MDRestAPI.js");
var XtsMarketDataWS = require("./xts/lib/MDSocket.js");

const subscribeRequiredScripts = require("./utils/subscribeScripts.js");

const { url, port } = config;

let xtsMarketDataAPI = new XtsMarketDataAPI(url);
let xtsMarketDataWS;

let remainingSymbolCount;
let joinStatus = false;

let redisClient;

let token;

const app = express();

app.use(cors());

// app.get("/health", async (req, res) => {
//   const health = {
//     service: "live-price-service",
//     timestamp: new Date().toISOString(),
//     redisConnected: redisClient?.isOpen || false,
//     brokerWSConnected: joinStatus,
//   };

//   res.json(health);
// });

server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

(async () => {
  const { appKey, secretKey } = info;

  try {
    const login = await xtsMarketDataAPI.logIn({ secretKey, appKey });
    if (login.type !== xtsMarketDataAPI.responseTypes.success) {
      throw new Error("Login failed: " + JSON.stringify(login));
    }

    token = login.result.token;
    // console.log(token);
    const userID = login.result.userID;

    xtsMarketDataWS = new XtsMarketDataWS(url);
    xtsMarketDataWS.init({
      userID,
      publishFormat: "JSON",
      broadcastMode: "Full",
      token,
    });
    registerMarketEvents();
    const intervalId = setInterval(() => {
      if (joinStatus) {
        subscribeRequiredScripts(data, xtsMarketDataAPI);
        clearInterval(intervalId);
      }
    }, 1000 * 5);
  } catch (err) {
    console.error("XTS Init Failed:", err);
  }
})();

function registerMarketEvents() {
  xtsMarketDataWS.onConnect(() => console.log("XTS WebSocket connected"));
  xtsMarketDataWS.onJoined((data) => {
    joinStatus = true;
    console.log("XTS WebSocket joined:", data);
  });
  xtsMarketDataWS.onError((err) => console.error("WS error:", err));
  xtsMarketDataWS.onDisconnect(() =>
    console.warn("XTS WebSocket disconnected")
  );

  xtsMarketDataWS.onMarketDepthEvent(async (data) => {
    console.log(data);
  });
}
