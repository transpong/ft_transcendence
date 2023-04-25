import { ChakraProvider } from '@chakra-ui/react'
import LoginView from './scenes/Login/View/LoginView'
import CreateNickNameLogin from './scenes/CreateNickNameLogin/View/CreateNickNameLoginView'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import TwoFactorAuthenticationLogin from './scenes/TwoFactorAuthenticationLogin/View/TwoFactorAuthenticationLogin';

function App() {
  return (
    <>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path="/nickname" element={<CreateNickNameLogin />} />
            <Route path="/2FA" element={<TwoFactorAuthenticationLogin />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
}

export default App
