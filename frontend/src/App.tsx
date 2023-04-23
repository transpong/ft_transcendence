import { ChakraProvider } from '@chakra-ui/react'
import LoginView from './scenes/Login/View/LoginView'

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
