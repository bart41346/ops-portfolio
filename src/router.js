import { createRouter, createWebHashHistory } from 'vue-router'
import OverviewView from './views/OverviewView.vue'
import InfrastructureView from './views/InfrastructureView.vue'
import MetricsView from './views/MetricsView.vue'
import AlertsView from './views/AlertsView.vue'
import InspectionsView from './views/InspectionsView.vue'
import ChangesView from './views/ChangesView.vue'
import AutomationView from './views/AutomationView.vue'
import SettingsView from './views/SettingsView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: OverviewView, meta: { title: '总览' } },
    { path: '/infrastructure', component: InfrastructureView, meta: { title: '基础设施' } },
    { path: '/metrics', component: MetricsView, meta: { title: '监控指标' } },
    { path: '/alerts', component: AlertsView, meta: { title: '告警中心' } },
    { path: '/inspections', component: InspectionsView, meta: { title: '巡检任务' } },
    { path: '/changes', component: ChangesView, meta: { title: '变更记录' } },
    { path: '/automation', component: AutomationView, meta: { title: '自动化' } },
    { path: '/settings', component: SettingsView, meta: { title: '设置与连接' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${to.meta.title || '总览'} · OpsPilot 运维作品集`
})

export default router
