const fetch = require("node-fetch");
const moment = require("moment");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.saveToS3 = async event => {
  const res = await fetch(process.env.CUSTOMER_CSV_ENDPOINT);
  const csvContent = await res.text();

  if (!res.ok)
    throw new Error(
      `Failed to fetch ${res.url}: ${res.status} ${
        res.statusText
      }`
    );

  await s3.putObject({
    Bucket: process.env.CSV_STORAGE_BUCKET,
    Key: `${moment().format("YYYYMMDDHHmmss")}.csv`,
    Body: csvContent
  }).promise();

  const response = {
    statusCode: 200,
    body: "File uploaded to S3"
  };
  return response;
};
