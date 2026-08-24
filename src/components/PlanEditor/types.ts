export interface PlanRow {
  id: string
  step: number
  description: string
  owner: string
  status: string
}

export interface PlanVersion {
  id: string
  name: string
  timestamp: string
  rows: PlanRow[]
}
