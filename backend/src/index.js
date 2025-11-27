const app = require('./app');


app.listen(app.get('port'), '0.0.0.0', () => {
    console.log("servidor escuchando en el puerto", app.get("port"));
});