/**
 * AI Consultation Page
 */

import { consultationHistory, similarCases, customers } from '../data/mock-data.js';

export function renderAIConsultation() {
  const content = document.getElementById('pageContent');

  content.innerHTML = `
    <div class="ai-consultation-layout">
      <!-- Left Sidebar: Consultation History -->
      <div class="consultation-sidebar">
        <div class="consultation-sidebar-header">
          <span class="consultation-sidebar-title">상담 이력</span>
          <button class="btn btn-icon btn-ghost btn-sm">
            <i class="ph ph-plus"></i>
          </button>
        </div>
        <div class="consultation-list">
          ${consultationHistory.map((item, index) => `
            <div class="consultation-item ${index === 0 ? 'active' : ''}" data-id="${item.id}">
              <div class="consultation-item-date">${item.date}</div>
              <div class="consultation-item-title">${item.title}</div>
              <div class="consultation-item-preview">${item.preview}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Main Chat Area -->
      <div class="consultation-main">
        <div class="consultation-chat-header">
          <div class="consultation-chat-info">
            <div class="consultation-customer-avatar">홍</div>
            <div>
              <div class="consultation-customer-name">홍길동</div>
              <div class="consultation-customer-visa">NIW 진행중</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm">
              <i class="ph ph-download"></i>
              내보내기
            </button>
            <button class="btn btn-secondary btn-sm">
              <i class="ph ph-dots-three"></i>
            </button>
          </div>
        </div>
        
        <div class="consultation-messages" id="consultationMessages">
          ${renderMessages(consultationHistory[0]?.messages || [])}
        </div>
        
        <div class="consultation-input-area">
          <div class="chatbot-input-wrapper">
            <div class="chatbot-input-actions">
              <button class="chatbot-input-btn" title="파일 첨부">
                <i class="ph ph-paperclip"></i>
              </button>
              <button class="chatbot-input-btn" title="템플릿">
                <i class="ph ph-note"></i>
              </button>
            </div>
            <textarea 
              class="chatbot-input" 
              id="consultationInput" 
              placeholder="메시지를 입력하세요..."
              rows="1"
            ></textarea>
            <button class="chatbot-send-btn" id="consultationSend" title="전송">
              <i class="ph ph-paper-plane-tilt"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Right Sidebar: AI Suggestions -->
      <div class="ai-suggestions-panel">
        <div class="ai-suggestions-header">
          <i class="ph ph-robot ai-suggestions-icon"></i>
          <span class="ai-suggestions-title">AI 어시스턴트</span>
        </div>
        <div class="ai-suggestions-content">
          <!-- AI Suggestions -->
          <div style="margin-bottom: var(--space-6);">
            <div style="font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--color-text-muted); margin-bottom: var(--space-3); text-transform: uppercase; letter-spacing: 0.05em;">추천 응답</div>
            <div class="suggestion-card">
              <div class="suggestion-type">자주 묻는 질문</div>
              <div class="suggestion-title">NIW 처리 기간 안내</div>
              <div class="suggestion-description">일반적인 처리 기간은 8-12개월이며, 프리미엄 프로세싱 시 45일...</div>
            </div>
            <div class="suggestion-card">
              <div class="suggestion-type">정보 제공</div>
              <div class="suggestion-title">RFE 대응 가이드</div>
              <div class="suggestion-description">RFE 답변 시 유의사항 및 제출 기한 안내...</div>
            </div>
          </div>
          
          <!-- Similar Cases -->
          <div>
            <div style="font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--color-text-muted); margin-bottom: var(--space-3); text-transform: uppercase; letter-spacing: 0.05em;">유사 성공 사례</div>
            ${similarCases.map(c => `
              <div class="similar-case">
                <div class="similar-case-header">
                  <span class="badge badge-niw">${c.visaType}</span>
                  <span class="similar-case-match">${c.matchRate}% 일치</span>
                </div>
                <div class="similar-case-title">${c.title}</div>
                <div class="similar-case-result">${c.result}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  setupConsultationEvents();
}

function renderMessages(messages) {
  if (!messages || messages.length === 0) {
    return `
      <div class="empty-state" style="padding: var(--space-8);">
        <i class="ph ph-chat-circle empty-state-icon"></i>
        <div class="empty-state-title">상담을 시작하세요</div>
        <div class="empty-state-message">메시지를 입력하여 AI 상담을 시작하세요.</div>
      </div>
    `;
  }

  return messages.map(msg => `
    <div class="message message-${msg.role === 'user' ? 'user' : 'ai'}">
      <div class="message-avatar">
        ${msg.role === 'user' ? '홍' : '<i class="ph ph-robot"></i>'}
      </div>
      <div class="message-content">
        <div class="message-bubble">${msg.content}</div>
        <div class="message-time">${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </div>
  `).join('');
}

function setupConsultationEvents() {
  // Consultation item selection
  document.querySelectorAll('.consultation-item').forEach(item => {
    item.addEventListener('click', (e) => {
      document.querySelectorAll('.consultation-item').forEach(i => i.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const id = e.currentTarget.dataset.id;
      const consultation = consultationHistory.find(c => c.id === id);

      if (consultation) {
        const messagesContainer = document.getElementById('consultationMessages');
        messagesContainer.innerHTML = renderMessages(consultation.messages);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    });
  });

  // Send message
  const input = document.getElementById('consultationInput');
  const sendBtn = document.getElementById('consultationSend');

  input?.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim();
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn?.addEventListener('click', sendMessage);
}

// Modified for Real API Integration
async function sendMessage() {
  const input = document.getElementById('consultationInput');
  const messagesContainer = document.getElementById('consultationMessages');
  const message = input.value.trim();

  if (!message) return;

  // Add user message
  const userMessage = document.createElement('div');
  userMessage.className = 'message message-user';
  userMessage.innerHTML = `
    <div class="message-avatar">홍</div>
    <div class="message-content">
      <div class="message-bubble">${message}</div>
      <div class="message-time">${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `;
  messagesContainer.appendChild(userMessage);

  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Show typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message message-ai';
  typingIndicator.id = 'typingIndicator';
  typingIndicator.innerHTML = `
    <div class="message-avatar"><i class="ph ph-robot"></i></div>
    <div class="message-content">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  messagesContainer.appendChild(typingIndicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    // Call Backend API
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "당신은 AI 이민 수속 전문 상담사입니다. 고객의 질문에 친절하고 정확하게 답변해야 합니다." },
          { role: "user", content: message }
        ]
      })
    });

    // Check if API call was successful
    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Remove typing indicator
    document.getElementById('typingIndicator')?.remove();

    if (data.content) {
      // Add AI Response
      const aiMessage = document.createElement('div');
      aiMessage.className = 'message message-ai';
      aiMessage.innerHTML = `
        <div class="message-avatar"><i class="ph ph-robot"></i></div>
        <div class="message-content">
            <div class="message-bubble">${data.content.replace(/\n/g, '<br>')}</div>
            <div class="message-time">${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        `;
      messagesContainer.appendChild(aiMessage);
    } else {
      throw new Error('No content in response');
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    document.getElementById('typingIndicator')?.remove();

    const errorMessage = document.createElement('div');
    errorMessage.className = 'message message-ai';
    errorMessage.innerHTML = `
      <div class="message-avatar"><i class="ph ph-robot"></i></div>
      <div class="message-content">
        <div class="message-bubble error">
          죄송합니다. 오류가 발생했습니다.<br>
          <small style="opacity: 0.8;">서버 연결을 확인해주세요.</small>
        </div>
      </div>
    `;
    messagesContainer.appendChild(errorMessage);
  } finally {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}
