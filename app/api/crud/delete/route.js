import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({
                message: "กรุณาระบุ ID ของผู้ใช้ที่ต้องการลบ"
            }, { status: 400 });
        }

        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return NextResponse.json({
                message: "ไม่พบผู้ใช้ที่ต้องการลบ"
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "ลบผู้ใช้สำเร็จ",
            user: result.rows[0]
        }, { status: 200 });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({
            message: "เกิดข้อผิดพลาด",
            error: error.message
        }, { status: 500 });
    }
}
