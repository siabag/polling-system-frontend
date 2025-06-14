import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { RegisterUserData } from '../../types/auth';
import useAuth from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

// Esquema de validación
const schema = yup.object().shape({
  firstName: yup.string().required('El nombre es requerido'),
  lastName: yup.string().required('El apellido es requerido'),
  email: yup
    .string()
    .email('Ingrese un correo electrónico válido')
    .required('El correo electrónico es requerido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirme su contraseña'),
  roleId: yup.number().default(2),
});

const RegisterForm: React.FC = () => {
  const { register: registerUser, error, loading, clearErrors } = useAuth();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserData>({
    resolver: yupResolver(schema),
  });

  // Mostrar errores de registro
  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setShowAlert(true);
    }
  }, [error]);

  const onSubmit = async (data: RegisterUserData) => {
    // Por defecto, los usuarios registrados son encuestadores (roleId = 2)
    await registerUser({ ...data, roleId: 2 });
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    clearErrors();
  };

  return (
    <div>
      {showAlert && (
        <Alert
          type="error"
          message={alertMessage}
          onClose={handleCloseAlert}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            type="text"
            id="firstName"
            autoComplete="given-name"
            error={errors.firstName?.message}
            fullWidth
            {...register('firstName')}
          />

          <Input
            label="Apellido"
            type="text"
            id="lastName"
            autoComplete="family-name"
            error={errors.lastName?.message}
            fullWidth
            {...register('lastName')}
          />
        </div>

        <Input
          label="Correo electrónico"
          type="email"
          id="email"
          autoComplete="email"
          error={errors.email?.message}
          fullWidth
          {...register('email')}
        />

        <Input
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="new-password"
          error={errors.password?.message}
          fullWidth
          //helperText="La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número"
          {...register('password')}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          fullWidth
          {...register('confirmPassword')}
        />

        <div className="mt-1">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Registrarse
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tiene una cuenta?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;