import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminCreditos from './pages/Admin/AdminCreditos';
import AdminCobros from './pages/Admin/AdminCobros';
import AdminUsuarios from './pages/Admin/AdminUsuarios';
import AdminCrearCredito from './pages/Admin/AdminCrearCredito';
import AdminHistorial from './pages/Admin/AdminHistorial';
import AdminCajaChica from './pages/Admin/AdminCajaChica';
import AdminCreditoCuotas from './pages/Admin/AdminCreditoCuotas';

export default function App(){
    // const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

    // // <--- Only run when first loading the website --->
    // useEffect(() =>{
    //     checkAuth();
    // }, [])

    // if (isCheckingAuth && !authUser){
    //     return(
    //         <h1>Loading...</h1>
    //     )
    // }

    return(
        <>
        <Toaster>
        </Toaster>

        <Router>
            <Routes>
                {/* Main */}
                <Route path="/" element={<Navigate to={'/admin/'}/>} />
                <Route path="/admin/" element={<AdminDashboard />} />
                <Route path='/admin/creditos' element={<AdminCreditos/>}/>
                <Route path='/admin/creditos/:id/cuotas' element={<AdminCreditoCuotas/>}/>
                <Route path="/admin/cobros" element={<AdminCobros />} />
                <Route path="/admin/caja" element={<AdminCajaChica />} />
                <Route path="/admin/usuarios" element={<AdminUsuarios />} />
                <Route path="/admin/usuarios/:id/crear" element={<AdminCrearCredito />} />
                <Route path="/admin/historial" element={<AdminHistorial />} />

                {/* Auth */}
                {/* <Route 
                    path='/login' element={!authUser ? <Login/> : <Navigate to='/'/>
                    }
                />
                <Route 
                    path='/register' element={!authUser ? <Register/> : <Navigate to='/'/>
                    }
                /> */}

                {/* Admin */}

            </Routes>
        </Router>
        </>
    )
}