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
                if(response.data.user === null) {
                    dispatch({
                        type: reducerCases.SET_NEW_USER,
                        newUser: true,
                    }),
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
                } else {
                    dispatch({
                        type: reducerCases.SET_NEW_USER,
                        newUser: false,
                    }),
                    dispatch({
                        type: reducerCases.SET_USER_INFO,
                        userInfo: response.data.user,
                    })
                    Router.push('/');
                }
            }
        } catch(err) {
            console.error(err);
        }
    }

    return(
        <div className='flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6'>
            <div className='flex items-center justify-center gap-8 text-white'>
                <Image src='/ZkareLogo.png' alt="Whatsapp" width={300} height={300} />
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