/**
 * Cases Management Page
 * 케이스 현황 페이지
 */

import { cases, processSteps } from '../data/mock-data.js';

export function renderCases() {
  const content = document.getElementById('pageContent');

  const statusLabels = {
    'in-progress': { text: '진행중', class: 'badge-info', icon: 'spinner' },
    'pending': { text: '대기', class: 'badge-warning', icon: 'clock' },
    'completed': { text: '완료', class: 'badge-success', icon: 'check-circle' }
  };

  const visaColors = {
    'NIW': 'var(--color-primary)',
    'EB-1': 'var(--color-success)',
    'EB-5': 'var(--color-warning)',
    'H-1B': 'var(--color-info)',
    'F-1': 'var(--color-secondary)'
  };

  content.innerHTML = `
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">케이스 현황</h1>
        <p class="page-subtitle">진행 중인 케이스를 실시간으로 모니터링합니다</p>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="stats-grid" style="margin-bottom: var(--space-6);">
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-info-light); color: var(--color-info);">
          <i class="ph ph-spinner"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${cases.filter(c => c.status === 'in-progress').length}</div>
          <div class="stat-label">진행중</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-warning-light); color: var(--color-warning);">
          <i class="ph ph-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${cases.filter(c => c.status === 'pending').length}</div>
          <div class="stat-label">대기중</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-success-light); color: var(--color-success);">
          <i class="ph ph-check-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${cases.filter(c => c.status === 'completed').length}</div>
          <div class="stat-label">완료</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-primary-light); color: var(--color-primary);">
          <i class="ph ph-folder-open"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${cases.length}</div>
          <div class="stat-label">전체 케이스</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card" style="margin-bottom: var(--space-4);">
      <div class="filters-row">
        <div class="filter-group">
          <select class="form-select" id="caseStatusFilter">
            <option value="">전체 상태</option>
            <option value="in-progress">진행중</option>
            <option value="pending">대기중</option>
            <option value="completed">완료</option>
          </select>
          <select class="form-select" id="caseVisaFilter">
            <option value="">전체 비자</option>
            ${[...new Set(cases.map(c => c.visaType))].map(type =>
    `<option value="${type}">${type}</option>`
  ).join('')}
          </select>
        </div>
      </div>
    </div>

    <!-- Cases Grid -->
    <div class="cases-grid" id="casesGrid">
      ${cases.map(caseItem => `
        <div class="case-card" data-status="${caseItem.status}" data-visa="${caseItem.visaType}">
          <div class="case-card-header">
            <div class="case-customer">
              <div class="customer-avatar" style="background: ${visaColors[caseItem.visaType] || 'var(--color-primary)'}20; color: ${visaColors[caseItem.visaType] || 'var(--color-primary)'};">
                ${caseItem.customerName.charAt(0)}
              </div>
              <div>
                <div class="case-customer-name customer-link" data-customer-id="${caseItem.customerId}" style="cursor: pointer;">${caseItem.customerName}</div>
                <div class="case-visa-type">
                  <span class="badge" style="background: ${visaColors[caseItem.visaType] || 'var(--color-primary)'}20; color: ${visaColors[caseItem.visaType] || 'var(--color-primary)'};">${caseItem.visaType}</span>
                </div>
              </div>
            </div>
            <span class="badge ${statusLabels[caseItem.status].class}">
              <i class="ph ph-${statusLabels[caseItem.status].icon}"></i>
              ${statusLabels[caseItem.status].text}
            </span>
          </div>
          
          <div class="case-card-body">
            <div class="case-step">
              <i class="ph ph-map-pin"></i>
              <span>${caseItem.currentStep}</span>
            </div>
            
            <div class="case-progress">
              <div class="progress-header">
                <span>진행률</span>
                <span class="progress-value">${caseItem.progress}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${caseItem.progress}%; background: ${visaColors[caseItem.visaType] || 'var(--color-primary)'};"></div>
              </div>
            </div>
            
            <div class="case-dates">
              <div class="case-date">
                <i class="ph ph-calendar"></i>
                <span>시작: ${caseItem.startDate}</span>
              </div>
              <div class="case-date">
                <i class="ph ph-flag"></i>
                <span>예상 완료: ${caseItem.estimatedEnd}</span>
              </div>
            </div>
          </div>
          
          <div class="case-card-footer">
            <span class="case-assignee">
              <i class="ph ph-user"></i>
              ${caseItem.assignee}
            </span>
            <button class="btn btn-ghost btn-sm" onclick="window.showCaseDetail('${caseItem.id}')">
              상세보기
              <i class="ph ph-arrow-right"></i>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  setupCaseFilters();
}

function setupCaseFilters() {
  const statusFilter = document.getElementById('caseStatusFilter');
  const visaFilter = document.getElementById('caseVisaFilter');

  const filterCases = () => {
    const status = statusFilter.value;
    const visa = visaFilter.value;

    document.querySelectorAll('.case-card').forEach(card => {
      const matchStatus = !status || card.dataset.status === status;
      const matchVisa = !visa || card.dataset.visa === visa;
      card.style.display = matchStatus && matchVisa ? '' : 'none';
    });
  };

  statusFilter?.addEventListener('change', filterCases);
  visaFilter?.addEventListener('change', filterCases);

  // 고객명 클릭 시 고객 상세 페이지로 이동
  document.querySelectorAll('.customer-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
      const customerId = e.target.dataset.customerId;
      if (customerId) {
        window.selectedCustomerId = customerId;
        window.router.navigate('customer-detail');
      }
    });
  });
}

window.showCaseDetail = function (caseId) {
  const caseItem = cases.find(c => c.id === caseId);
  if (!caseItem) return;

  window.showModal(`케이스 상세: ${caseItem.customerName}`, `
    <div class="case-detail">
      <div class="detail-section">
        <h4>기본 정보</h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">비자 유형</span>
            <span class="detail-value">${caseItem.visaType}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">담당자</span>
            <span class="detail-value">${caseItem.assignee}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">시작일</span>
            <span class="detail-value">${caseItem.startDate}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">예상 완료일</span>
            <span class="detail-value">${caseItem.estimatedEnd}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h4>진행 단계</h4>
        <div class="timeline">
          ${processSteps.map(step => `
            <div class="timeline-item ${step.status}">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-title">${step.name}</div>
                <div class="timeline-date">${step.date}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `, { size: 'lg', hideFooter: true });
};
