import { ChakraProvider } from '@chakra-ui/react'
import LoginView from './scenes/Login/View/LoginView'
import CreateNickNameLogin from './scenes/CreateNickNameLogin/View/CreateNickNameLoginView'
import {BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginView/>}/>
          <Route path='/nickname' element={<CreateNickNameLogin/>}/>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
    </>
  )
}

export default App
