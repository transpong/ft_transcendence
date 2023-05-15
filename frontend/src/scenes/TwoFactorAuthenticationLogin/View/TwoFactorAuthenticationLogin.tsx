import { Button, Flex, Stack, Image, Input } from '@chakra-ui/react'
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { userService } from '../../../services/users-service';
import "./TwoFactorAuthenticationLogin.css"

export default function TwoFactorAuthenticationLogin(){
    const [value, setValue] = useState('')
    const [isUploading, setIsUploading] = useState(false);
    const handleChange : React.ChangeEventHandler<HTMLInputElement>  = (event) => setValue(event.target.value)
    const navigate = useNavigate();

    async function handleMfaValidation() {
      setIsUploading(true);

      await userService.validateMfa(value);

      setTimeout(() => {
        setIsUploading(false);
        navigate("/home");
      }, 1000);
    }
    return(
        <Flex h={"100vh"} align={"center"} justify={"center"}>
            <Flex
                className={'loginBox'}
                direction={"column"}
                align={"center"}
                justify={"center"}
                bg={"black"}
                borderRadius={"10px"}
                p={"40px"}
                animation={"loginBox 5s"}
            >
                <Image
                    className={"school42"}
                    src={"docs/gifs/42.gif"}
                    height={"200px"}
                    width={"200px"}
                    margin={"0 auto"}
                    display={"block"}
                    marginBottom={"20px"}
                />
                <Stack spacing={10} direction={"column"} align={"center"}>
                    <Input onChange={handleChange} placeholder={"2FA Code"} size={"md"} textColor={"white"}/>
                    <Button onClick={handleMfaValidation} colorScheme={"purple"} size={"lg"} isLoading={isUploading}>
                        LOGIN
                    </Button>
                </Stack>
            </Flex>
        </Flex>
  );
}