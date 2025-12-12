const express = require('express');
const router = express.Router();
const respuesta = require('../../red/respuestas');
const controlador = require('./controlador');

// Rutas
router.get('/', todos);
router.get('/estadisticas', estadisticas);
router.get('/codigo/:codigo', porCodigo);
router.get('/equipo/:id', porEquipo);
router.post('/', agregar);
router.delete('/:id', eliminar);

// Funciones
async function todos(req, res, next) {
    try {
        const items = await controlador(null).todos(req, res, next);
    } catch (err) {
        next(err);
    }
}

async function porCodigo(req, res, next) {
    try {
        const items = await controlador(null).porCodigo(req, res, next);
    } catch (err) {
        next(err);
    }
}

async function porEquipo(req, res, next) {
    try {
        const items = await controlador(null).porEquipo(req, res, next);
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const items = await controlador(null).agregar(req, res, next);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        const items = await controlador(null).eliminar(req, res, next);
    } catch (err) {
        next(err);
    }
}

async function estadisticas(req, res, next) {
    try {
        const items = await controlador(null).estadisticas(req, res, next);
    } catch (err) {
        next(err);
    }
}

module.exports = router;
