declare interface Project {
  id: string
  user_id: string
  name: string
  created_at: string
}

declare interface Timer {
  id: string
  user_id: string
  project_id: string
  start_at: string
  end_at: string
  created_at: string
}
