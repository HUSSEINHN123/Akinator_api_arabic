import express from 'express';
import { Akinator } from '@aqul/akinator-api';
import { sessions } from '../sessions.js';

const router = express.Router();

router.get('/start', async (req, res) => {
  const region = 'ar';
  const childMode = false;

  try {
    const aki = new Akinator({ region, childMode });
    await aki.start();
    const sessionId = Date.now().toString();
    sessions.set(sessionId, aki);
    res.json({ النجاح: true, معرّف_الجلسة: sessionId, السؤال: aki.question, الخطوة: aki.currentStep, نسبة_التقدم: aki.progress });
  } catch (err) {
    res.status(500).json({ النجاح: false, رسالة: 'فشل في بدء اللعبة', الخطأ: err.message });
  }
});

router.get('/answer', async (req, res) => {
  const { session, answer } = req.query;
  if (!sessions.has(session)) return res.status(400).json({ النجاح: false, رسالة: 'معرّف الجلسة غير صالح' });

  try {
    const aki = sessions.get(session);
    await aki.answer(Number(answer));
    if (aki.isWin) {
      res.json({ النجاح: true, التخمين: { الاسم: aki.sugestion_name, الوصف: aki.sugestion_desc, الصورة: aki.sugestion_photo } });
      sessions.delete(session);
    } else {
      res.json({ النجاح: true, السؤال: aki.question, الخطوة: aki.currentStep, نسبة_التقدم: aki.progress });
    }
  } catch (err) {
    res.status(500).json({ النجاح: false, رسالة: 'حدث خطأ أثناء الإجابة', الخطأ: err.message });
  }
});

export default router;
