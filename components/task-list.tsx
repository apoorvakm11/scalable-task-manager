"use client"

import { TaskItem } from "@/components/task-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"
import { useEffect, useState } from "react"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data.tasks)
    } catch {
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
      if (!response.ok) throw new Error("Failed to create task")
      const data = await response.json()
      setTasks([data.task, ...tasks])
      setTitle("")
      setDescription("")
    } catch {
      setError("Failed to create task")
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete task")
      setTasks(tasks.filter((t) => t.id !== id))
    } catch {
      setError("Failed to delete task")
    }
  }

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      })
      if (!response.ok) throw new Error("Failed to update task")
      const data = await response.json()
      setTasks(tasks.map((t) => (t.id === id ? data.task : t)))
    } catch {
      setError("Failed to update task")
    }
  }

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed
      if (filter === "completed") return task.completed
      return true
    })
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  return (
    <div className="space-y-6 text-white">
      {/* Create Task */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-yellow-300">Create Task</CardTitle>
          <CardDescription className="text-gray-200">Add a new task to your list</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/20 text-white placeholder-gray-300 border-white/30 focus:border-yellow-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Input
                id="description"
                placeholder="Task description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/20 text-white placeholder-gray-300 border-white/30 focus:border-yellow-300"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-white font-semibold">
              Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-yellow-300">Tasks</CardTitle>
          <CardDescription className="text-gray-200">Manage your tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-white">Search</Label>
            <Input
              id="search"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/20 text-white placeholder-gray-300 border-white/30 focus:border-yellow-300"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {["all", "active", "completed"].map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(type as any)}
                className={`rounded-lg font-medium ${
                  filter === type
                    ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>

          {error && <div className="text-sm text-red-300">{error}</div>}

          {loading ? (
            <p className="text-gray-300">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-gray-300">No tasks found</p>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
