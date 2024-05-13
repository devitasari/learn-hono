import { DeleteItemCommand, DynamoDBClient, PutItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
const dynamoDBClient = new DynamoDBClient({ region: 'ap-southeast-1' });
const { v4: uuidv4 } = require('uuid');

type Context = {
    json: (data: any) => any,
    req: {
        parseBody: Function,
        json: Function,
        param: Function
    }
}

export const Controller = {
    read: async (c: Context) => {
        const params = {
            TableName: 'AccountDeletion-ejrnbtfbs5g5nf6jhlxwi4s6pq-NONE'
        };
        
        try {
            const data = await dynamoDBClient.send(new ScanCommand(params));
            const formattedData = data.Items?.map(e => {
                return {
                    id: e.id.S,
                    updatedAt: e.updatedAt.S,
                    createdAt: e.createdAt.S,
                    username: e.username.S,
                    email: e.email.S,
                    reason: e.reason.S
                }
            })
            return c.json({ data: formattedData });
        } catch (error) {
            return c.json({ error })
        }
    },
    create: async (c: Context) => {
        const body = await c.req.json()
        const params = {
            TableName: 'AccountDeletion-ejrnbtfbs5g5nf6jhlxwi4s6pq-NONE',
            Item: {
                id: {
                    S: uuidv4()
                },
                username: {
                    S: body.username
                },
                email: {
                    S: body.email
                },
                reason: {
                    S: body.reason
                },
                updatedAt: {
                    S: new Date().toISOString()
                },
                createdAt: {
                    S: new Date().toISOString()
                }
            }
        };
        
        try {
            const data = await dynamoDBClient.send(new PutItemCommand(params));
            return c.json({ data });
        } catch (error) {
            return c.json({ error })
        }
    },
    update: async (c: Context) => {
        const body = await c.req.json()
        const id = c.req.param('id')
        const params = {
            TableName: 'AccountDeletion-ejrnbtfbs5g5nf6jhlxwi4s6pq-NONE',
            Key: {
                id: {
                    S: id
                }
            },
            UpdateExpression: 'SET #username = :username, #email = :email, #reason = :reason, #updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#username': 'username',
                '#email': 'email',
                '#reason': 'reason',
                '#updatedAt': 'updatedAt'
            },
            ExpressionAttributeValues: {
                ':username': { S: body.username },
                ':email': { S: body.email },
                ':reason': { S: body.reason },
                ':updatedAt': { S: new Date().toISOString() }
            }
        }

        try {
            const data = await dynamoDBClient.send(new UpdateItemCommand(params));
            return c.json({ data });
        } catch (error) {
            return c.json({ error })
        }
    },
    delete: async (c: Context) => {
        const id = c.req.param('id')
        const params = {
            TableName: 'AccountDeletion-ejrnbtfbs5g5nf6jhlxwi4s6pq-NONE',
            Key: {
                id: {
                    S: id
                }
            }
        }
        try {
            const data = await dynamoDBClient.send(new DeleteItemCommand(params));
            return c.json({ data });
        } catch (error) {
            return c.json({ error })
        }
    }
}