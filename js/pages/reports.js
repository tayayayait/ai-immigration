/**
 * Reports Page
 * 리포트 페이지 - 실제 데이터 연동
 */

import { reportTemplates, reportHistory, customers, cases, documents } from '../data/mock-data.js';

// 리포트 통계 동적 계산
function calculateReportStats() {
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const thisMonthReports = reportHistory.filter(r => r.generatedAt.startsWith(thisMonth.replace('-', ''))).length;

  // 가장 많이 생성된 템플릿 찾기
  const templateCounts = {};
  reportHistory.forEach(r => {
    templateCounts[r.templateName] = (templateCounts[r.templateName] || 0) + 1;
  });
  const mostUsedTemplate = Object.entries(templateCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '없음';

  // 최근 생성일
  const latestReport = reportHistory.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))[0];
  const latestDate = latestReport ? latestReport.generatedAt.split(' ')[0] : '-';

  return {
    thisMonthCount: thisMonthReports || reportHistory.length,
    mostUsedTemplate,
    latestDate,
    totalReports: reportHistory.length
  };
}

export function renderReports() {
  const content = document.getElementById('pageContent');
  const reportStats = calculateReportStats();

  content.innerHTML = `
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">리포트</h1>
        <p class="page-subtitle">다양한 리포트를 생성하고 관리합니다</p>
      </div>
    </div>

      <div class="reports-layout">
      <!-- Report Templates -->
      <div class="card reports-templates">
        <div class="card-header">
          <h4 class="card-title">
            <i class="ph ph-file-plus"></i>
            리포트 생성
          </h4>
        </div>
        <div class="card-body">
          <div class="report-templates-grid">
            ${reportTemplates.map(template => `
              <div class="report-template-card" onclick="window.showGenerateReportModal('${template.id}')">
                <div class="template-icon ${template.type}">
                  <i class="ph ph-${getTemplateIcon(template.type)}"></i>
                </div>
                <div class="template-info">
                  <h5 class="template-name">${template.name}</h5>
                  <p class="template-description">${template.description}</p>
                </div>
                <button class="btn btn-ghost btn-sm">
                  <i class="ph ph-arrow-right"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Report History -->
      <div class="card reports-history">
        <div class="card-header">
          <h4 class="card-title">
            <i class="ph ph-clock-counter-clockwise"></i>
            생성 이력
          </h4>
          <div class="header-actions">
            <button class="btn btn-ghost btn-sm">
              <i class="ph ph-funnel"></i>
              필터
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>리포트명</th>
                  <th>생성일시</th>
                  <th>기간/대상</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                ${reportHistory.map(report => `
                  <tr>
                    <td>
                      <div class="report-name">
                        <i class="ph ph-file-pdf" style="color: var(--color-error);"></i>
                        <span>${report.templateName}</span>
                      </div>
                    </td>
                    <td>${report.generatedAt}</td>
                    <td>${report.period}</td>
                    <td>
                      <span class="badge badge-success">
                        <i class="ph ph-check"></i>
                        완료
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-ghost btn-sm" title="다운로드" onclick="window.downloadReport('${report.id}')">
                          <i class="ph ph-download-simple"></i>
                        </button>
                        <button class="btn-icon btn-ghost btn-sm" title="미리보기" onclick="window.previewReport('${report.id}')">
                          <i class="ph ph-eye"></i>
                        </button>
                        <button class="btn-icon btn-ghost btn-sm" title="공유" onclick="window.showToast('공유 링크가 복사되었습니다', 'success')">
                          <i class="ph ph-share-network"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quick Stats - 동적 계산 -->
      <div class="reports-sidebar reports-summary">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              <i class="ph ph-chart-pie-slice"></i>
              리포트 통계
            </h4>
          </div>
          <div class="card-body">
            <div class="report-stat">
              <span class="report-stat-label">총 생성 리포트</span>
              <span class="report-stat-value">${reportStats.totalReports}건</span>
            </div>
            <div class="report-stat">
              <span class="report-stat-label">가장 많이 생성</span>
              <span class="report-stat-value">${reportStats.mostUsedTemplate}</span>
            </div>
            <div class="report-stat">
              <span class="report-stat-label">최근 생성</span>
              <span class="report-stat-value">${reportStats.latestDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getTemplateIcon(type) {
  const icons = {
    'monthly': 'calendar',
    'customer': 'user',
    'analytics': 'chart-line',
    'annual': 'chart-bar'
  };
  return icons[type] || 'file-text';
}

window.showGenerateReportModal = function (templateId) {
  const template = reportTemplates.find(t => t.id === templateId);
  if (!template) return;

  // 고객 목록 동적 생성
  const customerOptions = customers.map(c =>
    `<option value="${c.id}">${c.name} (${c.visaType})</option>`
  ).join('');

  window.showModal(`리포트 생성: ${template.name}`, `
    <form class="report-form">
      <div class="form-group">
        <label class="form-label">리포트 유형</label>
        <input type="text" class="form-input" value="${template.name}" disabled>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">시작일</label>
          <input type="date" class="form-input" value="2024-12-01" required>
        </div>
        <div class="form-group">
          <label class="form-label">종료일</label>
          <input type="date" class="form-input" value="2024-12-31" required>
        </div>
      </div>
      ${template.type === 'customer' ? `
        <div class="form-group">
          <label class="form-label">고객 선택 <small style="color: var(--color-text-muted);">(${customers.length}명)</small></label>
          <select class="form-select" required>
            <option value="">고객을 선택하세요</option>
            ${customerOptions}
          </select>
        </div>
      ` : ''}
      <div class="form-group">
        <label class="form-label">출력 형식</label>
        <div class="radio-group">
          <label class="radio-item">
            <input type="radio" name="format" value="pdf" checked>
            <span>PDF</span>
          </label>
          <label class="radio-item">
            <input type="radio" name="format" value="excel">
            <span>Excel</span>
          </label>
        </div>
      </div>
    </form>
  `, { size: 'md' });

  document.getElementById('modalConfirm').textContent = '생성';
  document.getElementById('modalConfirm').onclick = () => {
    window.showToast('리포트 생성이 시작되었습니다. 완료 시 알림을 드립니다.', 'info');
    window.closeModal();

    // Simulate report generation
    setTimeout(() => {
      window.showToast('리포트가 생성되었습니다!', 'success');
    }, 2000);
  };
};

window.downloadReport = function (reportId) {
  window.showToast('리포트 다운로드를 시작합니다', 'info');
};

window.previewReport = function (reportId) {
  const report = reportHistory.find(r => r.id === reportId);
  if (!report) return;

  window.showModal(`리포트 미리보기: ${report.templateName}`, `
    <div class="report-preview">
      <div class="preview-header">
        <h3>${report.templateName}</h3>
        <p>기간: ${report.period}</p>
        <p>생성일: ${report.generatedAt}</p>
      </div>
      <div class="preview-content">
        <div class="preview-placeholder">
          <i class="ph ph-file-pdf" style="font-size: 64px; color: var(--color-error);"></i>
          <p>PDF 미리보기</p>
          <small>실제 환경에서는 PDF 뷰어가 표시됩니다</small>
        </div>
      </div>
    </div>
  `, { size: 'lg', hideFooter: true });
};
