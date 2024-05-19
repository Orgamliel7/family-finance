const express = require('express');
const mysql = require('mysql');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// MySQL connection
const dbMySQL = mysql.createConnection({
    host: 'localhost',
    user: 'finance', 
    password: '123456', 
    database: 'family_finance'
});

dbMySQL.connect(err => {
    if (err) throw err; // Throw error if connection fails
    console.log('MySQL Connected...');
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/family', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define schema and model for notes in MongoDB
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

// Endpoint to get financial details for a family member
app.get('/family/:id', (req, res) => {
    const memberId = req.params.id;

    const sqlIncomes = `SELECT * FROM incomes WHERE member_id = ${mysql.escape(memberId)}`;
    const sqlExpenses = `SELECT * FROM expenses WHERE member_id = ${mysql.escape(memberId)}`;

    // Query incomes from MySQL
    dbMySQL.query(sqlIncomes, (err, incomes) => {
        if (err) throw err; // Throw error if query fails

        // Query expenses from MySQL
        dbMySQL.query(sqlExpenses, (err, expenses) => {
            if (err) throw err; // Throw error if query fails

            // Query notes from MongoDB
            Note.findOne({ member_id: memberId }, (err, notes) => {
                if (err) throw err; // Throw error if query fails

                // Respond with incomes, expenses, and notes
                res.json({
                    incomes,
                    expenses,
                    notes: notes ? notes.notes : []
                });
            });
        });
    });
});

// Endpoint to add a new income or expense with a note
app.post('/family/:id/add', (req, res) => {
    const memberId = req.params.id;
    const { type, amount, sourceOrCategory, date, note } = req.body;

    if (type === 'income') {
        // Insert new income into MySQL
        const sql = `INSERT INTO incomes (member_id, amount, source, date) VALUES (${mysql.escape(memberId)}, ${mysql.escape(amount)}, ${mysql.escape(sourceOrCategory)}, ${mysql.escape(date)})`;
        dbMySQL.query(sql, (err, result) => {
            if (err) throw err; // Throw error if insertion fails

            const newIncomeId = result.insertId;

            // Update MongoDB with the new income note
            Note.findOneAndUpdate(
                { member_id: memberId },
                { $push: { notes: { income_id: newIncomeId, note } } },
                { new: true, upsert: true },
                (err) => {
                    if (err) throw err; // Throw error if update fails

                    res.json({ message: 'Income added successfully!' });
                }
            );
        });
    } else if (type === 'expense') {
        // Insert new expense into MySQL
        const sql = `INSERT INTO expenses (member_id, amount, category, date) VALUES (${mysql.escape(memberId)}, ${mysql.escape(amount)}, ${mysql.escape(sourceOrCategory)}, ${mysql.escape(date)})`;
        dbMySQL.query(sql, (err, result) => {
            if (err) throw err; // Throw error if insertion fails

            const newExpenseId = result.insertId;

            // Update MongoDB with the new expense note
            Note.findOneAndUpdate(
                { member_id: memberId },
                { $push: { notes: { expense_id: newExpenseId, note } } },
                { new: true, upsert: true },
                (err) => {
                    if (err) throw err; // Throw error if update fails

                    res.json({ message: 'Expense added successfully!' });
                }
            );
        });
    } else {
        res.status(400).json({ message: 'Invalid type. It should be either "income" or "expense".' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
