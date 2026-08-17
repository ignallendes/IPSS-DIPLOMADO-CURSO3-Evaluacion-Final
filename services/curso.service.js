import { Curso } from '../models/curso.model.js'

// ---------------------------------------------------------------------------
// SERVICE — cursos. Habla con la base de datos.
// Las REGLAS DE NEGOCIO (validar estado, propiedad, etc.) pueden ir aquí o en
// el controller: tú decides, pero que estén en el servidor, no en el cliente.
// ---------------------------------------------------------------------------

// TODO: implementa las funciones que tus controllers necesiten. Por ejemplo:
//   - listarCursos()            → Curso.find().populate('profesor').populate('alumnos')

//TIP nfn + TAB 🤑

export const listarCursos = async () => {

    const cursos = await Curso.find().populate('profesor').populate('alumnos')

    return { cursos }
}
//   - crearCurso(datos)
export const crearCurso = async (datos) => {

    const nuevoCurso = await Curso.create(datos)

    return { curso: nuevoCurso }
}
//   - buscarCurso(id)
export const buscarCurso = async (id) => {

    const curso = await Curso.findById(id).populate('profesor').populate('alumnos')

    return { curso }
}
//   - editarCurso(id, datos)
export const editarCurso = async (id, datos) => {
    const curso = await Curso.findById(id)
    if (!curso) {
        return { error: 'El curso no existe' }
    }
    await Curso.updateOne({ _id: id }, datos)
    const cursoEditado = await Curso.findById(id).populate('profesor').populate('alumnos')
    return { curso: cursoEditado }
}
//   - borrarCurso(id)
export const borrarCurso = async (id) => {
    const curso = await Curso.findById(id)
    if (!curso) { return { error: 'El curso no existe' } }
    await Curso.deleteOne({ _id: id })
    return { curso }
}
//   - cursosDelProfesor(profesorId)
export const cursosDelProfesor = async (profesorId) =>{
    const cursos = await Curso.find({profesor : profesorId}).populate('profesor')
    return {cursos}
}
//   - cursosDelAlumno(alumnoId)
export const cursosDelAlumno = async (alumnoId) => {
    const cursos = await Curso.find({alumnos : alumnoId}).populate('alumnos')
    return {cursos}
}
//
// Piensa qué necesita cada ruta y crea solo lo que uses.


