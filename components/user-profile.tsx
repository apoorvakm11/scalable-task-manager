"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  id: string
  name: string
  email: string
}

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 border-none shadow-xl rounded-2xl text-gray-900">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-900">Profile</CardTitle>
        <CardDescription className="text-gray-800 font-medium">Your account information</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 bg-white/60 p-4 rounded-xl shadow-inner">
        <div>
          <p className="text-sm text-gray-700 font-medium">Name</p>
          <p className="font-semibold text-gray-900">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-700 font-medium">Email</p>
          <p className="font-semibold text-gray-900">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-700 font-medium">User ID</p>
          <p className="font-mono text-xs text-gray-800">{user.id}</p>
        </div>
      </CardContent>
    </Card>
  )
}
