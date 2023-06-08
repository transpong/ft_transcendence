import { Button, Flex, Image, Stack } from '@chakra-ui/react'
import "./Login.css"
import ftgif from "../../../../docs/gifs/42.gif";

const API42OAUTHURL = `${
  import.meta.env.VITE_API_42_URL
}/oauth/authorize?client_id=${
  import.meta.env.VITE_API_42_CLIENT_ID
}&redirect_uri=${encodeURIComponent(
  import.meta.env.VITE_API_42_REDIRECT_URL
)}&response_type=code`;

const APIGUESTURL = `${import.meta.env.VITE_API_URL}/auth/guest`;

export default function LoginView(){
  const redirectTo42OAuth = () => {
    sessionStorage.setItem("isGuest", "false");
    window.location.replace(API42OAUTHURL);
  };

  function handleTestLogin() {
    sessionStorage.setItem("isGuest", "true");
    window.location.replace(APIGUESTURL);
  }

    return (
      <Flex className='LoginBackground' h={"100vh"} align={"center"} justify={"center"}>
        <Flex
          className="loginBox"
          direction={"column"}
          align={"center"}
          justify={"center"}
          bg={"black"}
          borderRadius={"10px"}
          p={"40px"}
          animation={"loginBox 5s"}
        >
          <Image
            className="school42"
            src={ftgif}
            height="200px"
            width="200px"
            margin={"0 auto"}
            display={"block"}
            marginBottom={"20px"}
          />
          <Stack spacing={10} direction="column" align="center">
            <Button
                colorScheme="purple"
                size="lg"
                onClick={redirectTo42OAuth}
                width={"90%"}
            >
              Fazer login
            </Button>
            <Button
                colorScheme="purple"
                size="lg"
                onClick={handleTestLogin}
                width={"90%"}
            >
              Entrar como convidado
            </Button>
          </Stack>
        </Flex>
      </Flex>
    );
}
