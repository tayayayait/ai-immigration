import { supabase } from '../supabase.js';

export const DataService = {
    // --- Customers ---

    async getCustomers() {
        // Join with latest process step if possible, but for MVP just get customers
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getCustomerById(id) {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async createCustomer(customerData) {
        // Map frontend fields to DB columns if needed
        const payload = {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            visa_type: customerData.visaType,
            status: 'pending',
            progress: 0,
            current_step: '초기 상담',
            assignee: '미지정' // Default
        };

        const { data, error } = await supabase
            .from('customers')
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // --- Process Steps ---

    async getProcessSteps(customerId) {
        const { data, error } = await supabase
            .from('process_steps')
            .select('*')
            .eq('customer_id', customerId)
            .order('order_index', { ascending: true });

        if (error) throw error;
        return data;
    },

    // --- Consultations ---

    async getConsultations(customerId) {
        const { data, error } = await supabase
            .from('consultations')
            .select('*')
            .eq('customer_id', customerId)
            .order('date', { ascending: false });

        if (error) throw error;
        return data;
    },

    // --- Dashboard Stats (Aggregated) ---

    async getDashboardStats() {
        // In a real app, use Supabase RPC or specialized queries.
        // For MVP, we'll fetch all customers and aggregate locally (or use count)

        // 1. Total Customers
        const { count: totalCustomers } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true });

        // 2. In Progress
        const { count: inProgressCases } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'in-progress');

        // 3. Completed
        const { count: completed } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed');

        return {
            totalCustomers: totalCustomers || 0,
            inProgressCases: inProgressCases || 0,
            completedThisMonth: completed || 0, // Simplified: Just total completed for now
            pendingTasks: 5, // Mock number for now as we don't have tasks table
            customerGrowth: 12.5, // Mock
            caseGrowth: -3.2,     // Mock
            completionGrowth: 8.3 // Mock
        };
    },

    async getRecentActivities() {
        // For MVP, just return mock data or create an 'activities' table later.
        // We will stick to mock data for activities to save time, or derive from consultations.
        // Let's derive from consultations + mock mix for richness.
        return [
            {
                id: 'A001',
                type: 'call',
                title: '홍길동 고객 상담 통화',
                description: 'NIW I-140 심사 진행 상황 안내',
                customer: '홍길동',
                time: '14:30',
                date: '오늘'
            },
            // ... more mocks if needed, or fetch from DB if we added activities table
        ];
    }
};
