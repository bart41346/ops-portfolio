import { ref, computed } from 'vue'
import { Activity, Bell, Box, ChartNoAxesCombined, ChevronDown, CircleHelp, Cloud, Command, Cpu, Database, Download, ExternalLink, FileText, Gauge, Github, HardDrive, LayoutDashboard, LifeBuoy, Menu, Search, Server, Settings, ShieldCheck, ShieldAlert, Terminal, Wifi, X, Zap } from 'lucide-vue-next'
const activeNav = ref('总览')
const period = ref('最近 24 小时')
const menuOpen = ref(false)
const activeAlert = ref(null)
const notices = ref([
 {level:'critical', title:'支付服务响应时间升高', detail:'api-payment-02 · 延迟 1.8s', time:'10:42', tag:'处理中'},
 {level:'warning', title:'磁盘使用率超过 80%', detail:'db-primary-01 · 使用率 84%', time:'09:18', tag:'待处理'},
 {level:'resolved', title:'节点内存告警已恢复', detail:'worker-node-03 · 内存 62%', time:'08:51', tag:'已恢复'},
])
const nav = [
 {group:'工作台', items:[{label:'总览',icon:LayoutDashboard},{label:'基础设施',icon:Server},{label:'监控指标',icon:ChartNoAxesCombined},{label:'告警中心',icon:Bell,badge:'2'}]},
 {group:'运维管理', items:[{label:'巡检任务',icon:ShieldCheck},{label:'变更记录',icon:FileText},{label:'自动化',icon:Zap}]},
]
const services = ref([{name:'Web 应用集群',meta:'web-prod · 8 节点',status:'运行中',tone:'green',uptime:'99.98%',cpu:42,icon:Cloud},{name:'核心数据库',meta:'mysql-primary · 主从',status:'运行中',tone:'green',uptime:'99.99%',cpu:61,icon:Database},{name:'缓存服务',meta:'redis-cluster · 6 节点',status:'运行中',tone:'green',uptime:'99.97%',cpu:28,icon:Box},{name:'消息队列',meta:'rabbitmq-prod · 3 节点',status:'需关注',tone:'amber',uptime:'99.82%',cpu:78,icon:Activity}])
const bars = [38,48,42,55,47,63,52,58,45,51,68,56,48,71,61,58,74,62,55,67,81,59,54,69,58,51,65,76,61,55,72,62,48,57,68,59,54,72,63,50,60,74,62,56,69,58,50,65,77,61,54,70,59,47,64,74,57,52,68,60,51,66,73,55,49,65,78,58,52,69,61,47,63,75,56,51,67,59,48,62]
const filteredAlerts = computed(()=>notices.value.filter(a=>a.level !== 'resolved'))
function resolveAlert(item){ item.level='resolved'; item.tag='已恢复'; activeAlert.value=null }
function downloadReport(){ const text='OpsPilot 运维周报\n生成时间：'+new Date().toLocaleString('zh-CN')+'\n服务可用率：99.97%\n当前待处理告警：'+filteredAlerts.value.length+'\n'; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'})); a.download='opspilot-ops-report.txt'; a.click(); URL.revokeObjectURL(a.href) }
