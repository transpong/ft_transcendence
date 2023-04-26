import { Button, Flex, Image, Stack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import "./Login.css"

const API42OAUTHURL = `${
  import.meta.env.VITE_API_42_URL
}/oauth/authorize?client_id=${
  import.meta.env.VITE_API_42_CLIENT_ID
}&redirect_uri=${encodeURIComponent(
  window.location.origin + "/nickname"
)}&response_type=code`;

export default function LoginView(){
  const navigate = useNavigate();

    const redirectTo42OAuth = () => {
      window.location.replace(API42OAUTHURL);
    };
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
            src="docs/gifs/42.gif"
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
            >
              LOGIN COM 42
            </Button>
            <Button
              colorScheme="purple"
              size="lg"
              onClick={() => navigate("/nickname")}
            >
              LOGIN TESTE
            </Button>
          </Stack>
        </Flex>
      </Flex>
    );
}