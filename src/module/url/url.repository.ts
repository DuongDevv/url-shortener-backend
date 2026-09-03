import pool from '../../config/database.js';

export interface UrlEntity {
    id: string;
    user_id: string;
    short_key: string;
    long_url: string;
    is_custom: boolean;
    is_active: boolean;
    expires_at?: Date;
    created_at: Date;
}

export class UrlRepository {
    // Insert ban ghi moi voi short_key tam thoi
    async create(longUrl: string, customAlias?:string, userId?: string, expiresAt?: Date): Promise<UrlEntity> {
        const client = await pool.connect();
        try{
            const query = `
                insert into urls (long_url, short_key, user_id, is_custom, expires_at)
                values ($1, $2, $3, $4, $5)
                returning *;
                `;
                const shortKey = customAlias || `t_${Date.now().toString(36)}`; // Tao short_key tam thoi neu khong co customAlias
                const isCustom = !!customAlias;

                const result = await client.query(query, [longUrl, shortKey, userId || null, isCustom, expiresAt || null]);
                return result.rows[0];
        }finally{
            client.release(); //Bat buoc: tra client ve pool de tranh leak memory
        }
    }

    // Cap nhat short_key chuan sau khi Encode Base62 tu ID
    async updateShortKey(id: string, short_key: string): Promise<void>{
        const client = await pool.connect();
        try{
            await client.query('UPDATE urls SET short_key = $1 WHERE id = $2', [short_key, id]);
        }finally{
            client.release();
        }
    }

    // Tim URL theo short_key (Dung cho Redirect Engine)
    async findByShortKey(shortKey: string): Promise<UrlEntity | null> {
        const client = await pool.connect();
        try{
            const result = await client.query('SELECT * FROM urls WHERE short_key = $1 AND is_active = TRUE', [shortKey]);
            return result.rows[0] || null;
        }finally{
            client.release();
        }
    }
}
