// ============================
// 📌 TIPAGENS
// ============================

export interface KPIData {
  totalDeposits: number
  cpas: number
  ftds: number
  revShare: number
  estimatedCommission: number
  depositChange: number
  registros?: number
  cliques?: number
}

export interface DailyDeposit {
  date: string
  amount: number
  ftd?: number
  cpa?: number
  rev?: number
}

export interface ReferredUser {
  id: string
  username: string
  email: string
  joinDate: string
  depositAmount: number
  status: 'CPA' | 'FTD' | 'Active' | 'Inactive'
  lastActivity: string
}

export interface AffiliateData {
  kpis?: KPIData
  dailyDeposits: DailyDeposit[]
  referredUsers: ReferredUser[]
}

// ============================
// 📌 FUNÇÃO DE FILTRAGEM
// ============================

export function getFilteredData(
  data: AffiliateData,
  dateRange: 'week' | 'month' | 'custom',
  customStart?: Date,
  customEnd?: Date
): AffiliateData {
  const now = new Date()
  let startDate: Date

  switch (dateRange) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case 'custom':
      startDate = customStart || new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  const endDate = customEnd || now

  const filteredDeposits = data.dailyDeposits.filter(deposit => {
    const depositDate = new Date(deposit.date)
    return depositDate >= startDate && depositDate <= endDate
  })

  const filteredUsers = data.referredUsers.filter(user => {
    const userDate = new Date(user.joinDate)
    return userDate >= startDate && userDate <= endDate
  })

  return {
    kpis: data.kpis!,
    dailyDeposits: filteredDeposits,
    referredUsers: filteredUsers
  }
}

// ============================
// ✅ MOCK DE DADOS
// ============================

import { format } from 'date-fns'

// Mock de depósitos de junho + julho
const depositsByDay = [
  1230, 910, 880, 1020, 740, 520, 1400,
  970, 820, 1180, 760, 945, 610, 1330,
  1270, 990, 660, 1434,
  4980.23, 5320.18, 5406.15, 4100.50, 3700.00, 2895.25, 2800.00, 2400.00, 1646.01,
  1033.15, 1337.40, 596.30, 803.12,
  // julho
  440, 3454
]

// Geração dos dados mockados
export const mockAffiliateData: AffiliateData = {
  kpis: {
    totalDeposits: 60379.97,
    cpas: 0,
    ftds: 610,
    revShare: 0,
    estimatedCommission: 0,
    depositChange: 68.7,
    registros: 1096,
    cliques: 5680
  },

  dailyDeposits: [
    ...depositsByDay.map((amount, index) => {
      const date = index < 30
        ? format(new Date(2025, 5, index + 1), 'yyyy-MM-dd')  // Junho
        : format(new Date(2025, 6, index - 29), 'yyyy-MM-dd') // Julho

      const ftd = Math.random() < 0.2 ? 1 : 0
      const cpa = Math.random() < 0.1 ? 1 : 0
      const rev = Math.random() < 0.15 ? 0.2 : 0

      return { date, amount, ftd, cpa, rev }
    })
  ],

  referredUsers: []
}
