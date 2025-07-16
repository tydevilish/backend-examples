import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
        return NextResponse.json({
            users: result.rows
        }, { status: 200 });
    } catch (error) {
        console.error("Read error:", error);
        return NextResponse.json({
            message: "เกิดข้อผิดพลาด",
            error: error.message
        }, { status: 500 });
    }
}
