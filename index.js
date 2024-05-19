const express = require('express');
const mysql = require('mysql');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MySQL connection
const dbMySQL = mysql.createConnection({
    host: 'localhost',
    user: 'finance', 
    password: '123456', 
    database: 'family_finance'
});

dbMySQL.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/family', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const NoteSchema = new mongoose.Schema({
    member_id: Number,
    notes: [
        {
            income_id: Number,
            note: String
        },
        {
            expense_id: Number,
            note: String
        }
    ]
});

const Note = mongoose.model('Note', NoteSchema);

// Get family member financial details
app.get('/family/:id', (req, res) => {
    const memberId = req.params.id;

    const sqlIncomes = `SELECT * FROM incomes WHERE member_id = ${mysql.escape(memberId)}`;
    const sqlExpenses = `SELECT * FROM expenses WHERE member_id = ${mysql.escape(memberId)}`;

    dbMySQL.query(sqlIncomes, (err, incomes) => {
        if (err) throw err;

        dbMySQL.query(sqlExpenses, (err, expenses) => {
            if (err) throw err;

            Note.findOne({ member_id: memberId }, (err, notes) => {
                if (err) throw err;

                res.json({
                    incomes,
                    expenses,
                    notes: notes ? notes.notes : []
                });
            });
        });
    });
});

// Add a new income or expense with a note
app.post('/family/:id/add', (req, res) => {
    const memberId = req.params.id;
    const { type, amount, sourceOrCategory, date, note } = req.body;

    if (type === 'income') {
        const sql = `INSERT INTO incomes (member_id, amount, source, date) VALUES (${mysql.escape(memberId)}, ${mysql.escape(amount)}, ${mysql.escape(sourceOrCategory)}, ${mysql.escape(date)})`;
        dbMySQL.query(sql, (err, result) => {
            if (err) throw err;

            const newIncomeId = result.insertId;
            Note.findOneAndUpdate(
                { member_id: memberId },
                { $push: { notes: { income_id: newIncomeId, note } } },
                { new: true, upsert: true },
                (err) => {
                    if (err) throw err;

                    res.json({ message: 'Income added successfully!' });
                }
            );
        });
    } else if (type === 'expense') {
        const sql = `INSERT INTO expenses (member_id, amount, category, date) VALUES (${mysql.escape(memberId)}, ${mysql.escape(amount)}, ${mysql.escape(sourceOrCategory)}, ${mysql.escape(date)})`;
        dbMySQL.query(sql, (err, result) => {
            if (err) throw err;

            const newExpenseId = result.insertId;
            Note.findOneAndUpdate(
                { member_id: memberId },
                { $push: { notes: { expense_id: newExpenseId, note } } },
                { new: true, upsert: true },
                (err) => {
                    if (err) throw err;

                    res.json({ message: 'Expense added successfully!' });
                }
            );
        });
    } else {
        res.status(400).json({ message: 'Invalid type. It should be either "income" or "expense".' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
