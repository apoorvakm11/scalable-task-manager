// In-memory user storage (replace with database in production)
const users: Map<string, any> = new Map()

export function getUsers() {
  return users
}

export function getUserByEmail(email: string) {
  return users.get(email)
}

export function getUserById(id: string) {
  return Array.from(users.values()).find((u) => u.id === id)
}

export function createUser(email: string, userData: any) {
  users.set(email, userData)
}

export function userExists(email: string) {
  return users.has(email)
}
