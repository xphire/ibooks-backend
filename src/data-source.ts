import "reflect-metadata"
import { DataSource } from "typeorm"
import config from 'config'
import { User } from "./modules/User/user.model"
import { Hotel } from "./modules/Hotel/hotel.model"
import { Booking } from "./modules/Booking/booking.model"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.get("database_host"),
    port: config.get("database_port"),
    username: config.get("database_user"),
    password: config.get("database_password") ,
    database: config.get("database_name"),
    entities: [User,Hotel,Booking],
    synchronize: true,
    logging: false,
})