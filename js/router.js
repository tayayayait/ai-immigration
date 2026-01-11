import { renderDashboard } from './pages/dashboard.js';
import { renderCustomers } from './pages/customers.js';
import { renderCustomerDetail } from './pages/customer-detail.js';
import { renderAIConsultation } from './pages/ai-consultation.js';
import { renderLogin } from './pages/login.js';
import { supabase } from './supabase.js';

export const router = {
    routes: {},

    register(pageName, renderFunction) {
        this.routes[pageName] = renderFunction;
    },

    async navigate(pageName) {
        // Auth Guard
        if (supabase && pageName !== 'login') {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Redirect to login if not authenticated
                this.navigate('login');
                return;
            }
        }

        // Handle Login Page Redirect (if already logged in)
        if (supabase && pageName === 'login') {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                this.navigate('dashboard');
                return;
            }
        }

        history.pushState({ page: pageName }, '', `/#${pageName}`);
        this.render(pageName);
    },

    render(pageName) {
        const renderFunction = this.routes[pageName];
        if (renderFunction) {
            renderFunction();

            // Update sidebar active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('active', item.dataset.page === pageName);
                if (item.dataset.page === pageName) {
                    document.querySelector('.header-title').textContent = item.querySelector('span').textContent;
                }
            });

            // Special handling for login page layout
            if (pageName === 'login') {
                document.getElementById('sidebar').style.display = 'none';
                document.querySelector('.header').style.display = 'none';
                document.querySelector('.chatbot-widget').style.display = 'none';
            } else {
                document.getElementById('sidebar').style.display = '';
                document.querySelector('.header').style.display = '';
                document.querySelector('.chatbot-widget').style.display = '';
            }
        }
    }
};

// Initialize Router Auth Listener
if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            router.navigate('login');
        }
    });
}
