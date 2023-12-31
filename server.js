const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ extended: false }));



app.use(require('./routes/auth'))
app.use(require('./routes/writers'))
app.use(require('./routes/posts'))


if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));