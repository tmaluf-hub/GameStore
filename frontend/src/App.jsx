import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className='min-h-screen flex flex-col justify-between bg-zinc-900 text-zinc-100'>

      <Navbar />

      <Routes>

        <Route path='/' element={<Home />} />

      </Routes>

      <Footer />

    </div>
  )
}

export default App
