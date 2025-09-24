export default function removeUnknownKeys(dataArr, reqKeyNameArr) {
  const filteredArr = dataArr.map((each) => {
    const obj = {};
    reqKeyNameArr.forEach((key) => {
      if (key in each) {
        obj[key] = each[key];
      }
    });
    return obj;
  });
  // console.log(filteredArr);
  return filteredArr;
}

// const dataEgArr = [
//   {
//     exchangeSegment: 1,
//     exchangeInstrumentId: 250,
//     name: "Reliance Industries",
//   },
// ];

// const EgReqKeyNameArr = ["exchangeSegment", "exchangeInstrumentId"];

// removeUnknownKeys(dataEgArr, EgReqKeyNameArr);
