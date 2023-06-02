import { ChakraProvider } from '@chakra-ui/react'
import LoginView from './scenes/Login/View/LoginView'
import CreateNickNameLogin from './scenes/CreateNickNameLogin/View/CreateNickNameLoginView'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import TwoFactorAuthenticationLogin from './scenes/TwoFactorAuthenticationLogin/View/TwoFactorAuthenticationLogin';
import HomeView from './scenes/Home/View/HomeView';
import Ranking from './scenes/Ranking/View/Ranking';
import './App.css'
import MachesHistory from './scenes/MatchesHistory/View/MachesHistory';
import Me from './scenes/Users/Me/View/Me';
import MFA from './scenes/Users/MFA/View/MFA';
import Profile from './scenes/Users/Profiles/View/Profiles';
import Game from './scenes/Game/Game';
import GameOffline from './scenes/Game/GameOffLine';

function App() {
  return (
    <>
      <ChakraProvider toastOptions={{ defaultOptions: { position: "bottom" } }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path="/nickname" element={<CreateNickNameLogin />} />
            <Route path="/2FA" element={<TwoFactorAuthenticationLogin />} />
            <Route path="/home/" element={<HomeView />}>
              <Route path="ranking" element={<Ranking />} />
              <Route path="matches" element={<MachesHistory />} />
              <Route path="me/" element={<Me />}>
                <Route path="mfa" element={<MFA />} />
              </Route>
              <Route path="profile/:user" element={<Profile />} />
              <Route path="pong/" element={<Game />} />                
              <Route path="pong/gameoff" element={<GameOffline />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </>
  );
}

export default App
