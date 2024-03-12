import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
export default function RegistroModal({ isOpen, onRequestClose }) {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    nombre: null,
    apellido: null,
    email: null,
    password: null,
    general: null,
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
    setErrors({ ...errors, [name]: null, general: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!usuario.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!usuario.apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!usuario.email)
      newErrors.email = 'El correo electrónico es obligatorio';
    if (!usuario.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(usuario.password)) {
        newErrors.password =
          'La contraseña debe contener al menos una mayúscula y un número';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({
        ...newErrors,
      });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5432/api/users/post',
        usuario
      );

      if (response.status === 201) {
        setUsuario({ nombre: '', apellido: '', email: '', password: '' });
        setSuccessMessage('Usuario creado con éxito');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (error) {
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.errors) {
          const { errors } = responseData;
          const formattedErrors = {};
          errors.forEach((error) => {
            formattedErrors[error.param] = error.msg;
          });
          setErrors({ ...formattedErrors, general: null });
        } else if (responseData.error) {
          setErrors({ general: responseData.error });
        } else {
          setErrors({
            general:
              'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.',
          });
        }
      } else {
        setErrors({
          general:
            'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.',
        });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onRequestClose}
      placement="top-center"
      className="w-4/5 md:w-full"
    >
      <ModalContent>
        {successMessage && (
          <div className="text-center p-2 bg-green-100 text-green-800 rounded">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">Registro</ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Nombre"
              placeholder="Ingresa tu nombre"
              variant="bordered"
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
            />
            {errors.nombre && (
              <p className="text-red-600 mt-1">{errors.nombre}</p>
            )}
            <Input
              label="Apellido"
              placeholder="Ingresa tu apellido"
              variant="bordered"
              name="apellido"
              value={usuario.apellido}
              onChange={handleChange}
            />
            {errors.apellido && (
              <p className="text-red-600">{errors.apellido}</p>
            )}
            <Input
              label="Correo Electrónico"
              placeholder="Ingresa tu correo electrónico"
              variant="bordered"
              name="email"
              value={usuario.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-600">{errors.email}</p>}
            <Input
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              variant="bordered"
              name="password"
              type="password"
              value={usuario.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-600">{errors.password}</p>
            )}
            {errors.general && <p className="text-red-600">{errors.general}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onRequestClose}>
              Cerrar
            </Button>
            <Button color="primary" type="submit">
              Registrar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
