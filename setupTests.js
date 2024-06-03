require('dotenv').config();
const { mockClient } = require('aws-sdk-client-mock');
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  GetCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

module.exports = {
  ddbMock,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  GetCommand,
  DeleteCommand,
};
