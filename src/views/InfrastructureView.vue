<script setup>
import { computed, ref } from 'vue'
import { Activity, Box, Cloud, Database, Search, Server } from 'lucide-vue-next'

const query = ref('')
const selected = ref(null)
const assets = [
  { name: 'Web 应用集群', id: 'web-prod', type: '应用服务', region: '华东 · 可用区 A/B', status: '运行中', tone: 'green', cpu: 42, memory: 63, nodes: 8, icon: Cloud, note: '演示资产：展示资产列表、分组和状态视图。' },
  { name: '核心数据库', id: 'mysql-primary', type: '关系型数据库', region: '华东 · 可用区 A', status: '运行中', tone: 'green', cpu: 61, memory: 72, nodes: 1, icon: Database, note: '演示资产：尚未连接生产数据库监控指标。' },
  { name: '缓存服务', id: 'redis-cache', type: '缓存服务', region: '华东 · 可用区 B', status: '运行中', tone: 'green', cpu: 28, memory: 48, nodes: 3, icon: Box, note: '演示资产：此处数据用于讲解缓存巡检。' },
  { name: '消息队列', id: 'rabbitmq-prod', type: '消息队列', region: '华东 · 可用区 A/B', status: '需关注', tone: 'amber', cpu: 78, memory: 81, nodes: 3, icon: Activity, note: '演示告警：CPU 使用率超过示例阈值 75%。' },
]
const filtered = computed(() => assets.filter((asset) => `${asset.name} ${asset.id} ${asset.type}`.toLowerCase().includes(query.value.toLowerCase())))
</script>

<template>
  <section class="content">
    <div class="heading"><div><div class="eyebrow"><Server :size="14" />资产与基础设施 <span class="demo-tag">演示清单</span></div><h1>基础设施</h1><p>按服务查看资源、位置与运行状态。当前资产是演示数据。</p></div><span class="status-chip green"><i></i>{{ assets.length }} 个样例资源</span></div>
    <div class="page-toolbar panel"><label class="filter-input"><Search :size="16" /><input v-model="query" placeholder="搜索服务名、资源 ID 或类型" /></label><span class="toolbar-note">状态更新时间：页面载入时生成的示例值</span></div>
    <div class="asset-grid">
      <article v-for="asset in filtered" :key="asset.id" class="panel asset-card">
        <div class="asset-card-head"><span class="service-icon"><component :is="asset.icon" :size="19" /></span><span class="status-chip" :class="asset.tone"><i></i>{{ asset.status }}</span></div>
        <div class="asset-title"><h2>{{ asset.name }}</h2><code>{{ asset.id }}</code></div>
        <p class="asset-meta">{{ asset.type }} <span>·</span> {{ asset.region }}</p>
        <div class="asset-resources"><div><span>CPU</span><b>{{ asset.cpu }}%</b><i class="cpu-track"><i :class="{ hot: asset.cpu >= 75 }" :style="{ width: `${asset.cpu}%` }"></i></i></div><div><span>内存</span><b>{{ asset.memory }}%</b><i class="cpu-track"><i :class="{ hot: asset.memory >= 80 }" :style="{ width: `${asset.memory}%` }"></i></i></div></div>
        <div class="asset-card-foot"><span>{{ asset.nodes }} 个演示节点</span><button class="text-link" @click="selected = asset">查看详情 →</button></div>
      </article>
      <div v-if="!filtered.length" class="panel empty-state">没有匹配的资源，试试其他关键词。</div>
    </div>
    <div v-if="selected" class="modal-backdrop" @click.self="selected = null"><section class="modal"><button class="icon-btn modal-close" aria-label="关闭详情" @click="selected = null">×</button><span class="eyebrow">基础设施详情 · 演示数据</span><h2>{{ selected.name }}</h2><p class="muted">{{ selected.id }} · {{ selected.type }} · {{ selected.region }}</p><div class="detail-pairs"><span>运行状态</span><b>{{ selected.status }}</b><span>CPU / 内存</span><b>{{ selected.cpu }}% / {{ selected.memory }}%</b><span>节点数量</span><b>{{ selected.nodes }}</b></div><div class="modal-note"><b>数据说明</b><span>{{ selected.note }}</span></div></section></div>
  </section>
</template>
