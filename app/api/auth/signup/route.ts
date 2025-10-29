import { generateToken, hashPassword } from "@/lib/auth"
import { createUser, userExists } from "@/lib/user-store"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (userExists(email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const userId = crypto.randomUUID()
    const hashedPassword = await hashPassword(password)

    createUser(email, {
      id: userId,
      name,
      email,
      password: hashedPassword,
    })

    const token = generateToken(userId, email)

    const response = NextResponse.json({ success: true })
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
