import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { isAuthenticated } from "../AdminLogin/index";
import './navbar.css'

const Navbar = () => {
  return (
    <nav className='nav'>
      <a className="logo" href="/"><img src={logo} alt="Yuzu Wellness Logo"
      width="80px" /></a>
      <ul>
      </ul>
    </nav>
  )
}

export default Navbar