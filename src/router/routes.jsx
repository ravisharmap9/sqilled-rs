import LayoutWithoutSidebar from '../components/layout/without-sidebar';
import Home from '../screens/home';
import Login from '../screens/login';
import Register from '../screens/register';
import EditProfile from '../screens/edit-profile';
import ViewProfile from '../screens/view-profile';
import SearchList from '../screens/search-list';
import SearchDetails from '../screens/search-details';
import MyBookings from '../screens/my-bookings/index';
import VideoChat from '../screens/videoChat/index';
import RecordVideo from '../screens/edit-profile/recordVideo';
import WriterAvailability from '../screens/my-bookings/writer-availability';

export const publicRoutes = [
  {
    key: 'home',
    exact: true,
    path: '/',
    component: Home,
    layout: LayoutWithoutSidebar,
  },
  {
    key: 'login',
    exact: true,
    path: '/login',
    component: Login,
    layout: LayoutWithoutSidebar,
  },
  {
    key: 'register',
    exact: true,
    path: '/register',
    component: Register,
    layout: LayoutWithoutSidebar,
  },
  {
    key: 'EditProfile',
    exact: true,
    path: '/edit-profile',
    component: EditProfile,
    layout: LayoutWithoutSidebar,
  },
  {
    key: 'ViewProfile',
    exact: true,
    path: '/view-profile',
    component: ViewProfile,
    layout: LayoutWithoutSidebar,
  },
  {
    key: 'SearchList',
    exact: true,
    path: '/search',
    component: SearchList,
    layout: LayoutWithoutSidebar,
  },
  {
    key: 'SearchDetails',
    exact: true,
    path: '/search-details',
    component: SearchDetails,
    layout: LayoutWithoutSidebar,
  },
  {
    key: 'MyBookings',
    exact: true,
    path: '/my-bookings',
    component: MyBookings,
    layout: LayoutWithoutSidebar,
  },
  {
    key: 'VideoChat',
    exact: true,
    path: '/video-chat',
    component: VideoChat,
    layout: LayoutWithoutSidebar
  },
  {
    key: 'RecordVideo',
    exact: true,
    path: '/record-self-video-profile',
    component: RecordVideo,
    layout: LayoutWithoutSidebar
  },
  {
    key: 'WriterAvailability',
    exact: true,
    path: '/writer-availability',
    component: WriterAvailability,
    layout: LayoutWithoutSidebar
  }
];
export const privateRoutes = [

];
