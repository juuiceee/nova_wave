import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.module.scss';
import { NewPostLink, ProfileLink, TrendsLink } from './domain/links/links';
import useUserStore from './domain/user/userStore';
import Header from './layouts/header/header';
import { Content } from './layouts/main/content';
import { NewsFeed } from './layouts/newsFeed/newsFeed';
import { PostCreator } from './layouts/postCreator/postCreator';
import { Profile } from './layouts/user/profile/profile';

function App() {

  const [user, checkAuth] = useUserStore(state => [state.user, state.checkAuth])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      checkAuth()
    }
  }, [])

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Content />}>
          <Route index element={<NewsFeed />} />
          <Route path={TrendsLink} element={<NewsFeed />} />
          <Route path={NewPostLink} element={<PostCreator user={user} />} />
          <Route path={ProfileLink} element={<Profile user={user} />} />
          <Route path='*' element={<></>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
