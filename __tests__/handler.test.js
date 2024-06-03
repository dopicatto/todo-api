const { mockClient } = require('aws-sdk-client-mock');
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  GetCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../handler');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
require('dotenv').config({ path: '.env' });

// Mock UUID generation
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

test('createTodo should create a new todo item', async () => {
  const id = '1234';
  uuidv4.mockReturnValue(id);

  ddbMock.on(PutCommand).resolves({});

  const event = {
    body: JSON.stringify({ title: 'Comprar leche', metadata: { prioridad: 'alta' } }),
  };

  const result = await createTodo(event);

  console.log('Result:', result);
  console.log('Mock Calls:', ddbMock.calls());

  expect(result.statusCode).toBe(201);
  expect(JSON.parse(result.body)).toEqual({
    id,
    title: 'Comprar leche',
    completed: false,
    metadata: { prioridad: 'alta' },
  });

  expect(ddbMock.calls()).toHaveLength(1);
  expect(ddbMock.call(0).args[0].input).toEqual({
    TableName: process.env.TODOS_TABLE,
    Item: {
      id,
      title: 'Comprar leche',
      completed: false,
      metadata: { prioridad: 'alta' },
    },
  });
});

test('getTodos should return a list of todos', async () => {
  ddbMock.on(ScanCommand).resolves({
    Items: [{ id: '1234', title: 'Comprar leche', completed: false, metadata: { prioridad: 'alta' } }],
  });

  const result = await getTodos();

  console.log('Result:', result);
  console.log('Mock Calls:', ddbMock.calls());

  expect(result.statusCode).toBe(200);
  expect(JSON.parse(result.body)).toEqual([
    { id: '1234', title: 'Comprar leche', completed: false, metadata: { prioridad: 'alta' } },
  ]);

  expect(ddbMock.calls()).toHaveLength(1);
  expect(ddbMock.call(0).args[0].input).toEqual({
    TableName: process.env.TODOS_TABLE,
  });
});

test('updateTodo should update an existing todo item', async () => {
  ddbMock.on(UpdateCommand).resolves({
    Attributes: { id: '1234', title: 'Comprar leche y pan', completed: true, metadata: { prioridad: 'alta' } },
  });

  const event = {
    pathParameters: { id: '1234' },
    body: JSON.stringify({ title: 'Comprar leche y pan', completed: true, metadata: { prioridad: 'alta' } }),
  };

  const result = await updateTodo(event);

  console.log('Result:', result);
  console.log('Mock Calls:', ddbMock.calls());

  expect(result.statusCode).toBe(200);
  expect(JSON.parse(result.body)).toEqual({
    id: '1234',
    title: 'Comprar leche y pan',
    completed: true,
    metadata: { prioridad: 'alta' },
  });

  expect(ddbMock.calls()).toHaveLength(1);
  expect(ddbMock.call(0).args[0].input).toEqual({
    TableName: process.env.TODOS_TABLE,
    Key: { id: '1234' },
    UpdateExpression: 'set title = :title, completed = :completed, metadata = :metadata',
    ExpressionAttributeValues: {
      ':title': 'Comprar leche y pan',
      ':completed': true,
      ':metadata': { prioridad: 'alta' },
    },
    ReturnValues: 'ALL_NEW',
  });
});

test('deleteTodo should delete a completed todo item', async () => {
  ddbMock.on(GetCommand).resolves({
    Item: { id: '1234', title: 'Comprar leche', completed: true, metadata: { prioridad: 'alta' } },
  });
  ddbMock.on(DeleteCommand).resolves({});

  const event = {
    pathParameters: { id: '1234' },
  };

  const result = await deleteTodo(event);

  console.log('Result:', result);
  console.log('Mock Calls:', ddbMock.calls());

  expect(result.statusCode).toBe(200);
  expect(JSON.parse(result.body)).toEqual({ message: 'Todo deleted successfully' });

  expect(ddbMock.calls()).toHaveLength(2);
  expect(ddbMock.call(0).args[0].input).toEqual({
    TableName: process.env.TODOS_TABLE,
    Key: { id: '1234' },
  });

  expect(ddbMock.call(1).args[0].input).toEqual({
    TableName: process.env.TODOS_TABLE,
    Key: { id: '1234' },
  });
});

test('deleteTodo should return an error if todo is not completed', async () => {
  ddbMock.on(GetCommand).resolves({
    Item: { id: '1234', title: 'Comprar leche', completed: false, metadata: { prioridad: 'alta' } },
  });

  const event = {
    pathParameters: { id: '1234' },
  };

  const result = await deleteTodo(event);

  console.log('Result:', result);
  console.log('Mock Calls:', ddbMock.calls());

  expect(result.statusCode).toBe(400);
  expect(JSON.parse(result.body)).toEqual({ error: 'Todo must be completed before deletion' });

  expect(ddbMock.calls()).toHaveLength(1);
  expect(ddbMock.call(0).args[0].input).toEqual({
    TableName: process.env.TODOS_TABLE,
    Key: { id: '1234' },
  });
});
