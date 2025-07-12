import express from 'express';
import cors from 'cors';
import akinatorRoutes from './controllers/akinatorController.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use('/api/v1', akinatorRoutes);

app.get('/', (req, res) => res.send('🔥 Akinator API يعمل بالعربية'));
app.listen(PORT, () => console.log(`✅ السيرفر يعمل على http://localhost:${PORT}`));
