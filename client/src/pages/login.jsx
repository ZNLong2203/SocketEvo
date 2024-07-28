import axios from 'axios';
import React from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import Router from 'next/router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseAuth  from '../utils/FirebaseConfig';
import { CHECK_USER_ROUTE } from '../utils/ApiRoutes';
import { useStateProvider } from '../context/StateContext';
import { reducerCases } from '@/context/constants';

const login = () => {
    const [state, dispatch] = useStateProvider();

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(firebaseAuth, provider);
        const { displayName, email, photoUrl } = user;
        try {
            if(email) {
                const response = await axios.post(CHECK_USER_ROUTE, { email });
                if(response) {
                    dispatch({
                        type: reducerCases.SET_USER_INFO,
                        userInfo: {
                            displayName,
                            email,
                            photoUrl,
                            status: "",
                        },
                    })
                    Router.push('/profile');
                }
            }
        } catch(err) {
            console.error(err);
        }
    }

    return(
        <div className='flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6'>
            <div className='flex items-center justify-center gap-2 text-white'>
                <Image src='data:image/png;base64,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' alt="Whatsapp" width={300} height={300} />
                <span className='text-7xl'>SocketEvo</span>
            </div>

            <button 
                className='flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg'
                onClick={handleLogin}
            >
                <FcGoogle className='text-4xl'/>
                <span className="text-white text-2xl"> Login with Google</span>
            </button>
        </div>
    )
}

export default login;