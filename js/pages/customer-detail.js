/**
 * Customer Detail Page
 */

import { DataService } from '../services/data-service.js';
import { router } from '../router.js';

export async function renderCustomerDetail() {
  const customerId = window.selectedCustomerId;
  const content = document.getElementById('pageContent');

  if (!customerId) {
    router.navigate('customers');
    return;
  }

  // Loading state
  content.innerHTML = '<div class="loading-spinner"><i class="ph ph-spinner ph-spin"></i> 고객 상세 정보를 불러오는 중...</div>';

  try {
    const customer = await DataService.getCustomerById(customerId);
    const processSteps = await DataService.getProcessSteps(customerId);
    const consultations = await DataService.getConsultations(customerId);

    // Fill in default UI data if missing from DB for MVP smoothness
    const filledProcessSteps = processSteps.length > 0 ? processSteps : [
      { id: 1, name: '초기 상담', status: 'pending', date: '-' },
      { id: 2, name: '서류 준비', status: 'pending', date: '-' },
      { id: 3, name: 'I-140 접수', status: 'pending', date: '-' },
      { id: 4, name: 'I-140 심사', status: 'pending', date: '-' },
      { id: 5, name: 'I-485 접수', status: 'pending', date: '-' },
      { id: 6, name: '비자 발급', status: 'pending', date: '-' }
    ];

    renderDetailContent(customer, filledProcessSteps, consultations);

  } catch (error) {
    console.error('Customer Detail Error:', error);
    content.innerHTML = `<div class="error-state">고객 정보를 불러오는데 실패했습니다.<br>${error.message}</div>`;
  }
}

function renderDetailContent(customer, processSteps, consultationHistory) {
  const content = document.getElementById('pageContent');

  // Handle null checks safely
  const progress = customer.progress || 0;
  const currentStep = customer.current_step || '진행 전';
  const assignee = customer.assignee || '미지정';

  content.innerHTML = `
    <!-- Back Button -->
    <div style="margin-bottom: var(--space-6);">
      <button class="btn btn-ghost btn-sm" id="backToCustomers">
        <i class="ph ph-arrow-left"></i>
        고객 목록으로
      </button>
    </div>
    
    <!-- Customer Header -->
    <div class="customer-detail-header">
      <div class="customer-detail-avatar">${customer.name.charAt(0)}</div>
      <div class="customer-detail-info">
        <div class="customer-detail-name">
          ${customer.name}
          <span class="badge ${getBadgeClass(customer.visa_type)}">${customer.visa_type}</span>
          <span class="badge ${getStatusBadgeClass(customer.status)}">${getStatusLabel(customer.status)}</span>
        </div>
        <div class="customer-detail-meta">
          <div class="customer-detail-meta-item">
            <i class="ph ph-envelope"></i>
            ${customer.email || '-'}
          </div>
          <div class="customer-detail-meta-item">
            <i class="ph ph-phone"></i>
            ${customer.phone || '-'}
          </div>
          <div class="customer-detail-meta-item">
            <i class="ph ph-user"></i>
            담당: ${assignee}
          </div>
        </div>
      </div>
      <div class="customer-detail-actions">
        <button class="btn btn-secondary btn-md">
          <i class="ph ph-pencil-simple"></i>
          수정
        </button>
        <button class="btn btn-secondary btn-md">
          <i class="ph ph-chat-circle"></i>
          메시지
        </button>
        <button class="btn btn-primary btn-md">
          <i class="ph ph-phone"></i>
          통화
        </button>
      </div>
    </div>
    
    <!-- Progress Section -->
    <div class="card" style="margin-bottom: var(--space-6);">
      <div class="card-header">
        <div>
          <h3 class="card-title">수속 진행 현황</h3>
          <p class="card-subtitle">현재 단계: ${currentStep}</p>
        </div>
        <div class="progress-with-label" style="width: 200px;">
          <div class="progress">
            <div class="progress-bar" style="width: ${progress}%;"></div>
          </div>
          <span class="progress-label">${progress}%</span>
        </div>
      </div>
      <div class="card-body">
        <!-- Stepper -->
        <div class="stepper" style="margin-top: var(--space-4);">
          ${processSteps.map((step, index) => renderStepperItem(step, index === processSteps.length - 1)).join('')}
        </div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="tabs" id="detailTabs">
      <div class="tab active" data-tab="timeline">상담 이력</div>
      <div class="tab" data-tab="documents">서류 현황</div>
      <div class="tab" data-tab="ai-analysis">AI 분석</div>
      <div class="tab" data-tab="payments">결제 내역</div>
    </div>
    
    <!-- Tab Content -->
    <div class="tab-content" id="tabContent">
      ${renderTimelineTab(consultationHistory)}
    </div>
  `;

  setupDetailEvents(consultationHistory);
}

function renderStepperItem(step, isLast) {
  return `
    <div class="stepper-item ${step.status}">
      <div class="stepper-circle">
        ${step.status === 'completed' ? '<i class="ph ph-check"></i>' : (step.order_index || step.id)}
      </div>
      <div class="stepper-label">${step.step_name || step.name}<br><small style="color: var(--color-text-muted);">${step.completed_date || step.date || '-'}</small></div>
    </div>
  `;
}

function renderTimelineTab(consultations) {
  const recentConsultationHtml = consultations && consultations.length > 0
    ? consultations.slice(0, 2).map(c => `
      <div style="padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border);">
        <div style="font-size: var(--text-xs); color: var(--color-text-muted);">${c.date}</div>
        <div style="font-size: var(--text-sm); font-weight: var(--font-medium);">${c.title}</div>
      </div>
    `).join('')
    : '<div class="text-sm text-gray-500 py-2">상담 내역이 없습니다.</div>';

  return `
    <div class="grid grid-cols-3">
      <div class="col-span-2">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">활동 타임라인</h4>
            <button class="btn btn-ghost btn-sm">
              <i class="ph ph-plus"></i>
              메모 추가
            </button>
          </div>
          <div class="card-body">
            <div class="process-timeline">
              ${renderTimelineItems()}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">빠른 메모</h4>
          </div>
          <div class="card-body">
            <textarea class="form-input form-textarea" placeholder="메모를 입력하세요..." style="min-height: 100px;"></textarea>
            <button class="btn btn-primary btn-sm w-full" style="margin-top: var(--space-3);">
              <i class="ph ph-floppy-disk"></i>
              저장
            </button>
          </div>
        </div>
        
        <div class="card" style="margin-top: var(--space-4);">
          <div class="card-header">
            <h4 class="card-title">최근 상담</h4>
          </div>
          <div class="card-body">
            ${recentConsultationHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTimelineItems() {
  // Still using mock timeline items for now as we didn't mock activities fully
  const items = [
    { status: 'current', title: 'I-140 심사 중', date: '진행 중', description: '청원서 심사 진행 중' },
    { status: 'completed', title: 'I-140 접수', date: '2024-10-10', description: '청원서 접수 완료, 영수증 번호 발급' },
  ];

  return items.map(item => `
    <div class="timeline-item ${item.status}">
      <div class="timeline-marker">
        ${item.status === 'completed' ? '<i class="ph ph-check"></i>' :
      item.status === 'current' ? '<i class="ph ph-circle-notch"></i>' : ''}
      </div>
      <div class="timeline-content">
        <div class="timeline-title">${item.title}</div>
        <div class="timeline-date">${item.date}</div>
        <div class="timeline-description">${item.description}</div>
      </div>
    </div>
  `).join('');
}

function setupDetailEvents(consultations) {
  // Back button
  document.getElementById('backToCustomers')?.addEventListener('click', () => {
    router.navigate('customers');
  });

  // Tab switching
  document.querySelectorAll('#detailTabs .tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('#detailTabs .tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');

      const tabId = e.target.dataset.tab;
      const tabContent = document.getElementById('tabContent');

      if (tabId === 'timeline') {
        tabContent.innerHTML = renderTimelineTab(consultations);
      } else if (tabId === 'documents') {
        tabContent.innerHTML = renderDocumentsTab();
      } else if (tabId === 'ai-analysis') {
        tabContent.innerHTML = renderAIAnalysisTab();
      } else {
        tabContent.innerHTML = renderEmptyTab(tabId);
      }
    });
  });
}

function renderDocumentsTab() {
  const documents = [
    { name: '여권 사본', status: 'completed', date: '2024-08-20' },
    { name: '학위증명서', status: 'completed', date: '-', status: 'pending' },
  ];

  // OCR Upload Handler is global, ensuring it works
  window.handleFileUpload = async (input) => {
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    window.showToast('문서 분석 중입니다... 잠시만 기다려주세요.', 'info');

    try {
      // Use local proxy
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('OCR Failed');

      const data = await response.json();

      window.showModal('문서 분석 결과 (OCR)', `
        <div style="max-height: 400px; overflow-y: auto;">
          <h4 style="margin-bottom: 10px; font-weight: bold;">[${file.name}] 분석 결과</h4>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
             <pre style="white-space: pre-wrap; font-family: inherit; font-size: 14px; color: #333;">${data.text}</pre>
          </div>
          <div style="margin-top: 15px; text-align: right;">
            <button class="btn btn-primary btn-sm" onclick="window.closeModal()">확인</button>
          </div>
        </div>
      `, { size: 'lg', hideFooter: true });

      window.showToast('문서 분석 완료!', 'success');

    } catch (error) {
      console.error('OCR Error:', error);
      window.showToast('문서 분석에 실패했습니다. 관리자에게 문의하세요.', 'error');
    }

    // Reset input
    input.value = '';
  };

  return `
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">제출 서류 현황</h4>
        <label class="btn btn-primary btn-sm" style="cursor: pointer;">
          <i class="ph ph-scan"></i> 문서 업로드 및 OCR 분석
          <input type="file" style="display: none;" accept="image/*" onchange="window.handleFileUpload(this)">
        </label>
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>서류명</th>
              <th>상태</th>
              <th>제출일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            ${documents.map(doc => `
              <tr>
                <td><i class="ph ph-file-text" style="margin-right: var(--space-2);"></i>${doc.name}</td>
                <td><span class="badge ${doc.status === 'completed' ? 'badge-success' : 'badge-warning'}">${doc.status === 'completed' ? '완료' : '대기'}</span></td>
                <td>${doc.date || '-'}</td>
                <td><button class="btn btn-ghost btn-sm"><i class="ph ph-download"></i></button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAIAnalysisTab() {
  return `
    <div class="grid grid-cols-2">
      <div class="card ai-card">
        <div class="card-header">
          <div class="ai-card-header">
            <i class="ph ph-robot"></i>
            <span>케이스 분석</span>
          </div>
        </div>
        <div class="card-body">
          <div class="alert alert-success" style="margin-bottom: var(--space-4);">
            <i class="ph ph-check-circle alert-icon"></i>
            <div class="alert-content">
              <div class="alert-title">승인 가능성: 높음 (85%)</div>
              <div class="alert-message">유사 케이스 분석 결과, 승인 가능성이 높습니다.</div>
            </div>
          </div>
          <h5 style="font-weight: var(--font-semibold); margin-bottom: var(--space-3);">강점</h5>
          <ul style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-4);">
            <li style="margin-bottom: var(--space-2);">• 우수한 학술 실적</li>
            <li style="margin-bottom: var(--space-2);">• 독립적인 추천서 4부 확보</li>
          </ul>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">유사 성공 사례</h4>
        </div>
        <div class="card-body">
           <div class="text-sm text-gray-500">데이터를 수집 중입니다.</div>
        </div>
      </div>
    </div>
  `;
}

function renderEmptyTab(tabName) {
  const labels = {
    'payments': '결제 내역'
  };

  return `
    <div class="card">
      <div class="empty-state">
        <i class="ph ph-folder-open empty-state-icon"></i>
        <div class="empty-state-title">${labels[tabName] || tabName}</div>
        <div class="empty-state-message">아직 데이터가 없습니다.</div>
      </div>
    </div>
  `;
}

function getBadgeClass(visaType) {
  const classes = {
    'NIW': 'badge-niw',
    'EB-1': 'badge-eb1',
    'EB-5': 'badge-eb5',
    'H-1B': 'badge-h1b',
    'F-1': 'badge-f1'
  };
  return classes[visaType] || 'badge-neutral';
}

function getStatusBadgeClass(status) {
  const classes = {
    'in-progress': 'badge-info',
    'pending': 'badge-warning',
    'completed': 'badge-success'
  };
  return classes[status] || 'badge-neutral';
}

function getStatusLabel(status) {
  const labels = {
    'in-progress': '진행중',
    'pending': '대기',
    'completed': '완료'
  };
  return labels[status] || status;
}
