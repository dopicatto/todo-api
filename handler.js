const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION }));

const TODOS_TABLE = process.env.TODOS_TABLE;

module.exports.createTodo = async (event) => {
  const { title, metadata } = JSON.parse(event.body);
  const id = uuidv4();
  const params = new PutCommand({
    TableName: TODOS_TABLE,
    Item: {
      id,
      title,
      completed: false,
      metadata,
    },
  });

  await client.send(params);

  return {
    statusCode: 201,
    body: JSON.stringify({ id, title, completed: false, metadata }),
  };
};

module.exports.getTodos = async () => {
  const params = new ScanCommand({
    TableName: TODOS_TABLE,
  });

  const result = await client.send(params);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
};

module.exports.updateTodo = async (event) => {
  const { id } = event.pathParameters;
  const { title, completed, metadata } = JSON.parse(event.body);

  const params = new UpdateCommand({
    TableName: TODOS_TABLE,
    Key: { id },
    UpdateExpression: 'set title = :title, completed = :completed, metadata = :metadata',
    ExpressionAttributeValues: {
      ':title': title,
      ':completed': completed,
      ':metadata': metadata,
    },
    ReturnValues: 'ALL_NEW',
  });

  const result = await client.send(params);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes),
  };
};

module.exports.deleteTodo = async (event) => {
  const { id } = event.pathParameters;

  const getParams = new GetCommand({
    TableName: TODOS_TABLE,
    Key: { id },
  });

  const result = await client.send(getParams);

  if (!result.Item || !result.Item.completed) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Todo must be completed before deletion' }),
    };
  }

  const deleteParams = new DeleteCommand({
    TableName: TODOS_TABLE,
    Key: { id },
  });

  await client.send(deleteParams);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Todo deleted successfully' }),
  };
};
