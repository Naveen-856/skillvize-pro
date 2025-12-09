import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../database/db.js";


export const signup = async (req, res) => {
    try{
        const {name, gmail, password} = req.body;
        if(!name || !gmail || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const existingUser = db.prepare("SELECT * FROM users WHERE gmail = ?").get(gmail);
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUser = db.prepare("INSERT INTO users (name, gmail, password) VALUES (?, ?, ?)");
        insertUser.run(name, gmail, hashedPassword);
        return res.status(201).json({message: "User created successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}


export const signin = async (req, res) => {
    try{
        const {gmail, password} = req.body;
        if(!gmail || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        const user = db.prepare("SELECT * FROM users WHERE gmail = ?").get(gmail);
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid password"});
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                gmail: user.gmail
            }
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

