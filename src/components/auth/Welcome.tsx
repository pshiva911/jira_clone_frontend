import { Icon } from '@iconify/react';
import { Link, Outlet } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className='flex w-full items-center h-sreen min-h-fit bg-gradient-to-r from-[#151642] to-[#321898]'>
      <div className='w-1/2 text-white tracking-wide'>
        <div className='w-8/12 mx-auto'>
          <h1 className='text-5xl font-semibold'>
            The #1 software development tool used by agile teams
          </h1>
          <button className='border-2 px-4 py-1 mt-9 group hover:border-dashed rounded-md flex items-center'>
            <span><Link to={'/login'}>Go to demo</Link></span>
            <Icon
              className='ml-2 duration-300 group-hover:translate-x-3'
              width={25}
              icon='bi:arrow-right-short'
            />
          </button>
        </div>
      </div>
      <div className='w-1/2'>
        <Outlet />
      </div>
    </div>
  );
};

export default Welcome;
