const mongoose = require('mongoose');

// Al utilizar Mongo, de manera automatica se crea la base de datos prueba-db-app
mongoose.connect('mongodb+srv://<username>:<password>@cluster0.couuwac.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
})
    .then(db => console.log('DB is connect'))
    .catch(err => console.error(err));
