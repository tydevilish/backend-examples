import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userResult = await pool.query(
      "SELECT id, username, title, first_name, last_name FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (userResult.rowCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
