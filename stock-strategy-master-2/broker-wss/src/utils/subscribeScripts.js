import removeUnknownKeys from "./removeUnknownKeys.js";

// subscribeRequiredScripts(dataEgArr);

// expected ds from redis
/*
    spot scripts = [
{
         "exchangeSegments" : number,
         "exchangeInstrumentId" : number,
         "anyOtherKey":string // remove it 
}
         ]
*/

async function subscribeRequiredScripts(data, xtsMarketDAtaAPI) {
  const requiredData = removeUnknownKeys(data, [
    "exchangeInstrumentId",
    "exchangeSegment",
  ]);
  try {
    const res = await xtsMarketDAtaAPI.subscription({
      instruments: requiredData,
      xtsMessageCode: 1502,
    });
  } catch (e) {
    throw new Error("Something went wrong while subscribing Spot scripts");
  }
}

// const dataEgArr = [
//   {
//     exchangeSegment: 1,
//     exchangeInstrumentId: 250,
//     name: "Reliance Industries",
//   },
//   {
//     exchangeInstrumentId: 2,
//     exchangeSegment: 99023,
//     name: "infosys",
//   },
// ];
