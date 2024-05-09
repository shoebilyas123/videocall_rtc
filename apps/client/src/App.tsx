import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Local Imports
import Lobby from './components/lobby';
import Room from './components/room';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Lobby />,
  },
  {
    path: '/room/:rId',
    element: <Room />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
