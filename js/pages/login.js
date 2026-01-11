import { supabase } from '../supabase.js';
import { router } from '../router.js';

export function renderLogin() {
    const content = document.getElementById('pageContent');

    // Hide sidebar and header for login page
    document.getElementById('sidebar').style.display = 'none';
    document.querySelector('.header').style.display = 'none';
    document.querySelector('.chatbot-widget').style.display = 'none';

    content.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <i class="ph ph-airplane-tilt"></i>
          </div>
          <h1 class="login-title" id="pageTitle">AI 이민 수속 시스템</h1>
          <p class="login-subtitle" id="pageSubtitle">관리자 계정으로 로그인하세요</p>
        </div>
        
        <form id="authForm" class="login-form">
          <!-- Name field (register only) -->
          <div class="form-group" id="nameGroup" style="display: none;">
            <label class="form-label" for="name">이름</label>
            <div class="input-icon-wrapper">
              <i class="ph ph-user input-icon"></i>
              <input type="text" id="name" class="form-input with-icon" placeholder="홍길동">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="email">이메일</label>
            <div class="input-icon-wrapper">
              <i class="ph ph-envelope input-icon"></i>
              <input type="email" id="email" class="form-input with-icon" placeholder="name@company.com" required>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="password">비밀번호</label>
            <div class="input-icon-wrapper">
              <i class="ph ph-lock input-icon"></i>
              <input type="password" id="password" class="form-input with-icon" placeholder="••••••••" required>
            </div>
          </div>
          
          <div class="form-group" id="loginOptions">
            <label class="checkbox-label">
              <input type="checkbox"> 로그인 상태 유지
            </label>
          </div>
          
          <button type="submit" class="btn btn-primary btn-lg w-full" id="submitBtn">
            로그인
          </button>
        </form>
        
        <div class="login-footer">
          <p id="toggleText">계정이 없으신가요? <a href="#" id="toggleMode">회원가입</a></p>
        </div>
      </div>
    </div>
  `;

    setupAuthEvents();
}

function setupAuthEvents() {
    const form = document.getElementById('authForm');
    const submitBtn = document.getElementById('submitBtn');
    const toggleBtn = document.getElementById('toggleMode');
    const nameGroup = document.getElementById('nameGroup');
    const loginOptions = document.getElementById('loginOptions');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const toggleText = document.getElementById('toggleText');

    let isRegisterMode = false;

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;

        if (isRegisterMode) {
            // Switch to Register
            nameGroup.style.display = 'block';
            document.getElementById('name').required = true;
            loginOptions.style.display = 'none';
            submitBtn.textContent = '회원가입';
            pageTitle.textContent = '회원가입';
            pageSubtitle.textContent = '새로운 관리자 계정을 생성합니다';
            toggleText.innerHTML = '이미 계정이 있으신가요? <a href="#" id="toggleMode">로그인</a>';
        } else {
            // Switch to Login
            nameGroup.style.display = 'none';
            document.getElementById('name').required = false;
            loginOptions.style.display = 'block';
            submitBtn.textContent = '로그인';
            pageTitle.textContent = 'AI 이민 수속 시스템';
            pageSubtitle.textContent = '관리자 계정으로 로그인하세요';
            toggleText.innerHTML = '계정이 없으신가요? <a href="#" id="toggleMode">회원가입</a>';
        }

        // Re-bind event listener to new toggle button since innerHTML replaced it
        setupAuthEvents();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> 처리 중...';

        try {
            if (isRegisterMode) {
                // Handle Register
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        },
                    },
                });

                if (error) throw error;

                window.showToast('회원가입 성공! 자동 로그인됩니다.', 'success');

                // Auto login handling or waiting for session
                // Typically signUp returns session if email confirmation is disabled or auto-confirm is on.
                // If email confirm is on, we might need to tell user to check email.
                if (data.session) {
                    onLoginSuccess();
                } else {
                    window.showToast('이메일 인증을 확인해주세요.', 'info');
                    submitBtn.disabled = false;
                    submitBtn.textContent = '회원가입';
                }

            } else {
                // Handle Login
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                window.showToast('로그인 성공!', 'success');
                onLoginSuccess();
            }

        } catch (error) {
            console.error('Auth Error:', error);
            window.showToast(`오류: ${error.message}`, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = isRegisterMode ? '회원가입' : '로그인';
        }
    });
}

function onLoginSuccess() {
    // Restore layout
    document.getElementById('sidebar').style.display = '';
    document.querySelector('.header').style.display = '';
    document.querySelector('.chatbot-widget').style.display = '';

    router.navigate('dashboard');
}
