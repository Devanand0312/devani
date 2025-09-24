import axios from "axios";
import { createClient } from "redis";
import fs from "fs";
import { fileURLToPath } from "url";

const redisClient = createClient();
await redisClient.connect();

const filterData = JSON.parse(fs.readFileSync("data.json", "utf8"));

const getCMMasterList = async () => {
  const baseUrl = await redisClient.get("stockBaseUrl");
  const list = await axios.post(`${baseUrl}/apimarketdata/instruments/master`, {
    exchangeSegmentList: ["NSECM"],
  });
  const returnData = list.data.result;
  return returnData;
};

const headers =
  "ExchangeSegment|ExchangeInstrumentID|InstrumentType|Name|Description|Series|NameWithSeries|InstrumentID|PriceBand.High|PriceBand.Low|FreezeQty|TickSize|LotSize|Multiplier|displayName|ISIN|PriceNumerator|PriceDenominator";

function parseRowsToJson(data, headers) {
  const rows = data.trim().split("\n");
  const keys = headers.split("|");

  return rows.map((row) => {
    const values = row.split("|");
    const obj = {};
    keys.forEach((key, i) => {
      if (values[i] !== undefined) {
        obj[key.trim()] = values[i];
      }
    });
    return obj;
  });
}

//Convert to CSV
function jsonToCsv(jsonArray) {
  if (jsonArray.length === 0) return "";

  const headers = Object.keys(jsonArray[0]);
  const csvRows = [
    headers.join(","), // header row
    ...jsonArray.map((obj) =>
      headers.map((h) => JSON.stringify(obj[h] ?? "")).join(",")
    ),
  ];

  return csvRows.join("\n");
}

(async () => {
  const masterList = await getCMMasterList();
  const parsedList = parseRowsToJson(masterList, headers);
  console.log("got master list and parsed");
  const filteredList = parsedList.filter(
    (item) =>
      item.Series === "EQ" && filterData.some((f) => f.symbol === item.Name)
  );

  console.log("filtered");

  const csvData = jsonToCsv(filteredList);

  //  Save CSV file
  fs.writeFileSync("filtered.csv", csvData);
  console.log("saved");
})();
