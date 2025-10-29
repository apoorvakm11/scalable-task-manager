// Shared task storage across all API routes
const taskStore: Map<string, any[]> = new Map()

export function getUserTasks(userId: string) {
  return taskStore.get(userId) || []
}

export function addTask(userId: string, task: any) {
  const userTasks = taskStore.get(userId) || []
  userTasks.push(task)
  taskStore.set(userId, userTasks)
  return task
}

export function updateTask(userId: string, taskId: string, updates: any) {
  const userTasks = taskStore.get(userId) || []
  const taskIndex = userTasks.findIndex((t) => t.id === taskId)

  if (taskIndex === -1) return null

  userTasks[taskIndex] = { ...userTasks[taskIndex], ...updates }
  taskStore.set(userId, userTasks)
  return userTasks[taskIndex]
}

export function deleteTask(userId: string, taskId: string) {
  const userTasks = taskStore.get(userId) || []
  const filteredTasks = userTasks.filter((t) => t.id !== taskId)

  if (filteredTasks.length === userTasks.length) return false

  taskStore.set(userId, filteredTasks)
  return true
}
