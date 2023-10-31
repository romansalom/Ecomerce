import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function InicioSesionModal({ isOpen, onRequestClose }) {
  const [credenciales, setCredenciales] = useState({
    numeroDeTelefono: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    numeroDeTelefono: null,
    password: null,
    general: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciales({ ...credenciales, [name]: value });
    setErrors({ ...errors, [name]: null, general: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const telefonoRegex = /^\+\d+$/;

    const newErrors = {};

    if (!credenciales.numeroDeTelefono) {
      newErrors.numeroDeTelefono = 'El número de teléfono es obligatorio';
    } else if (!telefonoRegex.test(credenciales.numeroDeTelefono)) {
      newErrors.numeroDeTelefono = 'El número de teléfono debe comenzar con "+" y consistir en dígitos numéricos';
    }

    if (!credenciales.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...newErrors, general: 'Por favor, corrija los errores en el formulario.' });
      return;
    }

    try {
      // Realizar la solicitud de inicio de sesión
      // Reemplaza la URL con la URL de tu servidor de inicio de sesión
      const response = await axios.post('http://localhost:3001/api/users/inicio-sesion', credenciales);

      if (response.status >= 200 && response.status < 300) {
        // Almacenar el token y el ID del usuario en el almacenamiento local
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);

        onRequestClose(); // Cierra el modal
        alert('Inicio de sesión exitoso');
        setCredenciales({
          numeroDeTelefono: '',
          password: '',
        }); // Limpia el formulario

        // Refresca la página para aplicar los cambios en el Navbar
        window.location.reload();
      } else {
        if (response.data.error) {
          setErrors({ general: response.data.error });
        } else {
          setErrors({ general: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.' });
        }
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.' });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Inicio de Sesión Modal"
      className="w-full max-w-sm p-4 bg-white rounded-lg mx-auto mt-20"
    >
      <h2 className="text-xl font-bold mb-4">Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="numeroDeTelefono"
            value={credenciales.numeroDeTelefono}
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
            value={credenciales.password}
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
          Iniciar Sesión
        </button>
      </form>
    </Modal>
  );
}

export default InicioSesionModal;