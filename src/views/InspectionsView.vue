<script setup>
import { computed, ref, watch } from 'vue'
import { Check, ClipboardCheck, RotateCcw } from 'lucide-vue-next'

const storageKey = 'opspilot-inspection-demo-v1'
const items = ref([
  { id: 'load', label: '服务器负载与磁盘空间', detail: '检查 CPU 负载、磁盘使用率和 inode' },
  { id: 'database', label: '数据库连接与备份状态', detail: '核对连接可用性和最近一次备份结果' },
  { id: 'cert', label: 'TLS 证书到期时间', detail: '检查证书有效期，并确认自动续期状态' },
  { id: 'patch', label: '安全补丁与登录审计', detail: '复核待安装补丁和异常登录事件' },
  { id: 'alert', label: '未恢复告警与交接记录', detail: '确认告警负责人、处置进度和交接信息' },
])
function readState() {
  try { return JSON.parse(localStorage.getItem(storageKey) || '{}') } catch { return {} }
}
const completed = ref(readState())
const doneCount = computed(() => items.value.filter((item) => completed.value[item.id]).length)
const progress = computed(() => Math.round((doneCount.value / items.value.length) * 100))
watch(completed, (value) => localStorage.setItem(storageKey, JSON.stringify(value)), { deep: true })
function reset() { completed.value = {} }
</script>

<template>
  <section class="content">
    <div class="heading"><div><div class="eyebrow"><ClipboardCheck :size="14" />日常运维 <span class="demo-tag">浏览器本地记录</span></div><h1>巡检任务</h1><p>勾选项会保存在当前浏览器，用于演示巡检闭环，不会写入后端。</p></div><button class="button secondary" @click="reset"><RotateCcw :size="15" />重置清单</button></div>
    <section class="panel inspection-board"><div class="inspection-summary"><div><span>今日演示巡检</span><strong>{{ doneCount }} / {{ items.length }}</strong></div><div class="inspection-progress"><b>{{ progress }}%</b><div class="progress-track"><i :style="{ width: `${progress}%` }"></i></div></div></div><div class="inspection-list"><label v-for="item in items" :key="item.id" class="inspection-item" :class="{ complete: completed[item.id] }"><input v-model="completed[item.id]" type="checkbox" /><span class="check-visual"><Check :size="13" /></span><span class="inspection-copy"><strong>{{ item.label }}</strong><small>{{ item.detail }}</small></span><em>{{ completed[item.id] ? '已完成' : '待检查' }}</em></label></div><div class="inspection-note"><b>运维记录建议</b><span>真实巡检通常还需要执行人、时间、证据链接、异常描述和复核人。本演示页没有上传或保存这些生产信息。</span></div></section>
  </section>
</template>
