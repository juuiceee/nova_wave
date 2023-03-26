import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.module.scss';
import { FavoritesLink, NewLink, PostEditor, PostLink, ProfileLink, TrendsLink } from './domain/links/links';
import useUserStore from './domain/user/userStore';
import { NotFoundPage } from './layouts/errorPages/notFoundPage/notFoundPage';
import { FavoriteFeed } from './layouts/favoritesFeed/favoriteFeed';
import Header from './layouts/header/header';
import { Content } from './layouts/main/content';
import { NewsFeed } from './layouts/newsFeed/newFeed';
import { PostCreator } from './layouts/postCreator/postCreator';
import { PostPage } from './layouts/postPage/postPage';
import { TrendFeed } from './layouts/trendsFeed/trendFeed';
import { Profile } from './layouts/user/profile/profile';
import { ScrollToTop } from './tools/router/scrollToTop';

function App() {

  const [user, checkAuth] = useUserStore(state => [state.user, state.checkAuth])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      checkAuth()
    }
  }, [])

  return (
    <ScrollToTop>
      <Header />
      <Routes>
        <Route path='/' element={<Content />}>
          <Route index element={<NewsFeed />} />
          <Route path={TrendsLink} element={<TrendFeed />} />
          <Route path={NewLink} element={<NewsFeed />} />
          <Route path={FavoritesLink} element={<FavoriteFeed />} />
          <Route path={PostLink} element={<PostPage />} />
          <Route path={PostEditor} element={<PostCreator />} />
          <Route path={ProfileLink} element={<Profile />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ScrollToTop>
  );
}

export default App;
