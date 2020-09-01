import { MongoClient } from 'mongodb';
import { config } from '../config';

export const databaseProviderName = 'mongodb';

export const databaseProvider = {
    provide: databaseProviderName,
    useFactory: async () =>
        new Promise((resolve, reject) => {
            MongoClient.connect(
                `mongodb://${config.MONGODB_ROOT_USER}:${config.MONGODB_ROOT_PASSWORD}@${config.MONGODB_SERVER_ADDRESS}:${config.MONGODB_SERVER_PORT}`,
                { useUnifiedTopology: true },
                (error: any, client) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(client.db('bromuro'));
                    }
                }
            );
        })
};
