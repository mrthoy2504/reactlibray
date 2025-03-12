
import { Sidebar } from "../components/sidebar.jsx";
// import { TopNav } from "../components/top-nav.jsx";
import "./globals.css";
import { useAuth } from "../context/auth.jsx";


const Dashboard = ({ children }) => {
  const [auth, setAuth] = useAuth();
  const token = auth?.token;

  const [hidden, setHidden] = useAuth(false);


  return (
    <div className="min-h-screen bg-white">
      {/* <button 
      onClick={()=>{setHidden(true)}}
      >click</button> */}
    {/* {token?<TopNav 
    hidde={hidden} 
    setHidden={setHidden}
    
    />:null}   */}

      <div className="flex ">
        {token ? hidden?<Sidebar />:null : null}
        <main className="flex-1 p-6  from-gray-600 to-gray-950 rounded-tl-3xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
