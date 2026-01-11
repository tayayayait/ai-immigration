import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Google Cloud API key missing' });
    }

    const form = new IncomingForm();

    try {
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const file = files.file?.[0] || files.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileData = fs.readFileSync(file.filepath);
        const base64Image = fileData.toString('base64');

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
        res.status(200).json({ text: fullText });

    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({ error: error.message || 'OCR processing failed' });
    }
}
