const request = require('supertest')
const server = require('../index')

describe('API de Cafés', () => {
  it('debe devolver un código de estado 200 al obtener la lista de cafés', async () => {
    const response = await request(server).get('/cafes')
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThanOrEqual(1)
  })

  it('debe devolver un código de estado 404 cuando se intenta eliminar un café que no existe', async () => {
    const idEliminar = 100
    const jwt = 'Token'
    const response = await request(server)
      .delete(`/cafes/${idEliminar}`)
      .set('Authorization', jwt)

    expect(response.status).toBe(404)
  })

  it('debe crear un nuevo café y devolver un código de estado 201', async () => {
    const id = Math.floor(Math.random() * 999)
    const nuevoCafe = { id, nombre: 'Nuevo cafe' }
    const response = await request(server).post('/cafes').send(nuevoCafe)

    expect(response.status).toBe(201)
    expect(response.body).toContainEqual(nuevoCafe)
  })

  it('debe devolver un código de estado 400 al intentar actualizar un café con un ID diferente', async () => {
    const id = 2
    const payload = {
      id: 3,
      nombre: 'Americano'
    }
    const response = await request(server).put(`/cafes/${id}`).send(payload)

    expect(response.status).toBe(400)
  })

  it('debe encontrar un café por ID y devolver un código de estado 200', async () => {
    const response = await request(server).get('/cafes/1')
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).not.toBeInstanceOf(Array)
  })

  it('debe devolver un código de estado 404 cuando no se encuentra un café por ID', async () => {
    const response = await request(server).get('/cafes/500')
    expect(response.status).toBe(404)
  })

  it('debe devolver un código de estado 400 al intentar agregar un café con un ID existente', async () => {
    const id = 1
    const nuevoCafe = { id, nombre: 'Nuevo cafe' }
    const response = await request(server).post('/cafes').send(nuevoCafe)
    expect(response.status).toBe(400)
  })
})
