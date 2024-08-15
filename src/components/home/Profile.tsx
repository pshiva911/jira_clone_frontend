import { Avatar, Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { FieldError, FieldValues, useForm } from 'react-hook-form';
import { selectAuthUser, useUpdateAuthUserMutation } from '../../api/auth.endpoint';
import InputWithValidation from '../util/InputWithValidation';

const Profile = () => {
  const { authUser: u } = selectAuthUser();
  const [updateAuthUser] = useUpdateAuthUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: loading },
  } = useForm();

  const handleUpdate = async (form: FieldValues) => {
    if (
      !u ||
      (form.username === u.username && form.email === u.email && form.profileUrl === u.profileUrl)
    )
      return;
    await updateAuthUser(form);
  };

  return (
    <div className='w-[320px] flex flex-col items-center bg-c-1 border-r-2 border-c-4 h-full p-6'>
      {u ? (
        <ChakraProvider>
          <Avatar src={u?.profileUrl} name={u?.username} w={40} h={40} />
          <Stack spacing={4} mt={8}>
            <InputWithValidation
              label='Username'
              placeholder='username'
              defaultValue={u.username}
              register={register('username', {
                required: { value: true, message: 'username must not be empty' },
              })}
              error={errors.username as FieldError}
            />
            <InputWithValidation
              label='Email'
              placeholder='email'
              defaultValue={u.email}
              register={register('email', {
                required: { value: true, message: 'username must not be empty' },
              })}
              error={errors.email as FieldError}
              readonly
            />
            <InputWithValidation
              label='Photo Url'
              placeholder='profile picture'
              defaultValue={u.profileUrl}
              register={register('profileUrl')}
              error={errors.profileUrl as FieldError}
            />
          </Stack>
          <Button
            borderRadius={2}
            size='sm'
            mt={10}
            colorScheme='messenger'
            bgColor='#0052cc'
            fontWeight='normal'
            fontSize={15}
            w='full'
            isLoading={loading}
            onClick={handleSubmit(handleUpdate)}
          >
            Save Changes
          </Button>
          <div className='mt-auto w-full text-c-6'>
            <Text fontSize={16}>
              Last logged In
              <span className='tracking-wide font-semibold ml-3'>
                {new Date(u.lastLoggedIn).toLocaleDateString()}
              </span>
            </Text>
            <Text fontSize={16}>
              Joined at
              <span className='tracking-wide font-semibold ml-3'>
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
            </Text>
          </div>
        </ChakraProvider>
      ) : null}
    </div>
  );
};

export default Profile;
