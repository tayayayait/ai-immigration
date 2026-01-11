/**
 * Mock Data for AI Immigration System
 */

// 고객 데이터
export const customers = [
    {
        id: 'C001',
        name: '홍길동',
        email: 'hong@email.com',
        phone: '010-1234-5678',
        visaType: 'NIW',
        status: 'in-progress',
        progress: 65,
        currentStep: 'I-140 심사 중',
        assignee: '김상담',
        createdAt: '2024-08-15',
        lastContact: '2024-01-10'
    },
    {
        id: 'C002',
        name: '김영희',
        email: 'kim@email.com',
        phone: '010-2345-6789',
        visaType: 'EB-1',
        status: 'pending',
        progress: 30,
        currentStep: '서류 준비 중',
        assignee: '김상담',
        createdAt: '2024-10-20',
        lastContact: '2024-01-08'
    },
    {
        id: 'C003',
        name: '이철수',
        email: 'lee@email.com',
        phone: '010-3456-7890',
        visaType: 'EB-5',
        status: 'completed',
        progress: 100,
        currentStep: '비자 발급 완료',
        assignee: '박상담',
        createdAt: '2023-05-10',
        lastContact: '2024-01-05'
    },
    {
        id: 'C004',
        name: '박민수',
        email: 'park@email.com',
        phone: '010-4567-8901',
        visaType: 'H-1B',
        status: 'in-progress',
        progress: 45,
        currentStep: 'RFE 대응 중',
        assignee: '김상담',
        createdAt: '2024-06-01',
        lastContact: '2024-01-09'
    },
    {
        id: 'C005',
        name: '최지은',
        email: 'choi@email.com',
        phone: '010-5678-9012',
        visaType: 'F-1',
        status: 'pending',
        progress: 15,
        currentStep: 'OPT 신청 준비',
        assignee: '박상담',
        createdAt: '2024-11-01',
        lastContact: '2024-01-07'
    }
];

// 최근 활동 데이터
export const recentActivities = [
    {
        id: 'A001',
        type: 'call',
        title: '홍길동 고객 상담 통화',
        description: 'NIW I-140 심사 진행 상황 안내',
        customer: '홍길동',
        time: '14:30',
        date: '오늘'
    },
    {
        id: 'A002',
        type: 'email',
        title: '김영희 고객 서류 요청 메일',
        description: '추가 추천서 요청',
        customer: '김영희',
        time: '11:20',
        date: '오늘'
    },
    {
        id: 'A003',
        type: 'document',
        title: '박민수 RFE 답변서 작성',
        description: 'RFE 답변서 초안 완료',
        customer: '박민수',
        time: '09:45',
        date: '오늘'
    },
    {
        id: 'A004',
        type: 'meeting',
        title: '최지은 고객 초기 상담',
        description: 'OPT 및 향후 비자 플랜 논의',
        customer: '최지은',
        time: '16:00',
        date: '어제'
    },
    {
        id: 'A005',
        type: 'call',
        title: '이철수 비자 발급 완료 안내',
        description: '최종 비자 수령 안내',
        customer: '이철수',
        time: '10:30',
        date: '어제'
    }
];

// AI 인사이트 데이터
export const aiInsights = [
    {
        id: 'I001',
        type: '긴급 조치 필요',
        icon: 'warning',
        content: '박민수 고객의 RFE 답변 기한이 7일 남았습니다. 답변서 최종 검토를 진행해 주세요.',
        priority: 'high'
    },
    {
        id: 'I002',
        type: '추천',
        icon: 'lightbulb',
        content: '홍길동 고객과 유사한 NIW 승인 사례 3건을 발견했습니다. 참고 자료로 활용하세요.',
        priority: 'medium'
    },
    {
        id: 'I003',
        type: '자동 분석',
        icon: 'robot',
        content: '김영희 고객의 최근 상담 내용을 분석한 결과, 추천서 강화가 필요합니다.',
        priority: 'medium'
    }
];

// 수속 단계 데이터
export const processSteps = [
    { id: 1, name: '초기 상담', status: 'completed', date: '2024-08-15' },
    { id: 2, name: '서류 준비', status: 'completed', date: '2024-09-20' },
    { id: 3, name: 'I-140 접수', status: 'completed', date: '2024-10-10' },
    { id: 4, name: 'I-140 심사', status: 'current', date: '진행 중' },
    { id: 5, name: 'I-485 접수', status: 'pending', date: '-' },
    { id: 6, name: '비자 발급', status: 'pending', date: '-' }
];

// 상담 이력 데이터
export const consultationHistory = [
    {
        id: 'CH001',
        date: '2024-01-10 14:30',
        title: 'NIW 심사 진행 상황 문의',
        preview: 'I-140 심사가 현재 어느 단계인지...',
        messages: [
            { role: 'user', content: 'I-140 심사가 현재 어느 단계인지 궁금합니다.' },
            { role: 'ai', content: '안녕하세요, 홍길동 고객님. 현재 I-140 청원서는 USCIS에서 심사 중이며, 접수일 기준 약 6개월이 경과했습니다. 일반적인 NIW 처리 기간을 고려했을 때 약 2-3개월 내 결과를 받으실 수 있을 것으로 예상됩니다.' },
            { role: 'user', content: '혹시 프리미엄 프로세싱을 신청할 수 있나요?' },
            { role: 'ai', content: 'NIW의 경우 현재 프리미엄 프로세싱이 가능합니다. 추가 비용은 $2,805이며, 신청 후 45일 이내에 결과를 받으실 수 있습니다. 신청을 원하시면 말씀해 주세요.' }
        ]
    },
    {
        id: 'CH002',
        date: '2024-01-05 09:15',
        title: '추가 서류 제출 안내',
        preview: '추천서 관련 추가 서류가 필요하다고...',
        messages: [
            { role: 'ai', content: '안녕하세요, 홍길동 고객님. 심사관으로부터 추가 추천서 요청이 있었습니다. 현재 제출된 추천서 외에 1부의 독립적인 추천서가 더 필요합니다.' },
            { role: 'user', content: '어떤 분야의 추천서가 좋을까요?' },
            { role: 'ai', content: '고객님의 연구 분야와 직접적으로 관련된 학계 또는 산업계 전문가의 추천서가 가장 효과적입니다. 특히 고객님의 연구를 인용하거나 활용한 경험이 있는 분이면 더욱 좋습니다.' }
        ]
    }
];

// AI 추천 응답 템플릿
export const aiResponseTemplates = [
    {
        trigger: 'NIW',
        responses: [
            'NIW(National Interest Waiver)는 미국 국익에 기여하는 인재를 위한 취업 이민 카테고리입니다.',
            '신청자의 전문 분야가 미국 국익에 중요하고, 해당 분야에서 뛰어난 업적을 보유해야 합니다.',
            'NIW의 핵심 요건: 1) 상당한 가치의 제안, 2) 전국적 범위의 영향, 3) 고용주 스폰서 면제의 타당성'
        ]
    },
    {
        trigger: '서류',
        responses: [
            'NIW 신청에 필요한 기본 서류: 이력서, 학위증명서, 추천서(5-7부), 연구 실적 증빙자료',
            '추천서는 독립적인 전문가의 추천서가 3부 이상 포함되어야 합니다.',
            '모든 서류는 영문 번역본이 필요하며, 공증이 필요한 서류도 있습니다.'
        ]
    },
    {
        trigger: '기간',
        responses: [
            '일반적인 NIW 처리 기간은 약 8-12개월입니다.',
            '프리미엄 프로세싱 신청 시 45일 이내 심사가 진행됩니다.',
            'USCIS 처리 시간은 변동될 수 있으며, 현재 평균 처리 시간을 확인해 드릴 수 있습니다.'
        ]
    },
    {
        trigger: '비용',
        responses: [
            'NIW 정부 수수료: I-140 신청 $700, I-485 신청 $1,225',
            '프리미엄 프로세싱 추가 비용: $2,805',
            '상세한 비용 안내는 별도 상담을 통해 안내해 드리겠습니다.'
        ]
    }
];

// 유사 성공 사례
export const similarCases = [
    {
        id: 'SC001',
        visaType: 'NIW',
        matchRate: 92,
        title: '바이오 연구원 NIW 승인',
        result: '2023년 12월 승인 - 6개월 소요',
        field: '생명과학'
    },
    {
        id: 'SC002',
        visaType: 'NIW',
        matchRate: 87,
        title: 'AI 엔지니어 NIW 승인',
        result: '2023년 10월 승인 - 8개월 소요',
        field: '컴퓨터 과학'
    },
    {
        id: 'SC003',
        visaType: 'NIW',
        matchRate: 84,
        title: '의료기기 개발자 NIW 승인',
        result: '2024년 1월 승인 - 7개월 소요',
        field: '의공학'
    }
];

// 대시보드 통계
export const dashboardStats = {
    totalCustomers: 1234,
    inProgressCases: 89,
    completedThisMonth: 12,
    pendingTasks: 23,
    customerGrowth: 12.5,
    caseGrowth: -3.2,
    completionGrowth: 8.3
};

// 서류 데이터
export const documents = [
    { id: 'D001', customerId: 'C001', customerName: '홍길동', docType: '여권 사본', status: 'approved', uploadDate: '2024-08-20', expiryDate: '2034-08-20' },
    { id: 'D002', customerId: 'C001', customerName: '홍길동', docType: '학위 증명서', status: 'approved', uploadDate: '2024-08-22', expiryDate: null },
    { id: 'D003', customerId: 'C001', customerName: '홍길동', docType: '추천서 1', status: 'approved', uploadDate: '2024-09-01', expiryDate: null },
    { id: 'D004', customerId: 'C001', customerName: '홍길동', docType: '추천서 2', status: 'pending', uploadDate: '2024-09-05', expiryDate: null },
    { id: 'D005', customerId: 'C002', customerName: '김영희', docType: '여권 사본', status: 'approved', uploadDate: '2024-10-25', expiryDate: '2033-05-15' },
    { id: 'D006', customerId: 'C002', customerName: '김영희', docType: '이력서', status: 'pending', uploadDate: '2024-11-01', expiryDate: null },
    { id: 'D007', customerId: 'C004', customerName: '박민수', docType: 'RFE 답변서', status: 'in-progress', uploadDate: '2024-01-08', expiryDate: null },
    { id: 'D008', customerId: 'C005', customerName: '최지은', docType: 'OPT 신청서', status: 'pending', uploadDate: '2024-01-05', expiryDate: null }
];

// 케이스 데이터
export const cases = [
    { id: 'CS001', customerId: 'C001', customerName: '홍길동', visaType: 'NIW', status: 'in-progress', progress: 65, currentStep: 'I-140 심사 중', startDate: '2024-08-15', estimatedEnd: '2025-06-01', assignee: '김상담' },
    { id: 'CS002', customerId: 'C002', customerName: '김영희', visaType: 'EB-1', status: 'pending', progress: 30, currentStep: '서류 준비 중', startDate: '2024-10-20', estimatedEnd: '2025-10-01', assignee: '김상담' },
    { id: 'CS003', customerId: 'C003', customerName: '이철수', visaType: 'EB-5', status: 'completed', progress: 100, currentStep: '비자 발급 완료', startDate: '2023-05-10', estimatedEnd: '2024-01-10', assignee: '박상담' },
    { id: 'CS004', customerId: 'C004', customerName: '박민수', visaType: 'H-1B', status: 'in-progress', progress: 45, currentStep: 'RFE 대응 중', startDate: '2024-06-01', estimatedEnd: '2025-03-01', assignee: '김상담' },
    { id: 'CS005', customerId: 'C005', customerName: '최지은', visaType: 'F-1', status: 'pending', progress: 15, currentStep: 'OPT 신청 준비', startDate: '2024-11-01', estimatedEnd: '2025-02-01', assignee: '박상담' }
];

// 일정 데이터
export const calendarEvents = [
    { id: 'E001', title: '홍길동 상담', type: 'consultation', date: '2025-01-13', time: '10:00', customer: '홍길동', description: 'NIW 진행 상황 안내' },
    { id: 'E002', title: '박민수 RFE 마감', type: 'deadline', date: '2025-01-15', time: null, customer: '박민수', description: 'RFE 답변서 제출 기한' },
    { id: 'E003', title: '김영희 서류 검토', type: 'task', date: '2025-01-14', time: '14:00', customer: '김영희', description: '추천서 검토 미팅' },
    { id: 'E004', title: '최지은 초기 상담', type: 'consultation', date: '2025-01-16', time: '11:00', customer: '최지은', description: 'OPT 신청 관련 상담' },
    { id: 'E005', title: '팀 미팅', type: 'meeting', date: '2025-01-17', time: '09:00', customer: null, description: '주간 케이스 리뷰' },
    { id: 'E006', title: '이철수 비자 수령', type: 'task', date: '2025-01-11', time: '15:00', customer: '이철수', description: '비자 수령 안내 연락' }
];

// 분석 데이터
export const analyticsData = {
    visaTypeStats: [
        { type: 'NIW', count: 45, successRate: 92 },
        { type: 'EB-1', count: 23, successRate: 88 },
        { type: 'EB-5', count: 12, successRate: 95 },
        { type: 'H-1B', count: 67, successRate: 78 },
        { type: 'F-1/OPT', count: 34, successRate: 96 }
    ],
    monthlyStats: [
        { month: '2024-08', newCases: 12, completed: 8 },
        { month: '2024-09', newCases: 15, completed: 10 },
        { month: '2024-10', newCases: 18, completed: 12 },
        { month: '2024-11', newCases: 14, completed: 11 },
        { month: '2024-12', newCases: 20, completed: 15 },
        { month: '2025-01', newCases: 8, completed: 5 }
    ],
    processingTimes: { avg: 8.5, min: 4, max: 14 },
    satisfactionScore: 4.7
};

// 리포트 템플릿
export const reportTemplates = [
    { id: 'RT001', name: '월간 케이스 현황', description: '전체 케이스 진행 현황 요약', type: 'monthly' },
    { id: 'RT002', name: '고객별 상담 이력', description: '특정 고객의 상담 기록 리포트', type: 'customer' },
    { id: 'RT003', name: '비자 유형별 통계', description: '비자 종류별 승인률 및 처리 시간', type: 'analytics' },
    { id: 'RT004', name: '연간 실적 보고서', description: '연간 케이스 완료 및 성과 분석', type: 'annual' }
];

// 리포트 히스토리
export const reportHistory = [
    { id: 'RH001', templateName: '월간 케이스 현황', generatedAt: '2025-01-01 09:00', period: '2024년 12월', status: 'completed' },
    { id: 'RH002', templateName: '고객별 상담 이력', generatedAt: '2024-12-28 14:30', period: '홍길동', status: 'completed' },
    { id: 'RH003', templateName: '비자 유형별 통계', generatedAt: '2024-12-15 10:00', period: '2024년 Q4', status: 'completed' }
];
