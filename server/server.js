/**
 * Express Server for API Proxying
 * Handles secure communication with OpenAI, Google Cloud Vision, and Supabase
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure OpenAI
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

// Configure Supabase
const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

// Configure Upload
const upload = multer({ storage: multer.memoryStorage() });

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        services: {
            openai: !!process.env.OPENAI_API_KEY,
            googleVision: !!process.env.GOOGLE_CLOUD_API_KEY,
            supabase: !!supabase
        }
    });
});

// OpenAI Chat Proxy
app.post('/api/chat', async (req, res) => {
    if (!openai) return res.status(503).json({ error: 'OpenAI API key missing' });

    try {
        const { messages } = req.body;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
        });

        res.json(completion.choices[0].message);
    } catch (error) {
        console.error('OpenAI Error:', error);
        res.status(500).json({ error: error.message || 'AI processing failed' });
    }
});

// Google Cloud Vision OCR Proxy (REST API)
app.post('/api/ocr', upload.single('file'), async (req, res) => {
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) return res.status(503).json({ error: 'Google Cloud API key missing' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        // Convert buffer to base64
        const base64Image = req.file.buffer.toString('base64');

        // Call Google Vision REST API
        const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requests: [
                    {
                        image: {
                            content: base64Image
                        },
                        features: [
                            {
                                type: 'TEXT_DETECTION'
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.responses && data.responses[0].error) {
            throw new Error(data.responses[0].error.message);
        }

        const fullText = data.responses[0].fullTextAnnotation?.text || '';
        res.json({ text: fullText });

    } catch (error) {
        console.error('Google Vision Error:', error);
        res.status(500).json({ error: error.message || 'OCR processing failed' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log('Environment check:');
    console.log('- OpenAI:', !!process.env.OPENAI_API_KEY ? 'Configured' : 'Missing');
    console.log('- Google Vision:', !!process.env.GOOGLE_CLOUD_API_KEY ? 'Configured' : 'Missing');
    console.log('- Supabase:', !!supabase ? 'Configured' : 'Missing');
});
