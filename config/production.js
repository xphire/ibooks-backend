require('dotenv').config();
module.exports = {
    port : 9000,
    sentry_dsn : process.env["SENTRY_DSN"],
}