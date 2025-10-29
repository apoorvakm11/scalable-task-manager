"use client"

import { TaskList } from "@/components/task-list"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/components/user-profile"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }
        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        setError("Failed to load user data")
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (err) {
      setError("Logout failed")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
        <p className="text-white text-lg font-semibold">Loading your dashboard...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
            Task Manager ✨
          </h1>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl shadow-md backdrop-blur-sm"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task List */}
          <div className="lg:col-span-2">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-100">Your Tasks</h2>
              <TaskList />
            </div>
          </div>

          {/* User Profile */}
          <div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-100">Profile</h2>
              <UserProfile user={user} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
