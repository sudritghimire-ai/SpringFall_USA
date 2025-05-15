import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import About from "../pages/minipages/About";
import ContactUs from "../pages/minipages/ContactUs";
import Privacy from "../pages/minipages/privacy"; // Corrected import
import SingleBlog from "../pages/blogs/singleBlog/SingleBlog";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AddPost from "../pages/admin/components/AddPost";
import ManagePost from "../pages/admin/components/ManagePost";
import PrivateRouter from "./PrivateRouter";
import UpdatePost from "../pages/admin/components/UpdatePost";


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about-us',
        element: <About />
      },
      {
        path: '/contact-us',
        element: <ContactUs />
      },
      {
        path: '/privacy-policy',
        element: <Privacy /> // Corrected element usage
      },
      {
        path:"/blogs/:id",
        element: <SingleBlog/>
      },{
        path:'/login',
        element: <Login />
      },{
        path:'/register',
        element: <Register />
      },{
          path:'dashboard',
          element:<AdminLayout/>,
          //will be protected by the admin
          children: [ 
            {
              path: '',
            element: <Dashboard />
            },{
              path: 'add-new-post',
              element: <AddPost/>
            },
            {
              path: 'manage-items',
              element: <ManagePost/>
            },
            {
              path:'update-items/:id',
              element: <UpdatePost />
            }
          ]

      }
      

    ]
  }
]);

export default router;
