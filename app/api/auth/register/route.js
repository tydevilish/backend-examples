import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
    const data = await req.json();
    const {
        username,
        password,
        title,
        firstName,
        lastName,
        address,
        gender,
        birthdate,
    } = data;

    if (
        !username ||
        !password ||
        !title ||
        !firstName ||
        !lastName ||
        !address ||
        !gender ||
        !birthdate
    ) {
        return NextResponse.json(
            { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
            { status: 400 }
        );
    }

    if (password.length < 8) {
        return NextResponse.json(
            { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
            { status: 400 }
        );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
        return NextResponse.json(
            { message: "รูปแบบวันเกิดไม่ถูกต้อง" },
            { status: 400 }
        );
    }

    try {
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE username = $1",
            [username]
        );

        if (existingUser.rowCount > 0) {
            return NextResponse.json({
                message: "ชื่อผู้ใช้นี้มีคนใช้แล้ว"
            }, { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const query = `
      INSERT INTO users (username, password, title, first_name, last_name, address, gender, birthdate)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

        const values = [
            username,
            hashedPassword,
            title,
            firstName,
            lastName,
            address,
            gender,
            birthdate,
        ];

        const result = await pool.query(query, values);
        const userId = result.rows[0].id;

        return NextResponse.json({
            message: "ลงทะเบียนสำเร็จ",
            userId
        }, { status: 200 }
        );
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({
            message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์"
        }, { status: 500 }
        );
    }
}
