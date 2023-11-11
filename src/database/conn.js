import mongoose from "mongoose";
import { config } from 'dotenv';

// Carregando os dados do .env
config();

const URI = process.env.MONGODB_CONNECT_URI;

export default async function main() {

    try {

        await mongoose.connect(URI);

        return true;

    } catch(err) {

        return err;
    }
}