import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import axios from 'axios';
import { useState } from 'react';

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [credenciales, setCredenciales] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: null,
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

    const newErrors = {};

    if (!credenciales.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    }

    if (!credenciales.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({
        ...newErrors,
        general: 'Por favor, corrija los errores en el formulario.',
      });
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5432/api/users/inicio-sesion',
        credenciales
      );

      if (response.status >= 200 && response.status < 300) {
        // El inicio de sesión fue exitoso
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);

        onOpenChange();
        alert('Inicio de sesión exitoso');
        setCredenciales({ email: '', password: '' });
        window.location.reload();
      } else {
        // La solicitud no fue exitosa
        const responseData = response.data;

        // Revisa si la respuesta contiene errores específicos
        if (responseData && responseData.errors) {
          // Revisar si hay errores específicos para el correo electrónico o la contraseña
          if (responseData.errors.email) {
            // Se recibió un mensaje de error específico para el correo electrónico
            newErrors.email = responseData.errors.email;
          }
          if (responseData.errors.password) {
            // Se recibió un mensaje de error específico para la contraseña
            newErrors.password = responseData.errors.password;
          }
        }
        setErrors(newErrors);
      }
    } catch (error) {
      // Error al realizar la solicitud
      console.error(error);
      setErrors({
        general:
          'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.',
      });
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="secondary" size="ml" rounded="ml">
        Log in
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                  name="email"
                  value={credenciales.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-600">{errors.email}</p>}
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                  name="password"
                  value={credenciales.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-red-600">{errors.password}</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Closes
                </Button>
                <Button color="primary" type="submit">
                  Sign in
                </Button>
              </ModalFooter>
              {errors.general && (
                <p className="text-red-600">{errors.general}</p>
              )}
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
