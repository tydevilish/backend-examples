import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({
                message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน"
            }, { status: 400 });
        }

        const userResult = await pool.query(
            "SELECT id, username, password FROM users WHERE username = $1",
            [username]
        );

        if (userResult.rowCount === 0) {
            return NextResponse.json({
                message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
            }, { status: 401 });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({
                message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
            }, { status: 401 });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            token,
            username: user.username
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์"
        }, { status: 500 });
    }
}
