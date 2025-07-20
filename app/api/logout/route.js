import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ message: "Logout สำเร็จ" }, { status: 200 });
}