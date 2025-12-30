const express = require('express');
const config = require('./config');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

// Importing routes
const clientes = require('./models/clientes/rutas');
const usuarios = require('./models/usuarios/rutas');
const auth = require('./models/auth/rutas');
const CopiasDeSeguridad = require('./models/CopiasDeSeguridad/rutas');
const impresoras = require('./models/impresoras/rutas');
const licenciamiento = require('./models/licenciamiento/rutas');
const mantenimiento = require('./models/mantenimiento/rutas');
const recordatorios = require('./models/recordatorios/rutas');
const equipos = require('./models/equipos/rutas');
const historialEquipos = require('./models/historialEquipos/rutas');
const error = require('./red/errors');

const app = express();

// Security and Performance Middleware
app.use(helmet({
    crossOriginResourcePolicy: false, // For local dev images/assets
}));
app.use(compression()); // Compress all responses
app.use(limiter); // Apply rate limiting

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' })); // Reduced limit for better memory usage
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://18.218.142.48"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
//config
app.set('port', config.app.port);

//rutas frontend
// Nota: evitar mezclar import/require. Las rutas de usuarios ya se requieren arriba
// por lo que no es necesario re-importarlas con sintaxis ESM.

//rutes
app.use('/api/clientes', clientes);
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use('/api/CopiasDeSeguridad', CopiasDeSeguridad);
app.use('/api/impresoras', impresoras);
app.use('/api/licenciamiento', licenciamiento);
app.use('/api/mantenimiento', mantenimiento);
app.use('/api/recordatorios', recordatorios);
app.use('/api/equipos', equipos);
app.use('/api/historial-equipos', historialEquipos);

app.use(error);


module.exports = app;