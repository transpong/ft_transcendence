import {Button, Flex, Stack, Image, Input, Heading, Center} from '@chakra-ui/react'
import {useState} from 'react';
import { useNavigate } from 'react-router';
import { userService } from '../../../services/users-service';
import ftgif from '../../../../docs/gifs/42.gif'
import "./TwoFactorAuthenticationLogin.css"

export default function TwoFactorAuthenticationLogin(){
    const [value, setValue] = useState('')
    const [isUploading, setIsUploading] = useState(false);
    const handleChange : React.ChangeEventHandler<HTMLInputElement>  = (event) => setValue(event.target.value)
    const navigate = useNavigate();

    async function handleMfaValidation() {
      setIsUploading(true);

      try {
        await userService.validateMfa(value);
        setTimeout(() => {
          setIsUploading(false);
          navigate("/home");
        }, 1000);
      } catch {
        setTimeout(() => {
          setIsUploading(false);
          setValue("");
        }, 1000);
      }
    }
    return(
        <Flex className='TwoFactorAuthenticationLogin' h={"100vh"} align={"center"} justify={"center"}>
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
                    src={ftgif}
                    height={"200px"}
                    width={"200px"}
                    margin={"0 auto"}
                    display={"block"}
                    marginBottom={"20px"}
                />
                <Stack spacing={10} direction={"column"} align={"center"}>
                    <Center>
                        <Heading
                            lineHeight={1.1} fontSize={{base: '2xl', md: '1xl', lg: '2xl'}}
                            color={"white"}>
                            Insira o Código Gerado Pelo Aplicativo de Autenticação
                        </Heading>
                    </Center>
                    <Input className={'loginBoxInput'}
                           onChange={handleChange}
                           placeholder={"Código de Autenticação"}
                           size={"md"}
                           textColor={"white"}/>
                    <Button onClick={handleMfaValidation} colorScheme={"purple"} size={"lg"} isLoading={isUploading}>
                        Entrar
                    </Button>
                </Stack>
            </Flex>
        </Flex>
  );
}
