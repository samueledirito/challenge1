const AWS = require('aws-sdk');
const csv = require('csvtojson');

const convertToJson = async csvContent => csv({
  delimiter: ';',
}).fromString(csvContent);

const saveToDynamo = async (customers) => {
  const dc = new AWS.DynamoDB.DocumentClient();

  const promises = customers.map(customer => dc.put(customer).promise());
  await Promise.all(promises);
};

const saveCustomers = async (event) => {
  const s3 = new AWS.S3();

  const csvContent = await s3
    .getObject({
      Bucket: process.env.CSV_STORAGE_BUCKET,
      Key: event.Records[0].s3.object.key,
    })
    .promise();

  const createCustomerRequest = { TableName: 'customers' };
  const customers = (await convertToJson(csvContent.Body.toString())).map(
    Item => ({ ...createCustomerRequest, Item }),
  );

  await saveToDynamo(customers);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'ok',
    }),
  };
};

module.exports = {
  convertToJson,
  saveCustomers,
};
