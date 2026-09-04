const Hospital = require('../models/Hospital');

// @desc Analyze symptoms using AI (Google Gemini API)
exports.analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, lat, lng } = req.body;

    if (!symptoms) {
      return res.status(400).json({ success: false, message: 'Symptoms are required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'AI service not configured.' });
    }

    const prompt = `You are a healthcare assistant for MediSetu, a free healthcare platform in India.
When given symptoms or a disease name, respond with a JSON object in this exact format:
{
  "possibleConditions": [
    {"name": "Condition Name", "probability": "High/Medium/Low", "description": "brief 1-line description"}
  ],
  "recommendedSpecialist": "Type of doctor to see",
  "urgencyLevel": "Immediate/Within 24h/Within a week/Routine",
  "firstAidTips": ["tip 1", "tip 2"],
  "freeSchemes": ["Scheme that can help"],
  "disclaimer": "This is not medical advice. Please consult a qualified doctor."
}

Keep it factual and helpful. Always recommend consulting a real doctor.
Patient symptoms: ${symptoms}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 800,
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API Error details:', data.error);
      return res.status(500).json({ success: false, message: 'AI service error: ' + data.error.message });
    }

    const candidate = data.candidates?.[0];
    if (!candidate) {
      console.error('No candidates returned from Gemini:', data);
      return res.status(500).json({ success: false, message: 'AI service failed to generate a response.' });
    }

    if (candidate.finishReason === 'SAFETY') {
      console.warn('Gemini response blocked by safety filters:', candidate);
      return res.status(500).json({ success: false, message: 'Response blocked by AI safety filters. Please try rephrasing.' });
    }

    const textContent = candidate.content?.parts?.[0]?.text;
    console.log('Gemini Analysis Response:', textContent);

    if (!textContent) {
      return res.status(500).json({ success: false, message: 'Received empty response from AI service.' });
    }

    let aiResult;
    try {
      aiResult = JSON.parse(textContent);
    } catch {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      aiResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { rawResponse: textContent };
    }

    // Find matching hospitals if location provided
    let hospitals = [];
    if (lat && lng && aiResult.recommendedSpecialist) {
      hospitals = await Hospital.find({
        status: 'approved',
        specializations: { $in: [new RegExp(aiResult.recommendedSpecialist.split(' ')[0], 'i')] },
        'address.location': {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: 50000
          }
        }
      }).limit(5).select('name address rating type hasFreeOPD');
    }

    res.json({ success: true, data: { analysis: aiResult, matchingHospitals: hospitals } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc AI chatbot for general health questions
exports.chatbot = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ success: false, message: 'AI service not configured.' });

    // Format history for Gemini
    const formattedHistory = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    const systemInstruction = `You are Dr. MediSetu, an AI health assistant for MediSetu platform in India. 
You help users understand symptoms, find hospitals, and learn about free government healthcare schemes.
Keep responses concise, friendly, and in simple language. Always recommend consulting a real doctor for diagnosis.
Mention free government schemes (Ayushman Bharat, MA Vatsalya, etc.) when relevant.
Never diagnose definitively - only suggest possibilities.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [
          ...formattedHistory,
          { role: 'user', parts: [{ text: message }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that.';

    res.json({ success: true, data: { reply, role: 'assistant' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
