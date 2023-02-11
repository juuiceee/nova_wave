import { Route, Routes } from 'react-router-dom';
import './App.module.scss';
import { Content } from './layouts/main/content';
import { NewsFeed } from './layouts/newsFeed/newsFeed';
import { Auth } from './layouts/user/auth/auth';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Content />}>
          <Route index element={<NewsFeed />} />
          <Route path='/profile' element={<Auth />} />
          <Route path='*' element={<></>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
