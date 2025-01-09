import React from 'react'
import Logo from './Logo'
import SidebarRoutes from './Sidebar-Routes'

function Sidebar() {
  return (
    <div className=' h-full  flex flex-col border-r shadow-sm overflow-y-auto bg-white z-50'>

<div className=' p-6 flex gap-2' >
<Logo/>
<p className=' font-bold  text-gray-700'>Coursify</p>
</div>
 <div className=' flex flex-col  w-full'>
    <SidebarRoutes/>
 </div>
        </div>
  )
}

export default Sidebar