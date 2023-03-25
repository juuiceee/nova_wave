import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.module.scss';
import { NewLink, PostEditor, PostLink, ProfileLink, TrendsLink } from './domain/links/links';
import useUserStore from './domain/user/userStore';
import Header from './layouts/header/header';
import { Content } from './layouts/main/content';
import { NewsFeed } from './layouts/newsFeed/newFeed';
import { PostCreator } from './layouts/postCreator/postCreator';
import { PostPage } from './layouts/postPage/postPage';
import { TrendFeed } from './layouts/trendsFeed/trendFeed';
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
          <Route path={TrendsLink} element={<TrendFeed />} />
          <Route path={NewLink} element={<NewsFeed />} />
          {/* <Route path={FavouritesLink} element={<FavoriteFeed />} /> */}
          <Route path={PostLink} element={<PostPage />} />
          <Route path={PostEditor} element={<PostCreator user={user} />} />
          <Route path={ProfileLink} element={<Profile user={user} />} />
          <Route path='*' element={<></>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
