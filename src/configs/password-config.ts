import envConfig from "./env-config";

const JWT_SALT = envConfig.getEnv('JWT_SALT');

export default {
    salt: JWT_SALT,
    iterations: 1000,
    keylen: 64,
    digest: 'sha512',
}