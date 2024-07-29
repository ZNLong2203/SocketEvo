import React, { useState } from 'react';
import Image from 'next/image';
import { useStateProvider } from '../context/StateContext';
import Input from '../components/common/Input';
import Avatar from '../components/common/Avatar';

const profile = () => {
    const [{ userInfo }] = useStateProvider();
    const [name, setName] = useState(userInfo?.displayName || '');
    const [about, setAbout] = useState('');
    const [image, setImage] = useState('/default_avatar.png');

    return (
        <div className='bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center'>
            <div className="flex items-center justify-center gap-2">
                <Image src='/ZkareLogo.png' alt="Whatsapp" width={300} height={300} />
                <span className='text-7xl'>SocketEvo</span>
            </div>
            <h2 className="text-2xl mt-10">Create your profile</h2>
            <div className='flex-gap-6 flex flex-row'>
                <div className='flex flex-col items-center justify-center mt-5 gap-6'>
                    <Input name='DisplayName' state={name} setState={setName} label="Display Name" />
                    <Input name='About' state={about} setState={setAbout} label="About" />
                </div>
                <div>
                    <Avatar type='xl' image={image} setImage={setImage} />
                </div>
            </div>
        </div>
    )
}

export default profile;