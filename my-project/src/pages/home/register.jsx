import React, { useState } from 'react';
import axios from 'axios';

function Registro() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    numeroDeTelefono: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/users/post', usuario);
      console.log('Usuario registrado:', response.data);
    } catch (error) {
      console.error('Error al registrar el usuario:', error.response.data);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={usuario.nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          type="text"
          name="apellido"
          value={usuario.apellido}
          onChange={handleChange}
          placeholder="Apellido"
        />
        <input
          type="text"
          name="numeroDeTelefono"
          value={usuario.numeroDeTelefono}
          onChange={handleChange}
          placeholder="Número de Teléfono (ej. +1234567890)"
        />
        <input
          type="password"
          name="password"
          value={usuario.password}
          onChange={handleChange}
          placeholder="Contraseña"
        />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Registro;
