<script setup>
import { computed, ref } from 'vue'
import { CheckCircle2, CircleAlert, RefreshCw, Settings2, Wifi } from 'lucide-vue-next'
import { API_BASE, apiUrl, apiStatus } from '../composables/useAlerts'

const checking = ref(false)
const result = ref(null)
const endpointLabel = computed(() => API_BASE || '同域 /api（本地开发代理）')
async function checkConnection() {
  checking.value = true
  result.value = null
  try {
    const response = await fetch(apiUrl('/api/health'), { headers: { Accept: 'application/json' } })
    const payload = await response.json()
    if (!response.ok) throw new Error(`健康检查返回 ${response.status}`)
    result.value = { ok: true, payload }
  } catch (error) {
    result.value = { ok: false, message: error.message || '无法访问 API' }
  } finally { checking.value = false }
}
</script>

<template>
  <section class="content">
    <div class="heading"><div><div class="eyebrow"><Settings2 :size="14" />连接与状态</div><h1>设置与连接</h1><p>查看前端 API 配置和服务连通性。密钥只应保存在托管平台环境变量中。</p></div></div>
    <div class="settings-grid">
      <section class="panel settings-card"><div class="settings-card-head"><span class="metric-icon blue"><Wifi :size="17" /></span><div><h2>后端 API</h2><p>告警读写与健康检查</p></div></div><dl class="settings-list"><div><dt>API 地址</dt><dd>{{ endpointLabel }}</dd></div><div><dt>告警状态</dt><dd>{{ apiStatus === 'online' ? '已连接' : apiStatus === 'offline' ? '暂不可用' : '检查中' }}</dd></div><div><dt>前端配置</dt><dd>VITE_API_BASE_URL</dd></div></dl><button class="button secondary" :disabled="checking" @click="checkConnection"><RefreshCw :size="14" />{{ checking ? '检查中…' : '检查 API 连接' }}</button><div v-if="result" class="connection-result" :class="result.ok ? 'ok' : 'failed'"><CheckCircle2 v-if="result.ok" :size="16" /><CircleAlert v-else :size="16" /><span v-if="result.ok">健康检查已响应：{{ JSON.stringify(result.payload) }}</span><span v-else>{{ result.message }}</span></div></section>
      <section class="panel settings-card"><div class="settings-card-head"><span class="metric-icon mint"><Settings2 :size="17" /></span><div><h2>数据来源说明</h2><p>当前已实现与规划中的数据边界</p></div></div><div class="source-list"><div><span class="source-dot live"></span><div><b>告警列表</b><small>从 `/api/alerts` 获取；恢复操作提交到 API。</small></div><em>API</em></div><div><span class="source-dot demo"></span><div><b>资源指标、资产、变更和巡检清单</b><small>当前为演示数据或本机浏览器状态。</small></div><em>演示</em></div><div><span class="source-dot planned"></span><div><b>TiDB Cloud 数据库</b><small>待创建免费集群并配置 Render 环境变量。</small></div><em>待接入</em></div></div><p class="settings-tip">请勿在前端代码、公开仓库或聊天消息中填写数据库密码。数据库连接信息应放在 Render API 的环境变量中。</p></section>
    </div>
  </section>
</template>
