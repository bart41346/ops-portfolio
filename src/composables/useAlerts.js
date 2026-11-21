import { computed, ref } from 'vue'

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
export const apiUrl = (path) => `${API_BASE}${path}`
export const alerts = ref([])
export const alertsLoading = ref(false)
export const alertsError = ref('')
export const apiStatus = ref('connecting')
export const pendingAlerts = computed(() => alerts.value.filter((alert) => alert.status !== 'RESOLVED'))

export async function refreshAlerts() {
  alertsLoading.value = true
  try {
    const response = await fetch(apiUrl('/api/alerts'), { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`API 返回 ${response.status}`)
    const result = await response.json()
    if (!Array.isArray(result)) throw new Error('告警接口返回格式异常')
    alerts.value = result
    alertsError.value = ''
    apiStatus.value = 'online'
    return true
  } catch (error) {
    alertsError.value = error.message || '无法连接告警 API'
    apiStatus.value = 'offline'
    return false
  } finally {
    alertsLoading.value = false
  }
}

export async function createAlert(payload) {
  const response = await fetch(apiUrl('/api/alerts'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`创建失败：API 返回 ${response.status}`)
  await refreshAlerts()
}

export async function resolveAlert(id) {
  const response = await fetch(apiUrl(`/api/alerts/${encodeURIComponent(id)}/resolve`), { method: 'PATCH' })
  if (!response.ok) throw new Error(`恢复失败：API 返回 ${response.status}`)
  await refreshAlerts()
}
