import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

interface TokenPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

export function generateToken(userId: string, email: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")
  const now = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      email,
      iat: now,
      exp: now + 24 * 60 * 60, // 24 hours
    }),
  ).toString("base64url")

  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64url")

  return `${header}.${payload}.${signature}`
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const [header, payload, signature] = token.split(".")
    const expectedSignature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${payload}`).digest("base64url")

    if (signature !== expectedSignature) {
      return null
    }

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString())
    const now = Math.floor(Date.now() / 1000)

    if (decoded.exp < now) {
      return null
    }

    return decoded
  } catch (err) {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(":")
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return testHash === hash
}
