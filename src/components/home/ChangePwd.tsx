import { useState } from 'react';
import { FieldError, FieldValues, useForm } from 'react-hook-form';
import type { AxiosError } from 'axios';
import InputWithValidation from '../util/InputWithValidation';
import axiosDf from '../../api/axios';
import toast from 'react-hot-toast';

type APIERROR = { message: string };

function ChangePwd() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: loading, isSubmitSuccessful: success },
  } = useForm();
  const [error, setError] = useState('');

  const handleChangePwd = async (form: FieldValues) => {
    try {
      await changePwd(form);
      toast('Account password changed');
      setError('');
    } catch (error) {
      setError(((error as AxiosError).response?.data as APIERROR).message);
    }
  };

  return (
    <>
      <h2 className='mt-2 text-2xl text-c-text'>Change Password</h2>
      {success && !error ? (
        <div className='mt-5 grid h-40 place-items-center text-center text-xl font-semibold text-c-text'>
          Password changed successfully 🚀
        </div>
      ) : (
        <>
          <div className='mt-5 flex w-[16.5rem] flex-col gap-4'>
            <InputWithValidation
              label='Old password'
              placeholder='enter your old password'
              register={register('oldPwd', {
                required: {
                  value: true,
                  message: 'password must not be empty',
                },
              })}
              error={errors.oldPwd as FieldError}
              darkEnabled
              type='password'
            />
            <InputWithValidation
              label='New password'
              placeholder='enter your old password'
              register={register('newPwd', {
                required: {
                  value: true,
                  message: 'password must not be empty',
                },
                minLength: {
                  value: 6,
                  message: 'must be at least 6 characters long',
                },
                pattern: {
                  value:  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ ,
                  message: 'Password must have atleast 1 lowercase, 1 uppercase, 1 special character, and 1 number' 
                },
                maxLength: { value: 14, message: 'must be under 15 characters' },
              })}
              error={errors.newPwd as FieldError}
              darkEnabled
              type='password'
            />
          </div>
          {error && <span className='mt-4 block text-left text-red-400'>{error}</span>}
          <button onClick={handleSubmit(handleChangePwd)} className='btn mt-8 w-full'>
            {loading ? 'proceeding ...' : 'Change'}
          </button>
        </>
      )}
    </>
  );
}

export default ChangePwd;

async function changePwd(body: FieldValues) {
  const result = await axiosDf.put('auth/changePwd', body);
  return result.data;
}
