import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Welcome from './components/auth/Welcome';
import LogIn from './components/auth/Login';
import Setting from './components/project/Setting';
import Project from './components/project/Project';
import Home from './components/home/Home';
import Register from './components/auth/Register';

function App() {
  return (
    <main className='flex h-screen bg-light-c-111 bg-gray-500'>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/project' element={<Home />}>
              <Route path=':projectId' element={<Setting />} />
              <Route path=':projectId/board' element={<Project />} />
            </Route>
            <Route path='/' element={<Welcome />}>
              <Route path='register' element={<Register />} />
              <Route path='login' element={<LogIn />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </main>
  );
}

export default App;
