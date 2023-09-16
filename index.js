import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 3000;
const uri = process.env.DB_URI

console.log('Connecting to DB...');
await mongoose.connect(uri);
console.log('Connected to DB.');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    taskType: {
        type: Number,
        required: true
    },
    isDone: {
        type: Boolean,
        default: false,
        required: true
    }
});

const Task = mongoose.model('Task', taskSchema);

app.get('/', async (req, res) => {
    const result = await Task.find({ taskType: 0 });

    res.render('index.ejs', { 
        taskType: 0,
        tasks: result
    });
});

app.get('/work', async (req, res) => {
    const result = await Task.find({ taskType: 1 });

    res.render('index.ejs', { 
        taskType: 1,
        tasks: result
    });
});

app.post('/submit', async (req, res) => {
    const task = new Task({ name: req.body.name, taskType: req.body.taskType });
    const result = await task.save();

    console.log(result);

    res.redirect(getAddress(req.body.taskType));
});

app.post('/check-task', async (req, res) => {
    const result = await Task.findByIdAndUpdate(req.body.id, { isDone: !(req.body.isDone === 'true') });

    console.log(result);

    res.redirect(getAddress(req.body.taskType));
});

app.post('/delete-task', async (req, res) => {
    const result = await Task.deleteMany({ taskType: req.body.taskType, isDone: true });

    console.log(result);

    res.redirect(getAddress(req.body.taskType));
})

app.listen(port, () => {
    console.log(`Server listening at port ${port}.`);
});

function getAddress(taskType) {
    switch (taskType) {
        case '0':
            return '/';

        case '1':
            return '/work'
    
        default:
            return '/';
    }
}