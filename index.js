const express=require('express');
const cors=require('cors');
require('express-async-errors');
const {eventRouter} = require('./src/events/index');
const {nudgeRouter} = require('./src/nudges/index');
const {connectDB}=require('./src/db/connection');
const {errorHandler}=require('./src/middlewares/error-handler');
const path=require('path');
const helmet=require('helmet');
const app= express();
const port = process.env.PORT||3000;
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(helmet());


app.use('/public',express.static(path.join(__dirname, '/public')));
app.use('/api/v3/app',eventRouter);
app.use('/api/v3/app',nudgeRouter);

app.all('*', (req, res) => {
  res.status(404).json({
    message: 'Page Not Found',
  });
});
app.use(errorHandler);
const start = async () => {
  try {
    await connectDB();
    console.log('Database Connected');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is up and running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
};
start();

