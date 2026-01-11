/**
 * Dashboard Page
 */

import { dashboardStats, recentActivities, aiInsights } from '../data/mock-data.js';

export function renderDashboard() {
    const content = document.getElementById('pageContent');

    content.innerHTML = `
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div></div>
      <div class="dashboard-date">
        <i class="ph ph-calendar"></i>
        <span>${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <button class="btn btn-secondary btn-sm">
          <i class="ph ph-arrows-clockwise"></i>
          새로고침
        </button>
      </div>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-4" style="margin-bottom: var(--space-8);">
      ${renderStatCard('전체 고객', dashboardStats.totalCustomers.toLocaleString(), 'users', 'primary', dashboardStats.customerGrowth)}
      ${renderStatCard('진행중 케이스', dashboardStats.inProgressCases, 'folder-open', 'secondary', dashboardStats.caseGrowth)}
      ${renderStatCard('이번 달 완료', dashboardStats.completedThisMonth, 'check-circle', 'success', dashboardStats.completionGrowth)}
      ${renderStatCard('대기 중 작업', dashboardStats.pendingTasks, 'clock', 'warning')}
    </div>
    
    <!-- Content Grid -->
    <div class="grid grid-cols-3">
      <!-- Recent Activities -->
      <div class="card col-span-2">
        <div class="card-header">
          <div>
            <h3 class="card-title">최근 활동</h3>
            <p class="card-subtitle">오늘의 상담 및 업무 현황</p>
          </div>
          <button class="btn btn-ghost btn-sm">
            전체 보기 <i class="ph ph-arrow-right"></i>
          </button>
        </div>
        <div class="card-body">
          ${recentActivities.map(activity => renderActivityRow(activity)).join('')}
        </div>
      </div>
      
      <!-- AI Insights -->
      <div class="card ai-card">
        <div class="card-header">
          <div class="ai-card-header">
            <i class="ph ph-robot"></i>
            <span>AI 인사이트</span>
          </div>
        </div>
        <div class="card-body">
          ${aiInsights.map(insight => renderInsightCard(insight)).join('')}
        </div>
      </div>
    </div>
    
    <!-- Process Overview Chart Placeholder -->
    <div class="card" style="margin-top: var(--space-8);">
      <div class="card-header">
        <div>
          <h3 class="card-title">수속 단계별 현황</h3>
          <p class="card-subtitle">비자 유형별 진행 현황</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-secondary btn-sm">NIW</button>
          <button class="btn btn-ghost btn-sm">EB-1</button>
          <button class="btn btn-ghost btn-sm">EB-5</button>
          <button class="btn btn-ghost btn-sm">H-1B</button>
        </div>
      </div>
      <div class="card-body">
        <div style="display: flex; justify-content: space-around; padding: var(--space-8) 0;">
          ${renderChartBar('초기 상담', 24, '#1A365D')}
          ${renderChartBar('서류 준비', 18, '#2B6CB0')}
          ${renderChartBar('청원서 접수', 15, '#319795')}
          ${renderChartBar('심사 중', 22, '#4FD1C5')}
          ${renderChartBar('승인 대기', 8, '#38A169')}
          ${renderChartBar('완료', 12, '#48BB78')}
        </div>
      </div>
    </div>
  `;
}

function renderStatCard(label, value, icon, variant, change = null) {
    const changeHtml = change !== null ? `
    <div class="stat-card-change ${change >= 0 ? 'positive' : 'negative'}">
      <i class="ph ph-trend-${change >= 0 ? 'up' : 'down'}"></i>
      ${Math.abs(change)}% 전월 대비
    </div>
  ` : '';

    return `
    <div class="card stat-card">
      <div class="stat-card-icon ${variant}">
        <i class="ph ph-${icon}"></i>
      </div>
      <div class="stat-card-value">${value}</div>
      <div class="stat-card-label">${label}</div>
      ${changeHtml}
    </div>
  `;
}

function renderActivityRow(activity) {
    const icons = {
        'call': 'phone',
        'email': 'envelope',
        'meeting': 'video-camera',
        'document': 'file-text'
    };

    return `
    <div class="activity-row">
      <div class="activity-icon ${activity.type}">
        <i class="ph ph-${icons[activity.type] || 'circle'}"></i>
      </div>
      <div class="activity-info">
        <div class="activity-title">${activity.title}</div>
        <div class="activity-meta">${activity.description}</div>
      </div>
      <div class="activity-time">${activity.date} ${activity.time}</div>
    </div>
  `;
}

function renderInsightCard(insight) {
    const icons = {
        'warning': 'warning',
        'lightbulb': 'lightbulb',
        'robot': 'robot'
    };

    return `
    <div class="insight-card">
      <div class="insight-header">
        <i class="ph ph-${icons[insight.icon]} insight-icon"></i>
        <span class="insight-type">${insight.type}</span>
      </div>
      <div class="insight-content">${insight.content}</div>
    </div>
  `;
}

function renderChartBar(label, count, color) {
    const maxHeight = 120;
    const height = (count / 30) * maxHeight;

    return `
    <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);">
      <div style="font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-text-primary);">${count}</div>
      <div style="width: 48px; height: ${height}px; background: ${color}; border-radius: var(--radius-sm);"></div>
      <div style="font-size: var(--text-xs); color: var(--color-text-secondary); text-align: center;">${label}</div>
    </div>
  `;
}
