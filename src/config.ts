import dotenv from 'dotenv';

dotenv.config();

if (process.env.MYSQL_USER === undefined || process.env.MYSQL_PASSWORD === undefined) {
    throw new Error(
        `The following environment variables must be defined:
        - MYSQL_USER (${process.env.MYSQL_USER})
- MYSQL_PASSWORD (${process.env.MYSQL_PASSWORD})`
    );
}

export const config = {
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_SERVER_ADDRESS: process.env.MYSQL_SERVER_ADDRESS,
    MYSQL_SERVER_PORT:
        (process.env.MYSQL_SERVER_PORT && parseInt(process.env.MYSQL_SERVER_PORT)) || 3306,
    CLOUD_SQL_CONNECTION_NAME: process.env.CLOUD_SQL_CONNECTION_NAME,
    DB_SOCKET_PATH: process.env.CLOUD_SQL_CONNECTION_NAME || '/cloudsql'
};
