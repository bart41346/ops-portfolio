<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Activity, Bell, Box, ChartNoAxesCombined, ChevronDown, FileText, LayoutDashboard, Menu, Search, Server, Settings, ShieldCheck, WandSparkles, X } from 'lucide-vue-next'
import { pendingAlerts, refreshAlerts } from './composables/useAlerts'

const route = useRoute()
const menuOpen = ref(false)
const activeTitle = computed(() => route.meta.title || '总览')
const navGroups = [
  { group: '工作台', items: [
    { label: '总览', path: '/', icon: LayoutDashboard },
    { label: '基础设施', path: '/infrastructure', icon: Server },
    { label: '监控指标', path: '/metrics', icon: ChartNoAxesCombined },
    { label: '告警中心', path: '/alerts', icon: Bell, badge: true },
  ] },
  { group: '运维管理', items: [
    { label: '巡检任务', path: '/inspections', icon: ShieldCheck },
    { label: '变更记录', path: '/changes', icon: FileText },
    { label: '自动化', path: '/automation', icon: WandSparkles },
  ] },
]
let refreshTimer
onMounted(() => {
  refreshAlerts()
  refreshTimer = window.setInterval(refreshAlerts, 30000)
})
onBeforeUnmount(() => window.clearInterval(refreshTimer))
</script>

<template>
  <div class="shell">
    <aside class="sidebar" :class="{ open: menuOpen }">
      <div class="brand">
        <RouterLink class="brand-home" to="/" @click="menuOpen = false"><div class="brand-mark"><Activity :size="19" /></div><div><b>OpsPilot</b><span>INFRASTRUCTURE</span></div></RouterLink>
        <button class="icon-btn close-menu" aria-label="关闭导航" @click="menuOpen = false"><X :size="18" /></button>
      </div>
      <div class="workspace"><div class="workspace-avatar">A</div><div><strong>Acme 工作空间</strong><small>面试演示环境</small></div><ChevronDown :size="15" /></div>
      <div v-for="group in navGroups" :key="group.group" class="nav-group">
        <p>{{ group.group }}</p>
        <RouterLink v-for="item in group.items" :key="item.path" :to="item.path" class="nav-item" :class="{ selected: route.path === item.path }" :aria-current="route.path === item.path ? 'page' : undefined" @click="menuOpen = false">
          <component :is="item.icon" :size="17" /><span>{{ item.label }}</span><em v-if="item.badge && pendingAlerts.length">{{ pendingAlerts.length }}</em>
        </RouterLink>
      </div>
      <div class="sidebar-bottom">
        <div class="side-status demo-status"><span class="pulse"></span><span>演示环境 · 指标部分为模拟数据</span></div>
        <RouterLink class="nav-item" to="/settings" :class="{ selected: route.path === '/settings' }" @click="menuOpen = false"><Settings :size="17" /><span>设置与连接</span></RouterLink>
        <div class="profile"><div class="profile-avatar">林</div><div><strong>林同学</strong><small>运维工程师候选人</small></div><ChevronDown :size="15" /></div>
      </div>
    </aside>
    <div v-if="menuOpen" class="scrim" @click="menuOpen = false"></div>
    <main class="main">
      <header class="topbar">
        <div class="crumb"><button class="icon-btn mobile-menu" aria-label="打开导航" @click="menuOpen = true"><Menu /></button><span>工作台</span><b>/</b><strong>{{ activeTitle }}</strong></div>
        <div class="top-actions"><RouterLink class="searchbox" to="/alerts"><Search :size="16" /><span>查看告警与事件</span><kbd>↵</kbd></RouterLink><RouterLink class="icon-btn notification" to="/alerts" aria-label="打开告警中心"><Bell :size="18" /><i v-if="pendingAlerts.length" /></RouterLink><div class="top-avatar">林</div></div>
      </header>
      <RouterView />
    </main>
  </div>
</template>
