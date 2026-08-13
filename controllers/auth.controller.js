import { Profesor } from '../models/profesor.model.js'
import * as service from '../services/auth.service.js'

// ---------------------------------------------------------------------------
// CONTROLLERS — autenticación.
// Cada uno recibe la petición, llama al service, y responde con el status
// correcto. Envuelve todo en try/catch para no reventar el servidor.
// ---------------------------------------------------------------------------

// POST /api/auth/registro/profesor
export const registrarProfesor = async (req, res) => {
  try {
    // TODO: llama al service para crear el profesor (con la password hasheada)
    //       y devuelve su token. Status 201.
    //       Recuerda: NO devuelvas la password en la respuesta.
    const nuevoProfesor = await service.registrarProfesor(req.body)
    res.status(201).json(nuevoProfesor)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// POST /api/auth/registro/alumno
export const registrarAlumno = async (req, res) => {
  try {
    // TODO: igual que el profesor, pero para el alumno.
    const nuevoAlumno = await service.registrarAlumno(req.body)
    res.status(201).json(nuevoAlumno)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    // TODO:
    //   1. Recibe email y password del body.
    //   2. Busca al usuario (¿profesor o alumno? decide cómo lo resuelves).
    //   3. Compara la password con bcrypt.
    //   4. Si no coincide → 401.
    //   5. Si coincide → firma un token que incluya el id y el ROL, y devuélvelo.
    const email = req.body.email;
    const password = req.body.password;

    const loger = await service.login(email, password)
     if (loger) {
      res.status(200).json(loger)
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' })
    }


  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
