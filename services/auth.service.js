import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRA } from '../config/jwt.js'
import { Profesor } from '../models/profesor.model.js'
import { Alumno } from '../models/alumno.model.js'

// ---------------------------------------------------------------------------
// SERVICE — autenticación. Habla con la base de datos y con bcrypt/jwt.
// El controller no toca la base directamente: llama a estas funciones.
// ---------------------------------------------------------------------------

// Firma un token con el id y el rol. Úsalo al registrar y al hacer login.
export const firmarToken = (id, rol) =>
  jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: JWT_EXPIRA })

// TODO: registra un profesor.
//   - hashea la password con bcrypt (bcrypt.hash(password, 10))
//   - créalo en la base
//   - devuelve { token, profesor } (sin la password)
export const registrarProfesor = async (datos) => {
  const hashedPassword = await bcrypt.hash(datos.password,10);

  const nuevoProfesor = await Profesor.create({
    nombre : datos.nombre,
    email : datos.email,
    password : hashedPassword
  });

  const profesorObj = nuevoProfesor.toObject();

  delete profesorObj.password;

  const token = firmarToken(nuevoProfesor._id, 'PROFESOR')

  return {token, profesor : profesorObj};
}

// TODO: registra un alumno (igual que el profesor).
export const registrarAlumno = async (datos) => {
  const hashedPassword = bcrypt.hash(datos.password,10);

  const nuevoAlumno = await Alumno.create({
    nombre : datos.nombre,
    email : datos.email,
    telefono : datos.telefono,
    password : hashedPassword
  });

  const alumnoObj =nuevoAlumno.toObject();

  delete alumnoObj.password;

  const token = firmarToken(nuevoAlumno._id, 'ALUMNO');

  return {token , alumno : alumnoObj};
}

// TODO: login.
//   - busca al usuario por email (en Profesor y en Alumno)
//   - compara la password con bcrypt.compare(...)
//   - si coincide, devuelve { token, rol } con el rol correcto
//   - si no, devuelve null (para que el controller responda 401)
export const login = async (email, password) => {
  let usuario = await Profesor.findOne({email})

  let rol = 'PROFESOR';

  if(!usuario){
    usuario = await Alumno.findOne({email})
    rol = 'ALUMNO';
  }

  if(!usuario) return null
  
  const passwordValida = await bcrypt.compare(password, usuario.password)

  if(!passwordValida) return null 

  const token = firmarToken(usuario._id, rol)

  return {token, rol}

}
