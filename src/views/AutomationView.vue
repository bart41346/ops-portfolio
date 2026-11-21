<script setup>
import { ref } from 'vue'
import { Bot, Play, RotateCcw } from 'lucide-vue-next'

const jobs = ref([
  { id: 'disk-report', name: '磁盘空间巡检', description: '汇总演示主机磁盘使用率并标记超过阈值的节点。', schedule: '每天 09:00', status: '待运行', tone: 'blue', lastRun: '尚未运行' },
  { id: 'cert-check', name: 'TLS 证书检查', description: '检查证书到期时间，并提前生成续期提醒。', schedule: '每周一 10:00', status: '待运行', tone: 'blue', lastRun: '尚未运行' },
  { id: 'backup-verify', name: '备份结果核验', description: '检查备份任务状态和最近恢复演练记录。', schedule: '每天 02:30', status: '待运行', tone: 'blue', lastRun: '尚未运行' },
])
function run(job) {
  job.status = '已完成（模拟）'
  job.tone = 'green'
  job.lastRun = new Date().toLocaleString('zh-CN')
}
function reset(job) {
  job.status = '待运行'
  job.tone = 'blue'
  job.lastRun = '尚未运行'
}
</script>

<template>
  <section class="content">
    <div class="heading"><div><div class="eyebrow"><Bot :size="14" />自动化任务 <span class="demo-tag">前端演示</span></div><h1>自动化</h1><p>展示常见运维作业的调度信息和执行状态。按钮不会在服务器执行命令。</p></div><span class="status-chip blue"><i></i>{{ jobs.length }} 个任务模板</span></div>
    <div class="notice-bar"><Bot :size="16" /><span>安全说明：当前任务只改变浏览器中的演示状态。生产自动化需要后端任务队列、权限控制、审计日志和人工审批。</span></div>
    <div class="automation-grid"><article v-for="job in jobs" :key="job.id" class="panel automation-card"><div class="automation-head"><span class="service-icon"><Bot :size="18" /></span><span class="status-chip" :class="job.tone"><i></i>{{ job.status }}</span></div><h2>{{ job.name }}</h2><p>{{ job.description }}</p><div class="automation-meta"><span>调度计划</span><b>{{ job.schedule }}</b><span>最近执行</span><b>{{ job.lastRun }}</b></div><div class="automation-actions"><button v-if="job.status === '待运行'" class="button primary" @click="run(job)"><Play :size="14" />模拟运行</button><button v-else class="button secondary" @click="reset(job)"><RotateCcw :size="14" />重置演示</button></div></article></div>
  </section>
</template>
