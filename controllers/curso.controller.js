import * as service from '../services/curso.service.js'

// ---------------------------------------------------------------------------
// CONTROLLERS — cursos. Aquí viven las reglas de negocio.
// El id y el rol del usuario que hace la petición vienen en req.usuario
// (lo puso el middleware `proteger` desde el token).
// ---------------------------------------------------------------------------

// GET /api/cursos — todos los cursos (con populate de profesor y alumnos).
export const listar = async (req, res) => {
  try {
    // TODO: devuelve todos los cursos, con .populate() del profesor y los alumnos.
    const lista = await service.listarCursos();
    //if(!lista){res.status(404).json({error : 'no se han encontrado cursos'})}
    res.status(200).json({ lista })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos — crea un curso (nace EN_MATRICULA, sin profesor).
export const crear = async (req, res) => {
  try {
    // TODO: crea el curso con los datos del body. Status 201.
    const nuevoCurso = await service.crearCurso(req.body);
    res.status(201).json({ nuevoCurso })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// PUT /api/cursos/:id — edita un curso.
export const editar = async (req, res) => {
  try {
    // TODO: edita el curso. Si no existe → 404.
    const id = req.params.id;
    const datos = req.body;
    const editar = await service.editarCurso(id, datos);
    if (editar.error) { return res.status(404).json({ error: editar.error }) }
    res.status(200).json(editar)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE /api/cursos/:id — borra un curso.
export const borrar = async (req, res) => {
  try {
    // TODO: borra el curso. Si no existe → 404.
    const id = req.params.id;
    const cursoEliminado = await service.borrarCurso(id);
    if (cursoEliminado.error) { return res.status(404).json({ error: cursoEliminado.error }) }
    res.status(200).json(cursoEliminado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// GET /api/cursos/mis-cursos — los cursos que dicta ESTE profesor.
export const misCursos = async (req, res) => {
  try {
    // TODO: filtra los cursos por profesor = req.usuario.id.
    const cursosProfesor = await service.cursosDelProfesor(req.usuario.id)
    res.status(200).json(cursosProfesor)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos/:id/asignarme — el profesor se asigna un curso libre.
export const asignarme = async (req, res) => {
  try {
    // TODO — REGLA DE NEGOCIO:
    //   1. Busca el curso. Si no existe → 404.
    //   2. Si YA tiene profesor → 409 (nadie se lo quita a otro).
    //   3. Si está libre → asígnale req.usuario.id como profesor. Guarda.
    const buscar = await service.buscarCurso(req.params.id)
    if (!buscar.curso) { return res.status(404).json({ error: 'El curso no existe' }) }
    const curso = buscar.curso;
    if (curso.profesor) {
      return res.status(409).json({ error: 'Curso con profesor ya asignado' })
    }
    const asignarProfesor = await service.editarCurso(req.params.id, { profesor: req.usuario.id })
    res.status(200).json(asignarProfesor)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// GET /api/cursos/:id/alumnos — solo el profesor que dicta el curso.
export const alumnosDelCurso = async (req, res) => {
  try {
    // TODO — REGLA DE PROPIEDAD:
    //   1. Busca el curso. Si no existe → 404.
    //   2. Si el profesor del curso NO es req.usuario.id → 403.
    //   3. Devuelve la lista de alumnos (con populate).
    const buscarCurso = await service.buscarCurso(req.params.id);
    if (!buscarCurso.curso) { return res.status(404).json({ error: 'El curso no existe' }) }
    if (buscarCurso.curso.profesor?._id?.toString() !== req.usuario.id) { return res.status(403).json({ error: 'Solo el profesor asignado puede ver el curso' }) }
    res.status(200).json(buscarCurso.curso.alumnos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/cursos/mis-matriculas — los cursos donde está matriculado ESTE alumno.
export const misMatriculas = async (req, res) => {
  try {
    // TODO: filtra los cursos que tengan a req.usuario.id en su array de alumnos.
    const alumno = await service.cursosDelAlumno(req.usuario.id)
    res.status(200).json(alumno)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos/:id/matricularme — el alumno se matricula a sí mismo.
export const matricularme = async (req, res) => {
  try {
    // TODO — REGLA DE NEGOCIO:
    //   1. Busca el curso. Si no existe → 404.
    //   2. Si NO está EN_MATRICULA → 409 (curso cerrado).
    //   3. Si el alumno YA está en el curso → 409 (no duplicar).
    //   4. Agrega req.usuario.id al array de alumnos. Guarda.
    const curso = await service.buscarCurso(req.params.id)
    if (!curso.curso) { return res.status(404).json({ error: 'El curso no existe' }) }
    if (curso.curso.estado !== 'EN_MATRICULA') { return res.status(409).json({ error: 'El curso ya está cerrado' }) }
    const matriculado = curso.curso.alumnos.some(
      a => a._id.toString() === req.usuario.id
    )
    if (matriculado) { return res.status(409).json({ error: 'Ya estás matriculado a este curso' }) }

    const nuevoAlumno = [...curso.curso.alumnos, req.usuario.id]  
    
    const matricularAlumno = await service.editarCurso(req.params.id,{alumnos: nuevoAlumno})
    res.status(200).json(matricularAlumno)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE /api/cursos/:id/matricularme — el alumno se sale del curso.
export const desmatricularme = async (req, res) => {
  try {
    // TODO:
    //   1. Busca el curso. Si no existe → 404.
    //   2. Si NO está EN_MATRICULA → 409.
    //   3. Quita a req.usuario.id del array de alumnos. Guarda.
    const buscarCurso = await service.buscarCurso(req.params.id)
    if(!buscarCurso.curso){return res.status(404).json({error:'El curso no existe'})}
    if(buscarCurso.curso.estado !== 'EN_MATRICULA'){return res.status(409).json({error:'El curso ya está cerrado'})}
    const infoAlumno = req.usuario.id;
    const matriculado = buscarCurso.curso.alumnos.some(
      a => a._id.toString() === infoAlumno
    )
    if(!matriculado){return res.status(404).json({error: 'No estás matriculado en este curso'})}
    const desmatricular = buscarCurso.curso.alumnos.filter(
      a => a._id.toString() !== infoAlumno
    )
    const cursoActualizado = await service.editarCurso(req.params.id, {alumnos: desmatricular})
    res.status(200).json(cursoActualizado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
