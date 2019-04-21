const AWS = require('aws-sdk');
const moment = require('moment');
const csv = require('csvtojson');

const toDate = item => moment(item, 'DD_MM_YYYY').format('DD/MM/YYYY');
const toBoolean = item => item === 'SI';

const convertToJson = async csvContent => csv({
  delimiter: ';',
  colParser: {
    BirthDate: toDate,
    Active: toBoolean,
    New: toBoolean,
    RaiFee: toBoolean,
  },
  headers: [
    'CustomerId', // ID_UTENTE
    'CustomerCode', // CODICE_CLIENTE
    'Email', // EMAIL
    'FirstName', // NOME
    'LastName', // COGNOME
    'BirthDate', // DATA_NASCITA
    'FiscalCode', // CODICE_FISCALE
    'Status', // STATO
    'Active', // ATTIVO
    'New', // NUOVO
    'Network', // RETE
    'Agent', // AGENTE
    'RaiFee', // CANONE_RAI
  ],
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
