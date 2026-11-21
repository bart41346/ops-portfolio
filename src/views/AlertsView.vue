<script setup>
import { computed, ref } from 'vue'
import { AlertTriangle, Bell, Check, CircleAlert, Plus, RefreshCw } from 'lucide-vue-next'
import { alerts, alertsError, alertsLoading, apiStatus, createAlert, pendingAlerts, refreshAlerts, resolveAlert } from '../composables/useAlerts'

const showForm = ref(false)
const submitting = ref(false)
const actionError = ref('')
const busyId = ref('')
const filter = ref('ALL')
const form = ref({ severity: 'WARNING', title: '', resource: '' })
const visibleAlerts = computed(() => filter.value === 'ALL' ? alerts.value : filter.value === 'OPEN' ? pendingAlerts.value : alerts.value.filter((alert) => alert.status === 'RESOLVED'))
function formattedDate(date) { return date ? new Date(date).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }) : '—' }
async function submitAlert() {
  submitting.value = true
  actionError.value = ''
  try {
    await createAlert(form.value)
    form.value = { severity: 'WARNING', title: '', resource: '' }
    showForm.value = false
  } catch (error) { actionError.value = error.message }
  finally { submitting.value = false }
}
async function markResolved(alert) {
  busyId.value = alert.id
  actionError.value = ''
  try { await resolveAlert(alert.id) }
  catch (error) { actionError.value = error.message }
  finally { busyId.value = '' }
}
</script>

<template>
  <section class="content">
    <div class="heading"><div><div class="eyebrow"><Bell :size="14" />事件响应 <span class="status-chip" :class="apiStatus === 'online' ? 'green' : 'amber'"><i></i>{{ apiStatus === 'online' ? 'API 已连接' : apiStatus === 'offline' ? 'API 离线' : '连接中' }}</span></div><h1>告警中心</h1><p>告警记录来自 Spring Boot API。创建和恢复操作会写入 API 后端。</p></div><div class="heading-actions"><button class="button secondary" :disabled="alertsLoading" @click="refreshAlerts"><RefreshCw :size="15" />刷新</button><button class="button primary" @click="showForm = !showForm"><Plus :size="16" />新建测试告警</button></div></div>
    <div class="notice-bar"><AlertTriangle :size="16" /><span>此 API 目前是公开演示接口，请只写入虚构告警信息。不要输入客户、主机或生产环境敏感信息。</span></div>
    <div class="metrics metrics-three"><article class="metric"><div class="metric-label">全部记录</div><div class="metric-value">{{ alerts.length }}<span class="sub-value"> 条</span></div><div class="metric-foot"><span>API 返回的最近记录</span></div></article><article class="metric"><div class="metric-label">待处理</div><div class="metric-value">{{ pendingAlerts.length }}<span class="sub-value"> 条</span></div><div class="metric-foot"><span>状态为 OPEN</span></div></article><article class="metric"><div class="metric-label">已恢复</div><div class="metric-value">{{ alerts.length - pendingAlerts.length }}<span class="sub-value"> 条</span></div><div class="metric-foot"><span>状态为 RESOLVED</span></div></article></div>
    <section v-if="showForm" class="panel form-panel"><div class="panel-head"><div><h2>创建测试告警</h2><p>提交后会调用 `POST /api/alerts`</p></div><button class="text-link" @click="showForm = false">取消</button></div><form class="alert-form" @submit.prevent="submitAlert"><label>严重级别<select v-model="form.severity"><option value="INFO">提示</option><option value="WARNING">警告</option><option value="CRITICAL">严重</option></select></label><label>告警标题<input v-model.trim="form.title" maxlength="120" required placeholder="例如：磁盘使用率超过阈值" /></label><label>资源标识<input v-model.trim="form.resource" maxlength="120" required placeholder="例如：demo-node-01" /></label><div class="form-actions"><p v-if="actionError" class="error-text">{{ actionError }}</p><button class="button primary" :disabled="submitting">{{ submitting ? '提交中…' : '提交告警' }}</button></div></form></section>
    <p v-if="actionError && !showForm" class="error-banner">{{ actionError }}</p>
    <section class="panel alert-table-panel"><div class="panel-head"><div><h2>告警记录</h2><p>{{ alertsLoading ? '正在读取 API…' : `${visibleAlerts.length} 条记录` }}</p></div><div class="filter-tabs"><button v-for="item in [{ key: 'ALL', label: '全部' }, { key: 'OPEN', label: '待处理' }, { key: 'RESOLVED', label: '已恢复' }]" :key="item.key" :class="{ active: filter === item.key }" @click="filter = item.key">{{ item.label }}</button></div></div>
      <div v-if="alertsError" class="error-banner"><CircleAlert :size="16" />{{ alertsError }} <button class="text-link" @click="refreshAlerts">重试</button></div>
      <div v-else-if="alertsLoading && !alerts.length" class="empty-state">正在连接告警 API…</div>
      <div v-else-if="!visibleAlerts.length" class="empty-state"><Check :size="20" /><strong>{{ filter === 'OPEN' ? '当前没有待处理告警' : '暂无告警记录' }}</strong><span>可创建一条测试告警，验证前后端数据流。</span></div>
      <div v-else class="alert-record-list"><article v-for="alert in visibleAlerts" :key="alert.id" class="alert-record"><span class="record-severity" :class="alert.severity.toLowerCase()"><AlertTriangle :size="17" /></span><div class="record-main"><strong>{{ alert.title }}</strong><div><code>{{ alert.resource }}</code><span>{{ alert.severity }}</span><span>·</span><time>{{ formattedDate(alert.createdAt) }}</time></div></div><span class="record-status" :class="alert.status === 'RESOLVED' ? 'resolved' : 'open'">{{ alert.status === 'RESOLVED' ? '已恢复' : '待处理' }}</span><button v-if="alert.status !== 'RESOLVED'" class="button secondary compact" :disabled="busyId === alert.id" @click="markResolved(alert)">{{ busyId === alert.id ? '处理中…' : '标记恢复' }}</button></article></div>
    </section>
  </section>
</template>
