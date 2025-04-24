import bcrypt from 'bcryptjs';
import {pool} from "./config/db";

export class User {
    static async create(firstname: string, lastname: string, password: string, mail: string, telNr: string, profile_pic: string) {
        //pw hashen
        const hashedPassword = await bcrypt.hash(password, 10)

        const query = 'insert into user_profiles (fistname,lastname,password,mail,telNr,profile_pic)' +
            'values (?,?,?)';
        const values = [firstname, lastname, hashedPassword, mail, telNr, profile_pic]

        return await pool.query(query, values)[0];
    }

    static async findByEmail(email:string){
        const query = 'select mail from user_profiles where email= ?';
      return await pool.query(query,[email])[0];
    }

    static async verifyPassword(storedHash:string,password:string){
        return  bcrypt.compare(password,storedHash);
    }
}