import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
    try {
        const {
            username,
            password,
            title,
            firstName,
            lastName,
            address,
            gender,
            birthdate,
        } = await req.json();

        if (
            !username || !password || !title ||
            !firstName || !lastName || !address ||
            !gender || !birthdate
        ) {
            return NextResponse.json({
                message: "กรุณากรอกข้อมูลให้ครบถ้วน"
            }, { status: 400 });
        }

        const insertQuery = `
      INSERT INTO users (username, password, title, first_name, last_name, address, gender, birthdate)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username
    `;

        const values = [
            username,
            password,
            title,
            firstName,
            lastName,
            address,
            gender,
            birthdate
        ];

        const result = await pool.query(insertQuery, values);

        return NextResponse.json({
            message: "เพิ่มผู้ใช้สำเร็จ",
            user: result.rows[0]
        }, { status: 201 });

    } catch (err) {
        console.error("Create error:", err);
        return NextResponse.json({
            message: "เกิดข้อผิดพลาด",
            error: err.message
        }, { status: 500 });
    }
}
