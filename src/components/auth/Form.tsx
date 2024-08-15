import { Button, ChakraProvider, Input, useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import {
  FieldErrorsImpl,
  FieldValues,
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import WithLabel from '../util/WithLabel';

interface Props {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrorsImpl<{
    [x: string]: any;
  }>;
  onSubmit: (body: {}) => Promise<any>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  type: 'LOGIN' | 'SIGNUP';
}

type APIERROR = { message: string };

const Form = (props: Props) => {
  const { register, onSubmit, handleSubmit, errors, type } = props;
  const toast = useToast();

  const submit = handleSubmit(async (form) => {
    try {
      onSubmit(form);
    } catch (error) {
      const err = (error as AxiosError).response?.data as APIERROR;
      toast({
        title: 'Resiger error',
        description: err.message,
        status: 'error',
        isClosable: true,
        position: 'top-right',
        duration: null,
      });
    }
  });

  return (
    <form onSubmit={submit}>
      <ChakraProvider>
        <WithLabel label='Email' labelClass='text-[14px]'>
          <>
            <Input
              {...register('email', {
                required: { value: true, message: 'email must not be empty' },
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                  message: 'please provide a valid email',
                },
              })}
              size='sm'
              borderColor='gray'
              border='1.5px solid'
            />
            {errors.email && <ErrorMsg msg={errors.email.message as string} />}
          </>
        </WithLabel>
        {type === 'SIGNUP' && (
          <WithLabel label='Username' labelClass='text-[14px]'>
            <>
              <Input
                {...register('username', {
                  required: { value: true, message: 'username must not be empty' },
                  minLength: { value: 2, message: 'must be at least two characters long' },
                  pattern: { value: /^[A_Za-z0-9_]+$/, message: 'username can be a-z,A-Z,0-9,_' },
                })}
                size='sm'
                border='1.5px solid'
                borderColor='gray'
              />
              {errors.username && <ErrorMsg msg={errors.username.message as string} />}
            </>
          </WithLabel>
        )}
        <WithLabel label='Password' labelClass='text-[14px]'>
          <>
            <Input
              {...register('pwd', {
                required: { value: true, message: 'password must not be empty' },
                minLength: { value: 4, message: 'must be at least 4 characters long' },
                maxLength: { value: 14, message: 'must be under 15 characters' },
              })}
              size='sm'
              border='1.5px solid'
              borderColor='gray'
            />
            {errors.pwd && <ErrorMsg msg={errors.pwd.message as string} />}
          </>
        </WithLabel>
        <hr className='border-t-[.5px] border-gray-400 mt-3' />
        <span className='text-[12px] text-gray-600 block mt-6'>
          By clicking below, you agree to the our
          <span className='text-blue-800'> Privacy Policy.</span>
        </span>
        <Button
          type='submit'
          size='sm'
          width='full'
          colorScheme='blue'
          color='white'
          bgColor='#321898'
          borderRadius={3}
          mt={4}
          py={5}
        >
          {type === 'SIGNUP' ? 'Join now' : 'Log In'}
        </Button>
      </ChakraProvider>
    </form>
  );
};

export default Form;

const ErrorMsg = ({ msg }: { msg: string }) => (
  <span className='text-[13px] text-red-500'>{msg}</span>
);
