import bcrypt from 'bcryptjs';
import {pool} from "./config/db";

export class User {
    static async create(firstname: string, lastname: string, password: string, mail: string, telNr: string, profile_pic: string) {
        //pw hashen
        const hashedPassword = await bcrypt.hash(password, 10)

        const query = 'insert into user_profiles (fistname,lastname,password,mail,telNr,profile_pic)' +
            'values (?,?,?)';
        const values = [firstname, lastname, hashedPassword, mail, telNr, profile_pic]

        return await pool.query(query, values)
    }

    static async findByPk(pk:number){
        const query= 'select * from user_profiles where id=?';
        return await pool.query(query,[pk]);
    }

    static async findByEmail(email:string){
        const query = 'select mail from user_profiles where email= ?';
      return await pool.query(query,[email]);
    }

    static async deleteById(userId: number){
        const query = 'delete from user_profiles where id=?';
        return await  pool.query(query,[userId]);
    }

    static async getPasswordHashById(userId:number){
        const query = 'select password from user_profiles where id=?';
        return await  pool.query(query,[userId]);
    }
    static async verifyPassword(storedHash:string,password:string){
        return  bcrypt.compare(password,storedHash);
    }

    static async updatePasswordById(userId:number,hashedPassword:string){
        const query = 'update user_profiles set password =? where id = ?';
        return await  pool.query(query,[hashedPassword,userId]);
    }
}