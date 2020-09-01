import dotenv from 'dotenv';

dotenv.config();

if (
    process.env.MONGODB_ROOT_USER === undefined ||
    process.env.MONGODB_ROOT_PASSWORD === undefined ||
    process.env.MONGODB_SERVER_ADDRESS === undefined ||
    process.env.MONGODB_SERVER_PORT === undefined
) {
    throw new Error(
        `The following environment variables must be defined:
- MONGODB_ROOT_PASSWORD (${process.env.MONGODB_ROOT_PASSWORD})
- MONGODB_ROOT_USER (${process.env.MONGODB_ROOT_USER})
- MONGODB_SERVER_ADDRESS (${process.env.MONGODB_SERVER_ADDRESS})
- MONGODB_SERVER_PORT (${process.env.MONGODB_SERVER_PORT})`
    );
}

export const config = {
    MONGODB_ROOT_USER: process.env.MONGODB_ROOT_USER,
    MONGODB_ROOT_PASSWORD: process.env.MONGODB_ROOT_PASSWORD,
    MONGODB_SERVER_ADDRESS: process.env.MONGODB_SERVER_ADDRESS,
    MONGODB_SERVER_PORT: process.env.MONGODB_SERVER_PORT
};
