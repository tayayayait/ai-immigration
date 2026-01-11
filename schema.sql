-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Customers Table (고객 정보)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    visa_type TEXT CHECK (visa_type IN ('NIW', 'EB-1', 'EB-5', 'H-1B', 'F-1')),
    status TEXT CHECK (status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    current_step TEXT,
    assignee TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Process Steps Table (수속 단계)
CREATE TABLE process_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in-progress', 'completed', 'waiting')) DEFAULT 'pending',
    completed_date TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Consultations Table (상담 이력)
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    messages JSONB DEFAULT '[]'::jsonb,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies (Allow read/write for authenticated users)
CREATE POLICY "Allow all access for authenticated users" ON customers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users" ON process_steps
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all access for authenticated users" ON consultations
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. Insert Mock Data (Initial Setup)
INSERT INTO customers (id, name, email, phone, visa_type, status, progress, current_step, assignee) VALUES
('550e8400-e29b-41d4-a716-446655440001', '홍길동', 'hong@example.com', '010-1234-5678', 'NIW', 'in-progress', 45, 'I-140 심사 중', '김담당'),
('550e8400-e29b-41d4-a716-446655440002', '이영희', 'lee@example.com', '010-9876-5432', 'EB-1', 'completed', 100, '영주권 발급 완료', '박수석'),
('550e8400-e29b-41d4-a716-446655440003', '김철수', 'kim@example.com', '010-5555-5555', 'F-1', 'pending', 10, '서류 준비', '최매니저');

INSERT INTO process_steps (customer_id, step_name, status, completed_date, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', '자격 판정', 'completed', '2024-01-10', 1),
('550e8400-e29b-41d4-a716-446655440001', '계약 체결', 'completed', '2024-01-15', 2),
('550e8400-e29b-41d4-a716-446655440001', '서류 준비', 'completed', '2024-02-20', 3),
('550e8400-e29b-41d4-a716-446655440001', 'I-140 접수', 'completed', '2024-03-01', 4),
('550e8400-e29b-41d4-a716-446655440001', 'I-140 심사', 'in-progress', NULL, 5),
('550e8400-e29b-41d4-a716-446655440001', '이민 비자 신청', 'waiting', NULL, 6);

INSERT INTO consultations (customer_id, title, summary, date, messages) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'RFE 대응 전략 회의', '추가 증빙 자료 준비 목록 확인', '2024-03-15', '[{"role":"user","content":"RFE 나왔는데 어떻게 하죠?"},{"role":"ai","content":"걱정하지 마세요. 요청된 자료 목록은 다음과 같습니다..."}]'::jsonb);
