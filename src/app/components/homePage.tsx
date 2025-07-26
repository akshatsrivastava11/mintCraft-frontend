import React from 'react'
import { Navigation } from './navigation'
import { Sidebar } from './Navbar'
import ChatPart from './chatPart'

function HomePage() {
  return (
    <div className='bg-[#948979] h-[93vh]'>
        <Navigation/>
        <Sidebar/>
        <ChatPart/>
    </div>

)
}

export default HomePage