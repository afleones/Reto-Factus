import React from 'react'
import Navbar from '../navbar/Navbar'
import { Header } from '../Header'
import useSessionTimeout from '../../hooks/useSessionTimeout';


const LayoutDashobard = ({ children }) => {
  return (
    <>
      <div class="flex flex-col bg-white ">
        {/** Navbar */}
        <Header/>
        {/** Fin Navbar */}
        {/** Main */}
        {children}
        {/** Fin Main */}
      </div>
    </>
  )
}

export default LayoutDashobard