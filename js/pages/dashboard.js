/**
 * Dashboard Page
 * 대시보드 페이지 - 차트 인터랙션 및 UI 개선
 */

import { customers, cases, documents, recentActivities, aiInsights } from '../data/mock-data.js';

// 실제 데이터 기반 동적 통계 계산
function calculateDashboardStats() {
  const totalCustomers = customers.length;
  const inProgressCases = cases.filter(c => c.status === 'in-progress').length;
  const completedCases = cases.filter(c => c.status === 'completed').length;
  const pendingTasks = documents.filter(d => d.status === 'pending' || d.status === 'in-progress').length;

  return {
    totalCustomers,
    inProgressCases,
    completedThisMonth: completedCases,
    pendingTasks,
    customerGrowth: 12.5,  // 이전 데이터 없어 고정값 유지
    caseGrowth: -3.2,
    completionGrowth: 8.3
  };
}

// 비자 유형별 단계별 데이터
// 차트 색상 정의
const chartColors = {
  '초기 상담': { bg: 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)', solid: '#2563EB' },
  '서류 준비': { bg: 'linear-gradient(180deg, #6366F1 0%, #4338CA 100%)', solid: '#4F46E5' },
  '청원서 접수': { bg: 'linear-gradient(180deg, #8B5CF6 0%, #6D28D9 100%)', solid: '#7C3AED' },
  '심사 중': { bg: 'linear-gradient(180deg, #EC4899 0%, #BE185D 100%)', solid: '#DB2777' },
  '승인 대기': { bg: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)', solid: '#F59E0B' },
  '완료': { bg: 'linear-gradient(180deg, #10B981 0%, #059669 100%)', solid: '#10B981' }
};

let currentVisaType = 'NIW';

// 실제 데이터 기반 차트 데이터 계산
function calculateProcessStats(visaType) {
  const stages = ['초기 상담', '서류 준비', '청원서 접수', '심사 중', '승인 대기', '완료'];
  const stageCounts = stages.reduce((acc, stage) => ({ ...acc, [stage]: 0 }), {});

  // 해당 비자 타입의 케이스 필터링
  const typeCases = cases.filter(c => c.visaType === visaType);

  typeCases.forEach(c => {
    let stage = '초기 상담';

    // 1. 상태 텍스트 매핑 시도
    if (c.status === 'completed') stage = '완료';
    else if (c.currentStep.includes('상담')) stage = '초기 상담';
    else if (c.currentStep.includes('서류') || c.currentStep.includes('준비') || c.currentStep.includes('작성')) stage = '서류 준비';
    else if (c.currentStep.includes('접수')) stage = '청원서 접수';
    else if (c.currentStep.includes('심사') || c.currentStep.includes('대응') || c.currentStep.includes('RFE')) stage = '심사 중';
    else if (c.currentStep.includes('발급') || c.currentStep.includes('승인') || c.currentStep.includes('인터뷰')) stage = '승인 대기';
    // 2. 진행률 기반 매핑 (Fallback)
    else {
      if (c.progress >= 100) stage = '완료';
      else if (c.progress >= 80) stage = '승인 대기';
      else if (c.progress >= 60) stage = '심사 중';
      else if (c.progress >= 40) stage = '청원서 접수';
      else if (c.progress >= 20) stage = '서류 준비';
      else stage = '초기 상담';
    }

    stageCounts[stage]++;
  });

  return stageCounts;
}

export function renderDashboard() {
  const content = document.getElementById('pageContent');
  const dashboardStats = calculateDashboardStats(); // 동적 계산

  content.innerHTML = `
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div></div>
      <div class="dashboard-date">
        <i class="ph ph-calendar"></i>
        <span>${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <button class="btn btn-secondary btn-sm" onclick="window.location.reload()">
          <i class="ph ph-arrows-clockwise"></i>
          새로고침
        </button>
      </div>
    </div>
    
    <!-- Stats Grid - Improved -->
    <div class="dashboard-stats-grid">
      ${renderStatCard('전체 고객', dashboardStats.totalCustomers.toLocaleString(), 'users', 'primary', dashboardStats.customerGrowth)}
      ${renderStatCard('진행중 케이스', dashboardStats.inProgressCases, 'folder-open', 'info', dashboardStats.caseGrowth)}
      ${renderStatCard('이번 달 완료', dashboardStats.completedThisMonth, 'check-circle', 'success', dashboardStats.completionGrowth)}
      ${renderStatCard('대기 중 작업', dashboardStats.pendingTasks, 'clock', 'warning')}
    </div>
    
    <!-- Content Grid -->
    <div class="dashboard-content-grid">
      <!-- Recent Activities -->
      <div class="card dashboard-activities">
        <div class="card-header">
          <div>
            <h3 class="card-title">
              <i class="ph ph-activity"></i>
              최근 활동
            </h3>
            <p class="card-subtitle">오늘의 상담 및 업무 현황</p>
          </div>
          <button class="btn btn-ghost btn-sm">
            전체 보기 <i class="ph ph-arrow-right"></i>
          </button>
        </div>
        <div class="card-body">
          <div class="activity-list">
            ${recentActivities.map(activity => renderActivityRow(activity)).join('')}
          </div>
        </div>
      </div>
      
      <!-- AI Insights -->
      <div class="card ai-insights-card">
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
    
    <!-- Process Overview Chart -->
    <div class="card chart-card">
      <div class="card-header chart-header">
        <div>
          <h3 class="card-title">
            <i class="ph ph-chart-bar"></i>
            수속 단계별 현황
          </h3>
          <p class="card-subtitle">비자 유형별 진행 현황 (실시간)</p>
        </div>
        <div class="visa-type-tabs" id="visaTypeTabs">
          <button class="visa-tab active" data-visa="NIW">NIW</button>
          <button class="visa-tab" data-visa="EB-1">EB-1</button>
          <button class="visa-tab" data-visa="EB-5">EB-5</button>
          <button class="visa-tab" data-visa="H-1B">H-1B</button>
        </div>
      </div>
      <div class="card-body">
        <div class="chart-container" id="processChart">
          ${renderProcessChart('NIW')}
        </div>
      </div>
    </div>
  `;

  // 차트 탭 이벤트 리스너 등록
  setupChartTabListeners();
}

function setupChartTabListeners() {
  const tabs = document.querySelectorAll('.visa-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // 활성 탭 변경
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // 차트 업데이트
      const visaType = this.dataset.visa;
      currentVisaType = visaType;
      updateChart(visaType);
    });
  });
}

function updateChart(visaType) {
  const chartContainer = document.getElementById('processChart');
  chartContainer.innerHTML = renderProcessChart(visaType);

  // 애니메이션 적용
  const bars = chartContainer.querySelectorAll('.chart-bar-fill');
  bars.forEach((bar, index) => {
    bar.style.animation = `growBar 0.5s ease-out ${index * 0.1}s forwards`;
  });
}

function renderProcessChart(visaType) {
  const data = calculateProcessStats(visaType);
  const stages = Object.keys(data);

  // 최대값 계산 (최소 5로 설정하여 그래프 비율 유지)
  const maxValue = Math.max(5, ...Object.values(data));
  const totalCount = Object.values(data).reduce((a, b) => a + b, 0);

  return `
    <div class="process-chart">
      ${stages.map(stage => {
    const count = data[stage];
    const percentage = (count / maxValue) * 100;
    const colorInfo = chartColors[stage];

    return `
        <div class="chart-bar-container">
          <div class="chart-bar-value">${count}</div>
          <div class="chart-bar-wrapper">
            <div class="chart-bar-fill" style="height: ${percentage}%; background: ${colorInfo.bg};" data-value="${count}"></div>
          </div>
          <div class="chart-bar-label">${stage}</div>
        </div>
        `;
  }).join('')}
    </div>
    <div class="chart-legend">
      <span class="chart-total">
        <strong>총 ${totalCount}건</strong>의 ${visaType} 케이스가 진행 중입니다
        ${totalCount === 0 ? '<span style="color: var(--color-text-muted); font-size: 0.9em; margin-left: 8px;">(데이터 없음)</span>' : ''}
      </span>
    </div>
  `;
}

function renderStatCard(label, value, icon, variant, change = null) {
  const changeHtml = change !== null ? `
    <div class="stat-change ${change >= 0 ? 'positive' : 'negative'}">
      <i class="ph ph-trend-${change >= 0 ? 'up' : 'down'}"></i>
      <span>${Math.abs(change)}% 전월 대비</span>
    </div>
  ` : '';

  return `
    <div class="dashboard-stat-card ${variant}">
      <div class="stat-icon-wrapper ${variant}">
        <i class="ph ph-${icon}"></i>
      </div>
      <div class="stat-info">
        <div class="stat-value">${value}</div>
        <div class="stat-label">${label}</div>
        ${changeHtml}
      </div>
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

  const colors = {
    'call': '#3B82F6',
    'email': '#8B5CF6',
    'meeting': '#10B981',
    'document': '#F59E0B'
  };

  return `
    <div class="activity-item">
      <div class="activity-icon" style="background: ${colors[activity.type]}20; color: ${colors[activity.type]};">
        <i class="ph ph-${icons[activity.type] || 'circle'}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-title">${activity.title}</div>
        <div class="activity-meta">${activity.description}</div>
      </div>
      <div class="activity-time">${activity.time}</div>
    </div>
  `;
}

function renderInsightCard(insight) {
  const icons = {
    'warning': 'warning',
    'lightbulb': 'lightbulb',
    'robot': 'robot'
  };

  const colors = {
    'warning': { bg: '#FEF3C7', color: '#D97706', border: '#F59E0B' },
    'lightbulb': { bg: '#DBEAFE', color: '#2563EB', border: '#3B82F6' },
    'robot': { bg: '#D1FAE5', color: '#059669', border: '#10B981' }
  };

  const colorInfo = colors[insight.icon] || colors['robot'];

  return `
    <div class="insight-item" style="background: ${colorInfo.bg}; border-left: 3px solid ${colorInfo.border};">
      <div class="insight-header" style="color: ${colorInfo.color};">
        <i class="ph ph-${icons[insight.icon]}"></i>
        <span>${insight.type}</span>
      </div>
      <div class="insight-content">${insight.content}</div>
    </div>
  `;
}
