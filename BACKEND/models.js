import bcrypt from 'bcryptjs';
import { pool } from "./config/db";
export class User {
    id;
    firstname;
    lastname;
    mail;
    telNr;
    profile_pic;
    password;
    constructor(data) {
        this.id = data.id;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.mail = data.mail;
        this.telNr = data.telNr;
        this.profile_pic = data.profile_pic;
        this.password = data.password;
    }
    async save() {
        try {
            if (this.id)
                throw new Error('User already exists. Use update() instead.');
            const hashed = await bcrypt.hash(this.password, 10);
            const sql = `INSERT INTO user_profiles (firstname, lastname, password, email, telNr, profile_pic)
                     VALUES  ($1, $2, $3, $4, $5, $6) returning id`;
            const values = [this.firstname, this.lastname, hashed, this.mail, this.telNr || null, this.profile_pic || null];
            console.log(values);
            const result = await pool.query(sql, values);
            this.id = result.rows[0].id;
            this.password = hashed;
        }
        catch (error) {
            console.error("Error saving user: ", error);
            throw new Error(`Error saving user: ${error.message}`);
        }
    }
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM user_profiles WHERE id = ?', [id]);
        if (rows.length === 0)
            return null;
        return new User(rows[0]);
    }
    static async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM user_profiles WHERE mail = ?', [email]);
        if (rows.length === 0)
            return null;
        return new User(rows[0]);
    }
    async delete() {
        if (!this.id)
            throw new Error('Cannot delete user without ID.');
        await pool.query('DELETE FROM user_profiles WHERE id=?', [this.id]);
    }
    async setProfilePicture(pictureInBinary) {
    }
    async getPasswordHashById(userId) {
        const query = 'select password from user_profiles where id=?';
        return await pool.query(query, [userId]);
    }
    async verifyPassword(candidate) {
        return bcrypt.compare(candidate, this.password);
    }
    static async updatePasswordById(id, newHashedPassword) {
        await pool.query('UPDATE user_profiles SET password = ? WHERE id = ?', [newHashedPassword, id]);
    }
    async updateProfile(partialProps) {
        if (!this.id)
            throw new Error('Cannot update profile without ID.');
        // Merge provided properties
        if (partialProps.firstname !== undefined)
            this.firstname = partialProps.firstname;
        if (partialProps.lastname !== undefined)
            this.lastname = partialProps.lastname;
        if (partialProps.mail !== undefined)
            this.mail = partialProps.mail;
        if (partialProps.telNr !== undefined)
            this.telNr = partialProps.telNr;
        if (partialProps.profile_pic !== undefined)
            this.profile_pic = partialProps.profile_pic;
        // Persist changes
        await this.update();
    }
    async update() {
        if (!this.id)
            throw new Error('Cannot update user without ID.');
        const sql = `UPDATE user_profiles
                     SET firstname = ?,
                         lastname = ?,
                         mail = ?,
                         telNr = ?,
                         profile_pic = ?
                     WHERE id = ?`;
        const values = [this.firstname, this.lastname, this.mail, this.telNr, this.profile_pic || null, this.id];
        await pool.query(sql, values);
    }
    toJSON() {
        const { password, ...rest } = this;
        return rest;
    }
}
