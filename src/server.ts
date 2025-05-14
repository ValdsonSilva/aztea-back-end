import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/userRoutes';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', UserRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});