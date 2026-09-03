import {Pool} from 'pg';
import dotenv from 'dotenv';   

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt (process.env.DB_PORT || '5444', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123123',
    database: process.env.DB_NAME || 'url_shortener_db',
    max: parseInt(process.env.DB_MAX_CLIENTS || '20', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    console.log('[Database]: Connect thành công tới PostgreSQL Pool!');
});

pool.on('error', (err) => {
    console.error('[Database]: Lỗi kết nối PostgreSQL Pool:', err);
});

export const checkDbConnection = async () => {
    try{
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('[Database]: Thời gian hiện tại:', result.rows[0].now);
        client.release();
    }catch(error){
        console.error('[Database Error]: Không thể kết nối tới PostgreSQL!', error);                                                                       
        process.exit(1);
    }
};

export default pool;
checkDbConnection();