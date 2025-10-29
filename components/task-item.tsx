"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
}

interface TaskItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border border-white/20 
      shadow-md bg-gradient-to-r from-pink-300/20 via-purple-300/20 to-indigo-300/20 
      backdrop-blur-sm hover:from-pink-400/30 hover:to-indigo-400/30 transition-all`}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id, task.completed)}
        className="mt-1 border-white/40 data-[state=checked]:bg-gradient-to-r from-green-400 to-emerald-500"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-base ${
            task.completed ? "line-through text-gray-300" : "text-white"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-gray-200 mt-1">{task.description}</p>
        )}
        <p className="text-xs text-gray-300 mt-2">
          {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(task.id)}
        className="text-red-300 hover:text-red-500 hover:bg-red-500/10 rounded-md"
      >
        Delete
      </Button>
    </div>
  )
}
