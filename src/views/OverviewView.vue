<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Cpu, Database, Download, Server, ShieldCheck, Wifi } from 'lucide-vue-next'
import { alerts, apiStatus, pendingAlerts } from '../composables/useAlerts'

const chartBars = [32, 46, 39, 55, 48, 63, 52, 59, 44, 68, 57, 74, 62, 53, 79, 66, 58, 71, 62, 49, 68, 81, 56, 65]
const recentAlerts = computed(() => alerts.value.slice(0, 4))
const latestUpdate = computed(() => new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
function alertTime(value) {
  return value ? new Date(value).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'
}
function downloadReport() {
  const lines = ['OpsPilot 运维演示周报', `导出时间：${new Date().toLocaleString('zh-CN')}`, `当前待处理告警：${pendingAlerts.value.length}`, '注意：资源指标为演示数据。']
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'opspilot-demo-report.txt'
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
</script>

<template>
  <section class="content">
    <div class="heading">
      <div>
        <div class="eyebrow"><span class="pulse" :class="{ 'pulse-off': apiStatus === 'offline' }"></span>系统运行概览 <span class="updated">{{ apiStatus === 'online' ? '告警 API 已连接' : apiStatus === 'offline' ? '告警 API 暂不可用' : '正在连接 API' }}</span></div>
        <h1>早上好，林同学 <span>✳</span></h1>
        <p>作品集演示环境 · 告警来自 API，资源指标为模拟数据。</p>
      </div>
      <div class="heading-actions"><button class="button secondary" @click="downloadReport"><Download :size="16" />导出演示报告</button><RouterLink class="button primary" to="/inspections"><ShieldCheck :size="16" />开始巡检</RouterLink></div>
    </div>

    <div class="notice-bar"><AlertTriangle :size="16" /><span>演示说明：可用率、CPU、节点数和巡检清单均为样例数据，不代表真实生产监控。</span><RouterLink to="/settings">查看数据源</RouterLink></div>

    <div class="metrics">
      <article class="metric"><div class="metric-label">待处理告警 <span class="metric-icon orange"><Bell :size="17" /></span></div><div class="metric-value">{{ pendingAlerts.length.toString().padStart(2, '0') }}<span class="sub-value"> 条</span></div><div class="metric-foot"><span class="warning-text">API 实时数据</span><span>最近 50 条</span><div class="alert-mini"><span v-for="n in 6" :key="n"></span></div></div></article>
      <article class="metric"><div class="metric-label">演示可用率 <span class="metric-icon mint"><Activity :size="17" /></span></div><div class="metric-value">99.97<span>%</span></div><div class="metric-foot"><span class="positive"><ArrowUpRight :size="12" /> 0.03%</span><span>样例指标</span><div class="spark mint-line"><i v-for="n in [9, 13, 10, 16, 12, 21, 18, 24, 20, 30, 25, 36]" :key="n" :style="{ height: `${n}px` }"></i></div></div></article>
      <article class="metric"><div class="metric-label">演示节点 <span class="metric-icon blue"><Server :size="17" /></span></div><div class="metric-value">24<span class="sub-value"> / 24</span></div><div class="metric-foot"><span class="positive">样例资产</span><span>非真实主机</span><div class="mini-nodes"><i v-for="n in 10" :key="n"></i></div></div></article>
      <article class="metric"><div class="metric-label">演示平均 CPU <span class="metric-icon purple"><Cpu :size="17" /></span></div><div class="metric-value">52<span>%</span></div><div class="metric-foot"><span class="positive"><ArrowDownRight :size="12" /> 4.2%</span><span>样例指标</span><div class="spark purple-line"><i v-for="n in [17, 20, 16, 28, 21, 32, 25, 35, 28, 42, 34, 38]" :key="n" :style="{ height: `${n}px` }"></i></div></div></article>
    </div>

    <div class="dashboard-grid">
      <section class="panel chart-panel">
        <div class="panel-head"><div><h2>资源趋势 <span class="demo-tag">演示数据</span></h2><p>示例节点 CPU 使用率 · 最近 24 小时</p></div><RouterLink class="text-link" to="/metrics">打开监控指标</RouterLink></div>
        <div class="chart-legend"><span><i class="legend-dot cpu"></i>CPU 使用率</span><span><i class="legend-dot mem"></i>内存使用率</span><span class="legend-note">示例序列</span></div>
        <div class="chart"><div class="y-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div class="plot"><div v-for="n in 5" :key="n" class="grid-line"></div><div class="area area-blue"></div><div class="area area-mint"></div><div class="bars"><i v-for="(bar, index) in chartBars" :key="index" :style="{ height: `${bar}%` }"></i></div></div></div>
        <div class="x-axis"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>现在</span></div>
        <div class="chart-foot"><span><span class="pulse"></span>页面刷新 {{ latestUpdate }}</span><RouterLink to="/metrics">接入真实指标源 →</RouterLink></div>
      </section>

      <section class="panel alert-panel">
        <div class="panel-head"><div><h2>最近告警 <span class="count-pill">{{ pendingAlerts.length }}</span></h2><p>由 Spring Boot API 提供</p></div><RouterLink class="text-link" to="/alerts">告警中心</RouterLink></div>
        <div v-if="recentAlerts.length" class="alert-list"><article v-for="alert in recentAlerts" :key="alert.id" class="alert-row" :class="{ resolved: alert.status === 'RESOLVED', critical: alert.severity === 'CRITICAL' && alert.status !== 'RESOLVED' }"><span class="alert-symbol"><Bell :size="16" /></span><div class="alert-info"><strong>{{ alert.title }}</strong><span>{{ alert.resource }} · {{ alert.severity }}</span></div><div class="alert-meta"><time>{{ alertTime(alert.createdAt) }}</time><span class="alert-tag">{{ alert.status === 'RESOLVED' ? '已恢复' : '待处理' }}</span></div></article></div>
        <div v-else class="empty-inline"><Database :size="17" /><span>暂时没有告警记录。创建一条测试告警，查看 API 读写流程。</span></div>
        <div class="alert-summary"><span>接口状态：{{ apiStatus === 'online' ? '连接正常' : apiStatus === 'offline' ? '暂不可用' : '连接中' }}</span><RouterLink to="/alerts">管理告警 →</RouterLink></div>
      </section>

      <section class="panel services-panel">
        <div class="panel-head"><div><h2>关键服务 <span class="demo-tag">样例资产</span></h2><p>仅用于演示资产视图与状态分类</p></div><RouterLink class="text-link" to="/infrastructure">资产清单</RouterLink></div>
        <div class="service-table"><div class="table-head"><span>服务名称</span><span>状态</span><span>演示可用率</span><span>演示 CPU</span></div>
          <div v-for="service in [{ name: 'Web 应用集群', meta: 'web-prod · 8 节点', status: '运行中', tone: 'green', uptime: '99.98%', cpu: 42 }, { name: '核心数据库', meta: 'mysql-primary · 样例', status: '运行中', tone: 'green', uptime: '99.99%', cpu: 61 }, { name: '缓存服务', meta: 'redis-cluster · 样例', status: '运行中', tone: 'green', uptime: '99.97%', cpu: 28 }]" :key="service.name" class="service-row">
            <div class="service-name"><span class="service-icon"><Database :size="17" /></span><span><b>{{ service.name }}</b><small>{{ service.meta }}</small></span></div><div><span class="status-chip" :class="service.tone"><i></i>{{ service.status }}</span></div><div class="uptime">{{ service.uptime }}</div><div class="cpu-cell"><span class="cpu-track"><i :style="{ width: `${service.cpu}%` }"></i></span><small>{{ service.cpu }}%</small></div>
          </div>
        </div>
      </section>

      <section class="panel checklist-panel">
        <div class="panel-head"><div><h2>今日巡检 <span class="demo-tag">本机示例</span></h2><p>记录仅保存在当前浏览器</p></div><RouterLink class="text-link" to="/inspections">打开任务</RouterLink></div>
        <div class="check-progress"><div><strong>3</strong><span>/ 5 项样例完成</span></div><b>60%</b></div><div class="progress-track"><i></i></div>
        <div class="check-items"><div><span class="check done">✓</span><span>服务器负载与磁盘空间</span><small>完成</small></div><div><span class="check done">✓</span><span>数据库备份检查</span><small>完成</small></div><div><span class="check pending-check"></span><span>证书到期时间检查</span><small>待检查</small></div></div>
      </section>
    </div>
    <footer><span>OpsPilot · 运维工程师面试作品集</span><span><Wifi :size="13" />告警 API：{{ apiStatus === 'online' ? '已连接' : apiStatus === 'offline' ? '离线' : '连接中' }} <b>·</b> 指标为演示数据</span></footer>
  </section>
</template>
