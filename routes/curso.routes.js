import { Router } from 'express'
import * as controller from '../controllers/curso.controller.js'
import { proteger, soloRol } from '../middlewares/proteger.js'

// ---------------------------------------------------------------------------
// RUTAS — cursos. La mayoría van protegidas y con rol.
// Recuerda: todo lo de aquí exige token. Pon `proteger` (y `soloRol` donde
// corresponda) delante del controller.
// ---------------------------------------------------------------------------
export const cursoRoutes = Router()

// TODO: conecta cada ruta. Ejemplos de la forma (ver enunciado para el detalle):
//
//  ── Profesor ──
cursoRoutes.get('/mis-cursos', proteger, soloRol('PROFESOR'), controller.misCursos)
cursoRoutes.get('/mis-matriculas', proteger, soloRol('ALUMNO'), controller.misMatriculas)
cursoRoutes.get('/', proteger, soloRol('PROFESOR'), controller.listar)
cursoRoutes.post('/', proteger, soloRol('PROFESOR'), controller.crear)

cursoRoutes.put('/:id', proteger, soloRol('PROFESOR'), controller.editar)
cursoRoutes.delete('/:id', proteger, soloRol('PROFESOR'), controller.borrar)
cursoRoutes.post('/:id/asignarme', proteger, soloRol('PROFESOR'), controller.asignarme)
cursoRoutes.get('/:id/alumnos', proteger, soloRol('PROFESOR'), controller.alumnosDelCurso)
//
//  ── Alumno ──
cursoRoutes.post('/:id/matricularme', proteger, soloRol('ALUMNO'), controller.matricularme)
cursoRoutes.delete('/:id/matricularme', proteger, soloRol('ALUMNO'), controller.desmatricularme)
//
// ⚠️ OJO con el orden: las rutas fijas (/mis-cursos) van ANTES que las
//    dinámicas (/:id), o Express interpretará "mis-cursos" como un :id.
