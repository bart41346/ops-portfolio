<script setup>
import { computed, ref } from 'vue'
import { FileClock, Search } from 'lucide-vue-next'

const query = ref('')
const records = [
  { id: 'CHG-2026-1042', title: 'Web 应用例行发布', owner: '值班工程师', environment: '演示生产', status: '成功', tone: 'green', time: '2026-11-21 09:20', risk: '低', rollback: '镜像回滚至上一版本' },
  { id: 'CHG-2026-1041', title: '数据库连接池参数调整', owner: '数据库管理员', environment: '演示生产', status: '已回滚', tone: 'amber', time: '2026-11-20 16:45', risk: '中', rollback: '已恢复原连接池配置' },
  { id: 'CHG-2026-1040', title: 'TLS 证书续期演练', owner: '平台工程师', environment: '预发布', status: '成功', tone: 'green', time: '2026-11-20 13:10', risk: '低', rollback: '无需回滚' },
  { id: 'CHG-2026-1039', title: '缓存节点版本升级演练', owner: '值班工程师', environment: '预发布', status: '进行中', tone: 'blue', time: '2026-11-19 18:30', risk: '中', rollback: '保留旧节点用于回滚' },
]
const filtered = computed(() => records.filter((record) => `${record.id} ${record.title} ${record.owner}`.toLowerCase().includes(query.value.toLowerCase())))
</script>

<template>
  <section class="content">
    <div class="heading"><div><div class="eyebrow"><FileClock :size="14" />变更管理 <span class="demo-tag">演示记录</span></div><h1>变更记录</h1><p>按时间追踪变更、审批状态与回滚方案。以下记录为虚构样例。</p></div><span class="status-chip blue"><i></i>变更留痕示例</span></div>
    <div class="page-toolbar panel"><label class="filter-input"><Search :size="16" /><input v-model="query" placeholder="搜索变更编号、标题或执行人" /></label><span class="toolbar-note">共 {{ filtered.length }} 条记录</span></div>
    <section class="panel changes-panel"><div class="panel-head"><div><h2>变更时间线</h2><p>示例字段：变更内容、执行人、环境、结果和回滚措施</p></div></div><div class="change-list"><article v-for="record in filtered" :key="record.id" class="change-row"><span class="timeline-dot" :class="record.tone"></span><div class="change-content"><div class="change-title"><strong>{{ record.title }}</strong><span class="status-chip" :class="record.tone"><i></i>{{ record.status }}</span></div><div class="change-meta"><code>{{ record.id }}</code><span>{{ record.owner }}</span><span>{{ record.environment }}</span><time>{{ record.time }}</time></div><p><b>风险：{{ record.risk }}</b><span>回滚方案：{{ record.rollback }}</span></p></div></article><div v-if="!filtered.length" class="empty-state">没有匹配的变更记录。</div></div></section>
    <div class="info-panel panel"><h2>生产化建议</h2><p>真实系统应关联工单或审批单，记录开始与结束时间、执行命令、影响范围、验证结果，并在失败时记录回滚证据。</p></div>
  </section>
</template>
