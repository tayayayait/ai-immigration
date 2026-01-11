/**
 * Calendar Management Page
 * 일정 관리 페이지
 */

import { calendarEvents } from '../data/mock-data.js';

export function renderCalendar() {
  const content = document.getElementById('pageContent');
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const eventTypeColors = {
    'consultation': { bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: '상담' },
    'deadline': { bg: 'var(--color-error-light)', color: 'var(--color-error)', label: '마감' },
    'task': { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: '업무' },
    'meeting': { bg: 'var(--color-info-light)', color: 'var(--color-info)', label: '미팅' }
  };

  const todayEvents = calendarEvents.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.toDateString() === today.toDateString();
  });

  const upcomingEvents = calendarEvents.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= today;
  }).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);

  content.innerHTML = `
    <div class="page-header">
      <div class="page-header-content">
        <h1 class="page-title">일정 관리</h1>
        <p class="page-subtitle">상담 일정과 마감일을 관리합니다</p>
      </div>
      <button class="btn btn-primary" onclick="window.showAddEventModal()">
        <i class="ph ph-plus"></i>
        일정 추가
      </button>
    </div>

    <div class="calendar-layout">
      <!-- Main Calendar -->
      <div class="calendar-main">
        <div class="card">
          <div class="calendar-header">
            <button class="btn btn-ghost btn-sm" onclick="window.changeMonth(-1)">
              <i class="ph ph-caret-left"></i>
            </button>
            <h3 class="calendar-month-title" id="calendarMonthTitle">
              ${currentYear}년 ${currentMonth + 1}월
            </h3>
            <button class="btn btn-ghost btn-sm" onclick="window.changeMonth(1)">
              <i class="ph ph-caret-right"></i>
            </button>
          </div>
          
          <div class="calendar-grid" id="calendarGrid">
            <div class="weekday-header">일</div>
            <div class="weekday-header">월</div>
            <div class="weekday-header">화</div>
            <div class="weekday-header">수</div>
            <div class="weekday-header">목</div>
            <div class="weekday-header">금</div>
            <div class="weekday-header">토</div>
            ${generateCalendarDays(currentYear, currentMonth)}
          </div>
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="calendar-sidebar">
        <!-- Today's Events -->
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              <i class="ph ph-calendar-check"></i>
              오늘의 일정
            </h4>
          </div>
          <div class="card-body">
            ${todayEvents.length > 0 ? todayEvents.map(event => `
              <div class="event-item" style="border-left: 3px solid ${eventTypeColors[event.type].color};">
                <div class="event-time">${event.time || '종일'}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-description">${event.description}</div>
              </div>
            `).join('') : `
              <div class="empty-state-sm">
                <i class="ph ph-calendar-blank"></i>
                <p>오늘 예정된 일정이 없습니다</p>
              </div>
            `}
          </div>
        </div>
        
        <!-- Upcoming Events -->
        <div class="card" style="margin-top: var(--space-4);">
          <div class="card-header">
            <h4 class="card-title">
              <i class="ph ph-clock-countdown"></i>
              다가오는 일정
            </h4>
          </div>
          <div class="card-body">
            ${upcomingEvents.map(event => `
              <div class="upcoming-event">
                <div class="upcoming-date">
                  <span class="upcoming-day">${new Date(event.date).getDate()}</span>
                  <span class="upcoming-month">${new Date(event.date).getMonth() + 1}월</span>
                </div>
                <div class="upcoming-info">
                  <div class="upcoming-title">${event.title}</div>
                  <span class="badge" style="background: ${eventTypeColors[event.type].bg}; color: ${eventTypeColors[event.type].color};">
                    ${eventTypeColors[event.type].label}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Legend -->
        <div class="card" style="margin-top: var(--space-4);">
          <div class="card-header">
            <h4 class="card-title">범례</h4>
          </div>
          <div class="card-body">
            <div class="legend-items">
              ${Object.entries(eventTypeColors).map(([key, value]) => `
                <div class="legend-item">
                  <span class="legend-color" style="background: ${value.color};"></span>
                  <span>${value.label}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Store current state
  window.calendarState = { year: currentYear, month: currentMonth };
}

function generateCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  let html = '';

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day empty"></div>';
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = calendarEvents.filter(e => e.date === dateStr);
    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

    html += `
      <div class="calendar-day ${isToday ? 'today' : ''} ${dayEvents.length ? 'has-events' : ''}" data-date="${dateStr}">
        <span class="day-number">${day}</span>
        ${dayEvents.length > 0 ? `
          <div class="day-events">
            ${dayEvents.slice(0, 2).map(e => `
              <div class="day-event" style="background: ${getEventColor(e.type)};" title="${e.title}"></div>
            `).join('')}
            ${dayEvents.length > 2 ? `<span class="more-events">+${dayEvents.length - 2}</span>` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  return html;
}

function getEventColor(type) {
  const colors = {
    'consultation': 'var(--color-primary)',
    'deadline': 'var(--color-error)',
    'task': 'var(--color-warning)',
    'meeting': 'var(--color-info)'
  };
  return colors[type] || 'var(--color-primary)';
}

window.changeMonth = function (delta) {
  window.calendarState.month += delta;
  if (window.calendarState.month > 11) {
    window.calendarState.month = 0;
    window.calendarState.year++;
  } else if (window.calendarState.month < 0) {
    window.calendarState.month = 11;
    window.calendarState.year--;
  }

  document.getElementById('calendarMonthTitle').textContent =
    `${window.calendarState.year}년 ${window.calendarState.month + 1}월`;

  // Re-render the entire calendar grid with weekday headers
  const calendarGrid = document.getElementById('calendarGrid');
  calendarGrid.innerHTML = `
    <div class="weekday-header">일</div>
    <div class="weekday-header">월</div>
    <div class="weekday-header">화</div>
    <div class="weekday-header">수</div>
    <div class="weekday-header">목</div>
    <div class="weekday-header">금</div>
    <div class="weekday-header">토</div>
    ${generateCalendarDays(window.calendarState.year, window.calendarState.month)}
  `;
};

window.showAddEventModal = function () {
  window.showModal('새 일정 추가', `
    <form class="event-form">
      <div class="form-group">
        <label class="form-label">일정 제목</label>
        <input type="text" class="form-input" placeholder="일정 제목을 입력하세요" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">날짜</label>
          <input type="date" class="form-input" required>
        </div>
        <div class="form-group">
          <label class="form-label">시간</label>
          <input type="time" class="form-input">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">유형</label>
        <select class="form-select" required>
          <option value="consultation">상담</option>
          <option value="deadline">마감</option>
          <option value="task">업무</option>
          <option value="meeting">미팅</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">고객 (선택)</label>
        <input type="text" class="form-input" placeholder="관련 고객명">
      </div>
      <div class="form-group">
        <label class="form-label">설명</label>
        <textarea class="form-textarea" rows="3" placeholder="일정 상세 내용"></textarea>
      </div>
    </form>
  `, { size: 'md' });

  document.getElementById('modalConfirm').onclick = () => {
    window.showToast('일정이 추가되었습니다', 'success');
    window.closeModal();
  };
};
