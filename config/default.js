require('dotenv').config();

module.exports = {
    port : 9000,
    sentry_dsn : process.env["SENTRY_DSN"],
    database_uri : process.env["DATABASE_URI"],
    database_type : process.env["DATABASE_TYPE"],
    database_host : process.env["DATABASE_HOST"],
    database_port : process.env["DATABASE_PORT"],
    database_user: process.env["DATABASE_USER"],
    database_password: process.env["DATABASE_PASSWORD"],
    database_name: process.env["DATABASE_NAME"],
    cookie_secret: process.env["COOKIE_SECRET"],
    frontend_url : process.env["FRONTEND_URL"]
}