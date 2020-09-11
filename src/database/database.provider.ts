import { ConnectionOptions, createConnection, Connection } from 'typeorm';
import { config } from '../config';
import { databaseProviderName } from '../constants';
import { Joke } from '../jokes/joke.entity';

const mysqlConnectionOptions: ConnectionOptions = {
    type: 'mysql',
    username: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: 'bromuro',
    entities: [Joke],
    synchronize: true,
    host: config.CLOUD_SQL_CONNECTION_NAME === undefined ? config.MYSQL_SERVER_ADDRESS : undefined,
    port: config.CLOUD_SQL_CONNECTION_NAME === undefined ? config.MYSQL_SERVER_PORT : undefined,
    extra: {
        socketPath:
            config.CLOUD_SQL_CONNECTION_NAME === undefined
                ? undefined
                : `${config.DB_SOCKET_PATH}/${config.CLOUD_SQL_CONNECTION_NAME}`
    }
};

export const databaseProvider = {
    provide: databaseProviderName,
    useFactory: () => {
        let connection: Connection;
        return createConnection(mysqlConnectionOptions)
            .then((_connection) => {
                connection = _connection;
                return connection.manager.query('SELECT version();');
            })
            .then((_result) => {
                console.log('Successful database connection');
                return connection;
            })
            .catch((error) => {
                // After creating the mysql docker volume, some privileges issues may occur
                if (error.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
                    console.error(`Database connection error. Try running the following commands as root:
ALTER USER '${config.MYSQL_USER}' IDENTIFIED WITH mysql_native_password BY '${config.MYSQL_PASSWORD}';
FLUSH PRIVILEGES;`);
                }
                throw error;
            });
    }
};
