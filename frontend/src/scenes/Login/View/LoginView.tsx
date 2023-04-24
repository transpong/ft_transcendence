import { Button, Flex, Image, Stack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import "./Login.css"

export default function LoginView(){
    const navigate = useNavigate();
    return(
        <Flex h={"100vh"} align={"center"} justify={"center"}>
            <Flex
                className='loginBox'
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
                    <Button colorScheme="purple" size="lg" onClick={() => navigate("/nickname")}>
                        LOGIN COM 42
                    </Button>
                    <Button colorScheme="purple" size="lg">
                        LOGIN TESTE
                    </Button>
                </Stack>
            </Flex>
        </Flex>
    )
}