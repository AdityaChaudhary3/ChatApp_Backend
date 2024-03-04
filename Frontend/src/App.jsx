import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import Login from './components/Authentication/Login'
import Signup from './components/Authentication/Signup'
import Homepage from './Pages/Homepage'


function App() {

  const [res, setRes] = useState({})

  // useEffect(() => {
  //   axios.get('/api')
  //     .then((response) => {
  //       setRes(response.data)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // })

  return (
    <>
      <h1>Here is frontend.</h1>
      {/* <h2>{res.hi}</h2> */}
      {/* <Login /> */}
      {/* <Signup /> */}
      <Homepage />
      <Button colorScheme='blue'>Button</Button>
    </>
  )
}

export default App
