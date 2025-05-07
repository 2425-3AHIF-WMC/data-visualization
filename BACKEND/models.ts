import bcrypt from 'bcryptjs';
import {pool} from "./config/db";
import crypto from 'crypto';

// Define the shape of user data from the database
export interface IUserProps {
    id?: number;
    firstname: string;
    lastname: string;
    mail: string;
    telNr: string;
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
    mail: string;
    telNr: string;
    profile_pic?: string;
    password: string;
    is_confirmed?: boolean;
    confirmation_token?: string;
    confirmation_token_expires?: Date;

    constructor(data: IUserProps) {
        this.id = data.id;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.mail = data.mail;
        this.telNr = data.telNr;
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

        const sql = `INSERT INTO user_profiles (firstname, lastname, password, mail, telNr, profile_pic)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            this.firstname,
            this.lastname,
            hashed,
            this.mail,
            this.telNr,
            this.profile_pic || null,
            false,
            token,
            expires,
        ];
        const [result]: any = await pool.query(sql, values);

        this.id = result.insertId;
        this.password = hashed;
        this.is_confirmed = false;
        this.confirmation_token = token;
        this.confirmation_token_expires = expires;
    }

    static async findById(id: number) {
        const [rows]: any = await pool.query('SELECT * FROM user_profiles WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return new User(rows[0]);
    }

    static async findByEmail(email: string) {
        const [rows]: any = await pool.query('SELECT * FROM user_profiles WHERE mail = ?', [email]);
        if (rows.length === 0) return null;
        return new User(rows[0]);
    }

    async delete() {
        if (!this.id) throw new Error('Cannot delete user without ID.');
        await pool.query('DELETE FROM user_profiles WHERE id=?', [this.id]);
    }

    async getPasswordHashById(userId: number) {
        const query = 'select password from user_profiles where id=?';
        return await pool.query(query, [userId]);
    }

    async verifyPassword(candidate: string) {
        return bcrypt.compare(candidate, this.password);
    }

    static async updatePasswordById(id: number, newHashedPassword: string): Promise<void> {
        await pool.query('UPDATE user_profiles SET password = ? WHERE id = ?', [newHashedPassword, id]);
    }

    async updateProfile(partialProps: Partial<Omit<IUserProps, 'id' | 'password'>>): Promise<void> {
        if (!this.id) throw new Error('Cannot update profile without ID.');
        // Merge provided properties
        if (partialProps.firstname !== undefined) this.firstname = partialProps.firstname;
        if (partialProps.lastname !== undefined) this.lastname = partialProps.lastname;
        if (partialProps.mail !== undefined) this.mail = partialProps.mail;
        if (partialProps.telNr !== undefined) this.telNr = partialProps.telNr;
        if (partialProps.profile_pic !== undefined) this.profile_pic = partialProps.profile_pic;
        // Persist changes
        await this.update();
    }

    async update() {
        if (!this.id) throw new Error('Cannot update user without ID.');
        const sql = `UPDATE user_profiles
                     SET firstname   = ?,
                         lastname    = ?,
                         mail        = ?,
                         telNr       = ?,
                         profile_pic = ?
                     WHERE id = ?`;
        const values = [this.firstname, this.lastname, this.mail, this.telNr, this.profile_pic || null, this.id];
        await pool.query(sql, values);
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


    toJSON() {
        const {password, ...rest} = this;
        return rest;
    }

    // to Json??????
}