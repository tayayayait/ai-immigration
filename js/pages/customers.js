/**
 * Customers Page
 */

import { customers } from '../data/mock-data.js';
import { router } from '../router.js';

export function renderCustomers() {
    const content = document.getElementById('pageContent');

    content.innerHTML = `
    <!-- Toolbar -->
    <div class="customers-toolbar">
      <div class="customers-filters">
        <div class="input-with-icon" style="width: 280px;">
          <i class="ph ph-magnifying-glass"></i>
          <input type="text" class="form-input" placeholder="고객명, 이메일로 검색..." id="customerSearch">
        </div>
        <select class="filter-select" id="visaFilter">
          <option value="">전체 비자</option>
          <option value="NIW">NIW</option>
          <option value="EB-1">EB-1</option>
          <option value="EB-5">EB-5</option>
          <option value="H-1B">H-1B</option>
          <option value="F-1">F-1/OPT</option>
        </select>
        <select class="filter-select" id="statusFilter">
          <option value="">전체 상태</option>
          <option value="in-progress">진행중</option>
          <option value="pending">대기</option>
          <option value="completed">완료</option>
        </select>
      </div>
      <button class="btn btn-primary btn-md" id="addCustomerBtn">
        <i class="ph ph-plus"></i>
        고객 추가
      </button>
    </div>
    
    <!-- Customer Table -->
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th style="width: 48px;"><input type="checkbox" id="selectAll"></th>
            <th>고객</th>
            <th>비자 유형</th>
            <th>진행 상태</th>
            <th>현재 단계</th>
            <th>담당자</th>
            <th>최근 연락</th>
            <th style="width: 100px;">액션</th>
          </tr>
        </thead>
        <tbody id="customerTableBody">
          ${customers.map(customer => renderCustomerRow(customer)).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-6);">
      <div style="font-size: var(--text-sm); color: var(--color-text-secondary);">
        총 ${customers.length}명의 고객
      </div>
      <div class="flex gap-2">
        <button class="btn btn-secondary btn-sm" disabled>
          <i class="ph ph-caret-left"></i>
        </button>
        <button class="btn btn-primary btn-sm">1</button>
        <button class="btn btn-secondary btn-sm">2</button>
        <button class="btn btn-secondary btn-sm">3</button>
        <button class="btn btn-secondary btn-sm">
          <i class="ph ph-caret-right"></i>
        </button>
      </div>
    </div>
  `;

    // 이벤트 리스너 추가
    setupCustomerEvents();
}

function renderCustomerRow(customer) {
    const visaBadgeClass = {
        'NIW': 'badge-niw',
        'EB-1': 'badge-eb1',
        'EB-5': 'badge-eb5',
        'H-1B': 'badge-h1b',
        'F-1': 'badge-f1'
    };

    const statusBadgeClass = {
        'in-progress': 'badge-info',
        'pending': 'badge-warning',
        'completed': 'badge-success'
    };

    const statusLabel = {
        'in-progress': '진행중',
        'pending': '대기',
        'completed': '완료'
    };

    return `
    <tr data-customer-id="${customer.id}">
      <td><input type="checkbox" class="customer-checkbox"></td>
      <td>
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <div class="customer-avatar" style="width: 36px; height: 36px; font-size: var(--text-sm);">
            ${customer.name.charAt(0)}
          </div>
          <div>
            <div style="font-weight: var(--font-medium);">${customer.name}</div>
            <div style="font-size: var(--text-xs); color: var(--color-text-muted);">${customer.email}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${visaBadgeClass[customer.visaType] || 'badge-neutral'}">${customer.visaType}</span></td>
      <td><span class="badge ${statusBadgeClass[customer.status]}">${statusLabel[customer.status]}</span></td>
      <td>${customer.currentStep}</td>
      <td>${customer.assignee}</td>
      <td>${customer.lastContact}</td>
      <td>
        <div class="flex gap-1">
          <button class="btn btn-icon btn-ghost btn-sm view-customer" title="상세 보기">
            <i class="ph ph-eye"></i>
          </button>
          <button class="btn btn-icon btn-ghost btn-sm" title="수정">
            <i class="ph ph-pencil-simple"></i>
          </button>
          <button class="btn btn-icon btn-ghost btn-sm" title="더보기">
            <i class="ph ph-dots-three"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function setupCustomerEvents() {
    // 고객 상세 보기
    document.querySelectorAll('.view-customer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const customerId = row.dataset.customerId;
            window.selectedCustomerId = customerId;
            router.navigate('customer-detail');
        });
    });

    // 고객 추가 버튼
    document.getElementById('addCustomerBtn')?.addEventListener('click', () => {
        window.showModal('새 고객 추가', `
      <form class="flex flex-col gap-4">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">이름 <span class="required">*</span></label>
          <input type="text" class="form-input" placeholder="고객 이름">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">이메일 <span class="required">*</span></label>
          <input type="email" class="form-input" placeholder="example@email.com">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">연락처</label>
          <input type="tel" class="form-input" placeholder="010-0000-0000">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label">비자 유형 <span class="required">*</span></label>
          <select class="filter-select" style="width: 100%;">
            <option value="">선택하세요</option>
            <option value="NIW">NIW</option>
            <option value="EB-1">EB-1</option>
            <option value="EB-5">EB-5</option>
            <option value="H-1B">H-1B</option>
            <option value="F-1">F-1/OPT</option>
          </select>
        </div>
      </form>
    `);
    });

    // 검색 기능
    document.getElementById('customerSearch')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        filterCustomerTable(query);
    });
}

function filterCustomerTable(query) {
    const rows = document.querySelectorAll('#customerTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}
