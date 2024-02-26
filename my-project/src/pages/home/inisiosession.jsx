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

  const [loading, setLoading] = useState(false); // Estado para controlar el loading

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
    setLoading(true); // Mostrar loading al enviar la solicitud

    try {
      const response = await axios.post(
        'http://localhost:5432/api/users/inicio-sesion',
        credenciales
      );

      if (response.status === 200) {
        // El inicio de sesión fue exitoso
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);

        onOpenChange();
        setCredenciales({ email: '', password: '' });
        window.location.reload();
      }
    } catch (error) {
      // Error al realizar la solicitud
      if (error.response) {
        const responseData = error.response.data;

        // Revisa si la respuesta contiene errores específicos
        if (responseData && responseData.error) {
          // Revisa si el error es por contraseña incorrecta
          if (responseData.error === 'Contraseña incorrecta') {
            setErrors({
              ...errors,
              password: 'Contraseña incorrecta',
              general: null,
            });
          } else {
            setErrors({
              ...errors,
              general: responseData.error,
              password: null,
            });
          }
        } else {
          setErrors({
            ...errors,
            general:
              'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.',
            password: null,
          });
        }
      } else {
        setErrors({
          ...errors,
          general:
            'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.',
          password: null,
        });
      }
    } finally {
      setLoading(false); // Ocultar loading después de recibir la respuesta
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
                  placeholder="Ingresa tu correo"
                  variant="bordered"
                  name="email"
                  value={credenciales.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-600">{errors.email}</p>}
                <Input
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
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
                  {loading ? 'Loading...' : 'Sign in'}{' '}
                  {/* Mostrar loading o texto del botón según el estado */}
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
