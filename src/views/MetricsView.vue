<script setup>
import { computed, ref } from 'vue'
import { Activity, ChartNoAxesCombined, Clock3 } from 'lucide-vue-next'

const range = ref('最近 24 小时')
const pointsByRange = { '最近 1 小时': [28, 36, 31, 45, 41, 53, 47, 58, 49, 62, 55, 48], '最近 24 小时': [32, 46, 39, 55, 48, 63, 52, 59, 44, 68, 57, 74, 62, 53, 79, 66, 58, 71, 62, 49, 68, 81, 56, 65], '最近 7 天': [43, 39, 52, 47, 62, 55, 49] }
const points = computed(() => pointsByRange[range.value])
const intervals = computed(() => range.value === '最近 1 小时' ? '5 分钟' : range.value === '最近 24 小时' ? '1 小时' : '1 天')
</script>

<template>
  <section class="content">
    <div class="heading"><div><div class="eyebrow"><ChartNoAxesCombined :size="14" />资源监控 <span class="demo-tag">模拟时序</span></div><h1>监控指标</h1><p>查看 CPU 示例趋势和阈值状态。要展示真实曲线，需要接入 Prometheus 等指标源。</p></div><label class="select-button range-select"><Clock3 :size="14" /><select v-model="range"><option>最近 1 小时</option><option>最近 24 小时</option><option>最近 7 天</option></select></label></div>
    <div class="notice-bar"><Activity :size="16" /><span>以下曲线为本地样例序列；切换时间范围会改变展示粒度，不会查询真实主机。</span></div>
    <div class="metrics metrics-three"><article class="metric"><div class="metric-label">CPU 使用率 <span class="metric-icon blue">CPU</span></div><div class="metric-value">52<span>%</span></div><div class="metric-foot"><span>演示均值</span><span>阈值 80%</span></div></article><article class="metric"><div class="metric-label">内存使用率 <span class="metric-icon mint">MEM</span></div><div class="metric-value">68<span>%</span></div><div class="metric-foot"><span>演示均值</span><span>阈值 85%</span></div></article><article class="metric"><div class="metric-label">磁盘使用率 <span class="metric-icon orange">DISK</span></div><div class="metric-value">74<span>%</span></div><div class="metric-foot"><span>演示均值</span><span>阈值 90%</span></div></article></div>
    <section class="panel chart-panel full-chart"><div class="panel-head"><div><h2>CPU 与内存趋势</h2><p>{{ range }} · 采样间隔 {{ intervals }}</p></div><span class="status-chip amber"><i></i>示例数据</span></div><div class="chart-legend"><span><i class="legend-dot cpu"></i>CPU</span><span><i class="legend-dot mem"></i>内存</span><span class="legend-note">{{ points.length }} 个样本</span></div><div class="chart tall-chart"><div class="y-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div class="plot"><div v-for="n in 5" :key="n" class="grid-line"></div><div class="bars"><i v-for="(point, index) in points" :key="index" :style="{ height: `${point}%` }"></i></div></div></div><div class="chart-foot"><span>采样范围：{{ range }}</span><span>数据源：静态样例</span></div></section>
    <div class="panel info-panel"><h2>接入真实监控的路线</h2><ol><li>在目标主机部署 Prometheus Node Exporter，采集 CPU、内存、磁盘和网络指标。</li><li>由 Prometheus 保存时序数据；Spring Boot 提供受控的查询 API。</li><li>前端按时间范围请求聚合数据，并显示采样时间与数据源。</li></ol></div>
  </section>
</template>
