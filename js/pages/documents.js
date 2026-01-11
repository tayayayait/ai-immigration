/**
 * Documents Management Page
 * 서류 관리 페이지
 */

import { documents, customers } from '../data/mock-data.js';

export function renderDocuments() {
  const content = document.getElementById('pageContent');

  const statusLabels = {
    'approved': { text: '승인됨', class: 'badge-success' },
    'pending': { text: '대기중', class: 'badge-warning' },
    'in-progress': { text: '검토중', class: 'badge-info' }
  };

  content.innerHTML = `
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">서류 관리</h1>
        <p class="page-subtitle">고객별 서류 현황을 관리합니다</p>
      </div>
      <button class="btn btn-primary" onclick="window.showUploadModal()">
        <i class="ph ph-upload-simple"></i>
        서류 업로드
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid" style="margin-bottom: var(--space-6);">
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-success-light); color: var(--color-success);">
          <i class="ph ph-check-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${documents.filter(d => d.status === 'approved').length}</div>
          <div class="stat-label">승인된 서류</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-warning-light); color: var(--color-warning);">
          <i class="ph ph-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${documents.filter(d => d.status === 'pending').length}</div>
          <div class="stat-label">대기중 서류</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-info-light); color: var(--color-info);">
          <i class="ph ph-magnifying-glass"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${documents.filter(d => d.status === 'in-progress').length}</div>
          <div class="stat-label">검토중 서류</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: var(--color-primary-light); color: var(--color-primary);">
          <i class="ph ph-files"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">${documents.length}</div>
          <div class="stat-label">전체 서류</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card" style="margin-bottom: var(--space-4);">
      <div class="filters-row">
        <div class="filter-group">
          <select class="form-select" id="docStatusFilter">
            <option value="">전체 상태</option>
            <option value="approved">승인됨</option>
            <option value="pending">대기중</option>
            <option value="in-progress">검토중</option>
          </select>
          <select class="form-select" id="docCustomerFilter">
            <option value="">전체 고객</option>
            ${[...new Set(documents.map(d => d.customerName))].map(name =>
    `<option value="${name}">${name}</option>`
  ).join('')}
          </select>
        </div>
        <div class="search-bar" style="max-width: 300px;">
          <i class="ph ph-magnifying-glass search-icon"></i>
          <input type="text" class="search-input" id="docSearchInput" placeholder="서류 검색...">
        </div>
      </div>
    </div>

    <!-- Documents Table -->
    <div class="card">
      <div class="table-container">
        <table class="data-table documents-table" id="documentsTable">
          <thead>
            <tr>
              <th style="width: 25%;">서류명</th>
              <th style="width: 15%;">고객명</th>
              <th style="width: 12%;">상태</th>
              <th style="width: 18%;">업로드일</th>
              <th style="width: 18%;">만료일</th>
              <th style="width: 12%;">작업</th>
            </tr>
          </thead>
          <tbody>
            ${documents.map(doc => `
              <tr data-id="${doc.id}" data-status="${doc.status}" data-customer="${doc.customerName}">
                <td>
                  <div class="doc-name">
                    <i class="ph ph-file-text" style="color: var(--color-primary);"></i>
                    <span>${doc.docType}</span>
                  </div>
                </td>
                <td><span class="customer-link" data-customer-id="${doc.customerId}" style="color: var(--color-primary); cursor: pointer; text-decoration: underline;">${doc.customerName}</span></td>
                <td><span class="badge ${statusLabels[doc.status].class}">${statusLabels[doc.status].text}</span></td>
                <td>${doc.uploadDate}</td>
                <td>${doc.expiryDate || '-'}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon btn-ghost btn-sm" title="다운로드" onclick="window.showToast('다운로드를 시작합니다', 'info')">
                      <i class="ph ph-download-simple"></i>
                    </button>
                    <button class="btn-icon btn-ghost btn-sm" title="미리보기" onclick="window.showToast('미리보기 기능 준비 중', 'info')">
                      <i class="ph ph-eye"></i>
                    </button>
                    <button class="btn-icon btn-ghost btn-sm" title="삭제" onclick="window.showToast('삭제 권한이 필요합니다', 'warning')">
                      <i class="ph ph-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setupDocumentFilters();
}

function setupDocumentFilters() {
  const statusFilter = document.getElementById('docStatusFilter');
  const customerFilter = document.getElementById('docCustomerFilter');
  const searchInput = document.getElementById('docSearchInput');

  const filterTable = () => {
    const status = statusFilter.value;
    const customer = customerFilter.value;
    const search = searchInput.value.toLowerCase();

    document.querySelectorAll('#documentsTable tbody tr').forEach(row => {
      const matchStatus = !status || row.dataset.status === status;
      const matchCustomer = !customer || row.dataset.customer === customer;
      const matchSearch = !search || row.textContent.toLowerCase().includes(search);

      row.style.display = matchStatus && matchCustomer && matchSearch ? '' : 'none';
    });
  };

  statusFilter?.addEventListener('change', filterTable);
  customerFilter?.addEventListener('change', filterTable);
  searchInput?.addEventListener('input', filterTable);

  // 고객명 클릭 시 고객 상세 페이지로 이동
  document.querySelectorAll('.customer-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const customerId = e.target.dataset.customerId;
      if (customerId) {
        window.selectedCustomerId = customerId;
        window.router.navigate('customer-detail');
      }
    });
  });
}

// Upload Modal
window.showUploadModal = function () {
  window.showModal('서류 업로드', `
    <form class="upload-form">
      <div class="form-group">
        <label class="form-label">고객 선택</label>
        <select class="form-select" required>
          <option value="">고객을 선택하세요</option>
          ${[...new Set(documents.map(d => d.customerName))].map(name =>
    `<option value="${name}">${name}</option>`
  ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">서류 종류</label>
        <select class="form-select" required>
          <option value="">서류 종류 선택</option>
          <option value="passport">여권 사본</option>
          <option value="degree">학위 증명서</option>
          <option value="recommendation">추천서</option>
          <option value="resume">이력서</option>
          <option value="other">기타</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">파일 선택</label>
        <div class="file-upload-area" onclick="this.querySelector('input').click()">
          <input type="file" style="display: none;" accept=".pdf,.doc,.docx,.jpg,.png">
          <i class="ph ph-cloud-arrow-up" style="font-size: 48px; color: var(--color-primary);"></i>
          <p>클릭하여 파일을 선택하거나 드래그하여 업로드하세요</p>
          <small style="color: var(--color-text-muted);">PDF, DOC, DOCX, JPG, PNG (최대 10MB)</small>
        </div>
      </div>
    </form>
  `, { size: 'md' });

  document.getElementById('modalConfirm').onclick = () => {
    window.showToast('서류가 업로드되었습니다', 'success');
    window.closeModal();
  };
};
