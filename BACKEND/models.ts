import bcrypt from 'bcryptjs';
import {pool} from "./config/db";
import crypto from 'crypto';

// Define the shape of user data from the database
export interface IUserProps {
    id?: number;
    firstname: string;
    lastname: string;
    email: string;
    telnr: string;
    profile_pic?: string;
    password: string;
    is_confirmed?: boolean;
    confirmation_token?: string;
    confirmation_token_expires?: Date;
}

export class User implements IUserProps {
    id?: number;
    firstname: string;
    lastname: string;
    email: string;
    telnr: string;
    profile_pic?: string;
    password: string;
    is_confirmed?: boolean;
    confirmation_token?: string;
    confirmation_token_expires?: Date;

    constructor(data: IUserProps) {
        this.id = data.id;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
        this.telnr = data.telnr;
        this.profile_pic = data.profile_pic;
        this.password = data.password;
        this.is_confirmed = data.is_confirmed;
        this.confirmation_token = data.confirmation_token;
        this.confirmation_token_expires = data.confirmation_token_expires
            ? new Date(data.confirmation_token_expires)
            : undefined
    }

    async save() {
        if (this.id) throw new Error('User already exists. Use update() instead.');
        const hashed = await bcrypt.hash(this.password, 10);

        // Token generieren
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 Stunde

        const sql = `INSERT INTO user_profiles (firstname, lastname, password, email, telNr, profile_pic)
                     VALUES ($1, $2, $3, $4, $5, $6) returning id`;
        const values = [
            this.firstname,
            this.lastname,
            hashed,
            this.email,
            this.telnr,
            this.profile_pic || null,
        ];
        const result: any = await pool.query(sql, values);

        this.id = result.rows[0].id;
        this.password = hashed;
        this.is_confirmed = false;
        this.confirmation_token = token;
        this.confirmation_token_expires = expires;
    }

    static async findById(id: number) {
        console.log(id);
        try {
            const { rows } = await pool.query('SELECT * FROM user_profiles WHERE id = $1', [id]);
            if (rows.length === 0) return null;
            const user = new User(rows[0]);
            console.log("user tel: ",user.telnr);
            return new User(rows[0]);
        } catch (error) {
            console.error('getUser error', error);
            throw error;
        }
    }

    static async findByEmail(email: string) {
        const sql = 'SELECT * FROM user_profiles WHERE email = $1';
        const result = await pool.query(sql, [email]);

        return result.rows[0];
    }

    async delete() {
        if (!this.id) throw new Error('Cannot delete user without ID.');
        await pool.query('DELETE FROM user_profiles WHERE id=$1', [this.id]);
    }

    async getPasswordHashById(userId: number) {
        const query = 'select password from user_profiles where id=$1';
        return await pool.query(query, [userId]);
    }

    async verifyPassword(candidate: string) {
        return bcrypt.compare(candidate, this.password);
    }

    static async updatePasswordById(id: number, newHashedPassword: string): Promise<void> {
        await pool.query('UPDATE user_profiles SET password = $1 WHERE id = $2', [newHashedPassword, id]);
    }

    async updateProfile(partialProps: Partial<Omit<IUserProps, 'id' | 'password'>>): Promise<void> {
        if (!this.id) throw new Error('Cannot update profile without ID.');
        // Merge provided properties
        if (partialProps.firstname !== undefined) this.firstname = partialProps.firstname;
        if (partialProps.lastname !== undefined) this.lastname = partialProps.lastname;
        if (partialProps.email !== undefined) this.email = partialProps.email;
        if (partialProps.telnr !== undefined) this.telnr = partialProps.telnr;
        if (partialProps.profile_pic !== undefined) this.profile_pic = partialProps.profile_pic;
        // Persist changes
        await this.update();
    }

    async update() {
        if (!this.id) throw new Error('Cannot update user without ID.');
        try {

            const sql = `UPDATE user_profiles
                         SET firstname   = $1,
                             lastname    = $2,
                             email       = $3,
                             telNr       = $4,
                             profile_pic = $5
                         WHERE id = $6`;
            const values = [this.firstname, this.lastname, this.email, this.telnr, this.profile_pic || null, this.id];
            await pool.query(sql, values);
        }catch (error){
            console.error("Fehler beim Update:", error);
            throw error;
        }
    }

    static async confirmEmail(token: string): Promise<User | null> {
        const now = new Date();
        const [rows]: any = await pool.query(
            `SELECT * FROM user_profiles WHERE confirmation_token = ? AND confirmation_token_expires > ?`,
            [token, now]
        );

        if (rows.length === 0) return null;

        const user = new User(rows[0]);

        await pool.query(
            `UPDATE user_profiles
         SET is_confirmed = TRUE,
             confirmation_token = NULL,
             confirmation_token_expires = NULL
         WHERE id = ?`,
            [user.id]
        );

        user.is_confirmed = true;
        user.confirmation_token = undefined;
        user.confirmation_token_expires = undefined;
        return user;
    }

     async setProfilePicture( picture:string){
        const sql = 'UPDATE user_profiles SET profile_pic = $1 WHERE id = $2';
        const result = await pool.query(sql, [picture, this.id]);
this.profile_pic = picture;

    }


    toJSON() {
        const {password, ...rest} = this;
        return rest;
    }

    // to Json??????
}