import { signInWithPopup } from 'firebase/auth'
import React, { useState } from 'react'
import api from '../../utils/axios';
import { auth, googleProvider } from '../../utils/firebase';
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/user.slice';
import ChatArea from '../components/ChatArea';
import Sidebar from '../components/sidebar';
import Artifact from '../components/Artifact';
import Nav from '../components/Nav';


const home = () => {

    const { userData } = useSelector(state => state.user)
    const [isOpen, setIsOpen] = useState(true);
    console.log("userData", userData)

    const dispatch = useDispatch();
    const handleLogin = async (token) => {
        try {
            const { data } = await api.post("/api/auth/login", { token });
            dispatch(setUserData(data))
            console.log("handlelogin Data", data)
        } catch (error) {
            console.log("Error in handleLogin", error)
        }

    }

    const googleLogin = async () => {
        const data = await signInWithPopup(auth, googleProvider);
        const token = await data.user.getIdToken();

        handleLogin(token);
    }

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className="flex h-screen bg-[#0d0f14] text-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-0">   {/* ← flex-col + min-h-0 */}
                <ChatArea />
            </div>
            <Artifact />
        {/* </div> */}


            {
        !userData && (
            <>
                {/* Overlay – fully centered */}
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="modal-card w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">

                        <div className="flex flex-col gap-1">
                            <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                                Welcome to CortexAI
                            </h2>

                            <p className="text-[13px] flex justify-center text-slate-500">
                                Please login to continue using the app.
                            </p>
                        </div>

                        <button
                            onClick={googleLogin}
                            className="btn-google group flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-xl bg-white/5 border border-white/10"
                        >
                            <FcGoogle size={20} />
                            <span>
                                Continue with <span className="font-semibold">Google</span>
                            </span>
                        </button>

                    </div>
                </div>
            </>
        )
    }

         </div >
    );
}

export default home
