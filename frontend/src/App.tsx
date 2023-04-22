import { ChakraProvider } from '@chakra-ui/react'
import LoginView from './scenes/Login/View/LoginView'
import './App.css'

function App() {
  return (
    <>
    <ChakraProvider>
      <LoginView/>
    </ChakraProvider>
    </>
  )
}

export default App
