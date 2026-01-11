/**
 * Analytics Page
 * 통계/분석 페이지 - 실제 데이터 기반 동적 통계
 */

import { analyticsData, cases, customers, documents } from '../data/mock-data.js';

// 실제 데이터 기반 동적 통계 계산
function calculateRealStats() {
  const visaGroups = {};
  cases.forEach(c => {
    const type = c.visaType === 'F-1' ? 'F-1/OPT' : c.visaType;
    if (!visaGroups[type]) visaGroups[type] = { total: 0, completed: 0 };
    visaGroups[type].total++;
    if (c.status === 'completed') visaGroups[type].completed++;
  });

  // analyticsData의 기본 통계와 병합 (실제 데이터 우선)
  const mergedVisaStats = analyticsData.visaTypeStats.map(stat => {
    const real = visaGroups[stat.type];
    if (real && real.total > 0) {
      return {
        type: stat.type,
        count: real.total,
        successRate: real.total > 0 ? Math.round((real.completed / real.total) * 100) : stat.successRate
      };
    }
    return stat;
  });

  return {
    totalCases: cases.length,
    totalCustomers: customers.length,
    inProgressCases: cases.filter(c => c.status === 'in-progress').length,
    completedCases: cases.filter(c => c.status === 'completed').length,
    pendingTasks: documents.filter(d => d.status === 'pending' || d.status === 'in-progress').length,
    visaTypeStats: mergedVisaStats,
    avgSuccessRate: Math.round(mergedVisaStats.reduce((sum, v) => sum + v.successRate, 0) / mergedVisaStats.length)
  };
}

export function renderAnalytics() {
  const content = document.getElementById('pageContent');
  const { monthlyStats, processingTimes, satisfactionScore } = analyticsData;
  const realStats = calculateRealStats();

  content.innerHTML = `
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">통계/분석</h1>
        <p class="page-subtitle">비자 수속 현황과 성과를 분석합니다</p>
      </div>
      <div class="header-actions">
        <select class="form-select" style="min-width: 150px;">
          <option>최근 6개월</option>
          <option>최근 1년</option>
          <option>전체 기간</option>
        </select>
      </div>
    </div>

    <div class="analytics-layout">
      <!-- KPI Cards - 실제 데이터 기반 -->
      <div class="stats-grid analytics-kpis">
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-primary-light); color: var(--color-primary);">
          <i class="ph ph-chart-line-up"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${realStats.totalCases}</div>
          <div class="stat-label">전체 케이스</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-success-light); color: var(--color-success);">
          <i class="ph ph-percent"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${realStats.avgSuccessRate}%</div>
          <div class="stat-label">평균 승인률</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-info-light); color: var(--color-info);">
          <i class="ph ph-timer"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${processingTimes.avg}개월</div>
          <div class="stat-label">평균 처리 시간</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-warning-light); color: var(--color-warning);">
          <i class="ph ph-star"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${satisfactionScore}/5.0</div>
          <div class="stat-label">고객 만족도</div>
        </div>
      </div>
    </div>

    <div class="analytics-grid">
      <!-- Visa Type Stats - 실제 데이터 기반 -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">
            <i class="ph ph-chart-bar"></i>
            비자 유형별 현황 <small style="color: var(--color-text-muted); font-weight: normal;">(실시간)</small>
          </h4>
        </div>
        <div class="card-body">
          <div class="chart-container">
            ${realStats.visaTypeStats.map(stat => `
              <div class="bar-chart-item" style="cursor: pointer;" onclick="window.router.navigate('cases')">
                <div class="bar-label">
                  <span class="bar-name">${stat.type}</span>
                  <span class="bar-value">${stat.count}건</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" style="width: ${(stat.count / Math.max(...realStats.visaTypeStats.map(s => s.count), 1)) * 100}%;"></div>
                </div>
                <div class="bar-success-rate">
                  <span class="success-badge">승인률 ${stat.successRate}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Monthly Trend -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">
            <i class="ph ph-trend-up"></i>
            월별 케이스 추이
          </h4>
        </div>
        <div class="card-body">
          <div class="line-chart-container">
            <div class="line-chart-legend">
              <span class="legend-item"><span class="legend-dot new"></span> 신규 접수</span>
              <span class="legend-item"><span class="legend-dot completed"></span> 완료</span>
            </div>
            <div class="line-chart">
              ${monthlyStats.map((stat, i) => `
                <div class="chart-column">
                  <div class="chart-bars">
                    <div class="chart-bar new" style="height: ${stat.newCases * 4}px;" title="신규: ${stat.newCases}건"></div>
                    <div class="chart-bar completed" style="height: ${stat.completed * 4}px;" title="완료: ${stat.completed}건"></div>
                  </div>
                  <div class="chart-label">${stat.month.split('-')[1]}월</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Processing Time Stats -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">
            <i class="ph ph-clock"></i>
            처리 시간 분석
          </h4>
        </div>
        <div class="card-body">
          <div class="time-stats">
            <div class="time-stat-item">
              <div class="time-stat-value">${processingTimes.min}개월</div>
              <div class="time-stat-label">최소</div>
            </div>
            <div class="time-stat-item highlight">
              <div class="time-stat-value">${processingTimes.avg}개월</div>
              <div class="time-stat-label">평균</div>
            </div>
            <div class="time-stat-item">
              <div class="time-stat-value">${processingTimes.max}개월</div>
              <div class="time-stat-label">최대</div>
            </div>
          </div>
          <div class="time-range-bar">
            <div class="time-range-fill" style="left: ${(processingTimes.min / processingTimes.max) * 100}%; width: ${((processingTimes.avg - processingTimes.min) / processingTimes.max) * 100}%;"></div>
            <div class="time-range-marker" style="left: ${(processingTimes.avg / processingTimes.max) * 100}%;"></div>
          </div>
          <p class="time-stat-note">최근 6개월 기준 평균 처리 시간</p>
        </div>
      </div>

      <!-- Success Rate by Visa -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">
            <i class="ph ph-target"></i>
            비자별 승인률
          </h4>
        </div>
        <div class="card-body">
          <div class="success-rate-grid">
            ${realStats.visaTypeStats.map(stat => `
              <div class="success-rate-item">
                <div class="success-rate-circle" style="--progress: ${stat.successRate}%;">
                  <svg viewBox="0 0 36 36">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="circle-fill" stroke-dasharray="${stat.successRate}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                  <span class="circle-text">${stat.successRate}%</span>
                </div>
                <div class="success-rate-label">${stat.type}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
    </div>
  `;
}
