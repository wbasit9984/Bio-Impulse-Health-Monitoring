import React from 'react'
import Sidebar from '../components/Sidebar'
import Grid from '../components/Grid'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  console.log("Current page: ", useSelector(state => state.currentPage))
  return (
    <div className='flex min-h-screen min-w-screen bg-[#F2F3F4]'>
        <Sidebar />
        <Grid />
    </div>
  )
}

export default Dashboard