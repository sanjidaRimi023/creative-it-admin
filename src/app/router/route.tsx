import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";

const router = createBrowserRouter([
 {
    path: '/', 
    element: <RootLayout/>,
    children:[
      {
         path: 'sign-in',
         element: 'div'
      }
    ]
 }
]);
export default router;
