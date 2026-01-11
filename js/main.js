/**
 * Main Application Entry Point
 * AI Immigration Management System
 */

import { router } from './router.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderCustomers } from './pages/customers.js';
import { renderCustomerDetail } from './pages/customer-detail.js';
import { renderAIConsultation } from './pages/ai-consultation.js';
import { renderLogin } from './pages/login.js';
import { aiResponseTemplates } from './data/mock-data.js';
import { supabase } from './supabase.js';

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    initNavigation();
    initChatbot();
    initModal();
    initMobileMenu();

    // Render initial page
    const path = window.location.hash.slice(1) || 'dashboard';
    router.navigate(path);
});

// ===== Router Setup =====
function initRouter() {
    router.register('login', renderLogin);
    router.register('dashboard', renderDashboard);
    router.register('customers', renderCustomers);
    router.register('customer-detail', renderCustomerDetail);
    router.register('ai-consultation', renderAIConsultation);
    router.register('documents', renderEmptyPage('서류 관리', 'files'));
    router.register('cases', renderEmptyPage('케이스 현황', 'folder-open'));
    router.register('calendar', renderEmptyPage('일정 관리', 'calendar'));
    router.register('analytics', renderEmptyPage('통계/분석', 'chart-line'));
    router.register('reports', renderEmptyPage('리포트', 'file-text'));
}

function renderEmptyPage(title, icon) {
    return () => {
        const content = document.getElementById('pageContent');
        content.innerHTML = `
      <div class="card">
        <div class="empty-state">
          <i class="ph ph-${icon} empty-state-icon"></i>
          <div class="empty-state-title">${title}</div>
          <div class="empty-state-message">이 기능은 곧 제공될 예정입니다.</div>
          <button class="btn btn-primary btn-md" onclick="window.router.navigate('dashboard')">
            대시보드로 이동
          </button>
        </div>
      </div>
    `;
    };
}

// ===== Navigation Setup =====
function initNavigation() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            router.navigate(page);
            closeMobileMenu();
        });
    });

    // Logout Button Handler
    document.querySelector('.user-profile .btn-icon')?.setAttribute('onclick', ''); // clear inline alert
    document.querySelector('.user-profile .btn-icon')?.addEventListener('click', async () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            const { error } = await supabase.auth.signOut();
            if (!error) {
                window.showToast('로그아웃 되었습니다.', 'success');
                router.navigate('login');
            }
        }
    });

    // Expose router globally for inline handlers
    window.router = router;
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    menuBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay?.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebarOverlay')?.classList.remove('active');
}

// ===== Chatbot =====
function initChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const container = document.getElementById('chatbotContainer');
    const closeBtn = document.getElementById('closeChatbot');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    const messagesContainer = document.getElementById('chatbotMessages');
    const quickActions = document.getElementById('quickActions');

    // Toggle chatbot
    toggle?.addEventListener('click', () => {
        container.classList.toggle('open');
        toggle.classList.toggle('active');

        // Add welcome message on first open
        if (container.classList.contains('open') && messagesContainer.children.length === 0) {
            addChatMessage('ai', '안녕하세요! AI 상담 어시스턴트입니다. 이민 수속에 관해 궁금하신 점을 물어보세요.');
        }
    });

    closeBtn?.addEventListener('click', () => {
        container.classList.remove('open');
        toggle.classList.remove('active');
    });

    // Input handling
    input?.addEventListener('input', () => {
        sendBtn.disabled = !input.value.trim();
        adjustTextareaHeight(input);
    });

    input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    sendBtn?.addEventListener('click', sendChatMessage);

    // Quick actions
    quickActions?.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.textContent;
            sendBtn.disabled = false;
            sendChatMessage();
        });
    });
}

// Real API Integration using /api/chat Serverless Function
async function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();

    if (!message) return;

    addChatMessage('user', message);
    input.value = '';
    document.getElementById('chatbotSend').disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
        // Call Vercel Serverless Function
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'You are a helpful immigration assistant. Answer briefly and professionally in Korean.' },
                    { role: 'user', content: message }
                ]
            })
        });

        const data = await response.json();

        hideTypingIndicator();

        if (data.content) {
            addChatMessage('ai', data.content);
        } else {
            throw new Error('No content in response');
        }

    } catch (error) {
        console.error('Chat API Error:', error);
        hideTypingIndicator();
        // Fallback to local mock response on error
        const fallbackResponse = generateChatbotResponse(message);
        addChatMessage('ai', `(API 연결 실패 - 오프라인 모드)\n${fallbackResponse}`);
    } finally {
        document.getElementById('chatbotSend').disabled = false;
    }
}

function addChatMessage(role, content) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const message = document.createElement('div');
    message.className = `message message-${role}`;

    const avatar = role === 'user'
        ? '<div class="message-avatar">나</div>'
        : '<div class="message-avatar"><i class="ph ph-robot"></i></div>';

    message.innerHTML = `
    ${avatar}
    <div class="message-content">
      <div class="message-bubble">${content.replace(/\n/g, '<br>')}</div>
      <div class="message-time">${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `;

    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Hide quick actions after first message
    if (role === 'user') {
        document.getElementById('quickActions')?.classList.add('hidden');
        document.getElementById('quickActions').style.display = 'none';
    }
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    const indicator = document.createElement('div');
    indicator.className = 'message message-ai';
    indicator.id = 'chatTypingIndicator';
    indicator.innerHTML = `
    <div class="message-avatar"><i class="ph ph-robot"></i></div>
    <div class="message-content">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
    messagesContainer.appendChild(indicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('chatTypingIndicator')?.remove();
}

function generateChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Check for keyword matches
    for (const template of aiResponseTemplates) {
        if (lowerMessage.includes(template.trigger.toLowerCase())) {
            return template.responses[Math.floor(Math.random() * template.responses.length)];
        }
    }

    // Default responses
    const defaultResponses = [
        '네, 말씀하신 내용을 확인했습니다. 더 자세한 상담이 필요하시면 담당 상담사와 연결해 드릴까요?',
        '해당 문의에 대해 안내해 드리겠습니다. 추가 질문이 있으시면 말씀해 주세요.',
        '이 부분은 케이스에 따라 다를 수 있습니다. 정확한 안내를 위해 고객님의 상황을 더 자세히 알려주시겠어요?'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// ===== Modal =====
function initModal() {
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('modalCancel');

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Expose globally
    window.showModal = showModal;
    window.closeModal = closeModal;
}

function showModal(title, content, options = {}) {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('modal');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    const footerEl = document.getElementById('modalFooter');

    titleEl.textContent = title;
    bodyEl.innerHTML = content;

    // Size
    modal.className = `modal modal-${options.size || 'md'}`;

    // Footer
    if (options.hideFooter) {
        footerEl.style.display = 'none';
    } else {
        footerEl.style.display = '';
    }

    overlay.classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay')?.classList.remove('active');
}

// ===== Toast Notifications =====
window.showToast = function (message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';

    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'warning',
        info: 'info'
    };

    toast.innerHTML = `
    <i class="ph ph-${icons[type] || 'info'}" style="font-size: 20px;"></i>
    <span style="flex: 1;">${message}</span>
    <button onclick="this.parentElement.remove()" style="opacity: 0.7;">
      <i class="ph ph-x"></i>
    </button>
  `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 200);
    }, 5000);
};
