import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function RegistroModal({ isOpen, onRequestClose }) {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    numeroDeTelefono: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    nombre: null,
    apellido: null,
    numeroDeTelefono: null,
    password: null,
    general: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
    setErrors({ ...errors, [name]: null, general: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const telefonoRegex = /^\+\d+$/;

    const newErrors = {};

    if (!usuario.nombre) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!usuario.apellido) {
      newErrors.apellido = 'El apellido es obligatorio';
    }
    if (!usuario.numeroDeTelefono) {
      newErrors.numeroDeTelefono = 'El número de teléfono es obligatorio';
    } else if (!telefonoRegex.test(usuario.numeroDeTelefono)) {
      newErrors.numeroDeTelefono = 'El número de teléfono debe comenzar con "+" y consistir en dígitos numéricos';
    }
    if (!usuario.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(usuario.password)) {
        newErrors.password = 'La contraseña debe contener al menos una mayúscula y un número';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...newErrors, general: 'Por favor, corrija los errores en el formulario.' });
      return;
    }

    try {
        const response = await axios.post('http://localhost:3001/api/users/post', usuario);
      
        if (response.status >= 200 && response.status < 300) {
          onRequestClose(); // Cierra el modal
          alert('Registro exitoso');
          setUsuario({
            nombre: '',
            apellido: '',
            numeroDeTelefono: '',
            password: '',
          }); // Limpia el formulario
        } else {
          if (response.data.error) {
            setErrors({ general: response.data.error });
          } else {
            setErrors({ general: 'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.' });
          }
        }
      } catch (error) {
        console.error(error);
        setErrors({ general: 'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.' });
      }
    }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Registro Modal"
      className="w-full max-w-sm p-4 bg-white rounded-lg mx-auto mt-20"
    >
      <h2 className="text-xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full p-2 border rounded"
          />
          {errors.nombre && <p className="text-red-600">{errors.nombre}</p>}
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="apellido"
            value={usuario.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            className="w-full p-2 border rounded"
          />
          {errors.apellido && <p className="text-red-600">{errors.apellido}</p>}
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="numeroDeTelefono"
            value={usuario.numeroDeTelefono}
            onChange={handleChange}
            placeholder="Número de Teléfono"
            className="w-full p-2 border rounded"
          />
          {errors.numeroDeTelefono && <p className="text-red-600">{errors.numeroDeTelefono}</p>}
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={usuario.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-600">{errors.password}</p>}
        </div>
        {errors.general && <p className="text-red-600">{errors.general}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Registrar
        </button>
      </form>
    </Modal>
  );
}

export default RegistroModal;
