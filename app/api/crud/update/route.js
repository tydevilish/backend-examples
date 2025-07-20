import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function PATCH(req) {
    try {
        const {
            id,
            title,
            firstName,
            lastName,
            address,
            gender,
            birthdate,
            password,
        } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "กรุณาระบุ id ผู้ใช้" }, { status: 400 });
        }

        let hashedPassword = null;
        if (password) {
            if (password.length < 8) {
                return NextResponse.json({ message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" }, { status: 400 });
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updateQuery = `
      UPDATE users SET
        title = COALESCE($1, title),
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        address = COALESCE($4, address),
        gender = COALESCE($5, gender),
        birthdate = COALESCE($6, birthdate),
        password = COALESCE($7, password)
      WHERE id = $8
      RETURNING id, username, title, first_name, last_name, address, gender, birthdate
    `;

        const values = [
            title || null,
            firstName || null,
            lastName || null,
            address || null,
            gender || null,
            birthdate || null,
            hashedPassword,
            id,
        ];

        const result = await pool.query(updateQuery, values);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 404 });
        }

        return NextResponse.json({ message: "อัปเดตข้อมูลสำเร็จ", user: result.rows[0] }, { status: 200 });

    } catch (err) {
        console.error("Update error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
