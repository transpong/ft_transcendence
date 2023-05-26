import { Button, Flex, Stack, Image, Input } from '@chakra-ui/react'
import "./CreateNickNameLoginView.css"
import { useNavigate } from "react-router";
import { useState } from 'react';
import { userService } from '../../../services/users-service';
import ftgif from "../../../../docs/gifs/42.gif";

export default function CreateNickNameLoginView(){
  const [value, setValue] = useState('')
  const [isUploading, setIsUploading] = useState(false);
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) =>
    setValue(event.target.value);

    const navigate = useNavigate();

    async function handleNicknameUpdate() {
      setIsUploading(true);

      try {
        await userService.updateNickname(value)
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
        <Flex className='CreateNickNameLoginBackground' h={"100vh"} align={"center"} justify={"center"}>
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
                    <Input onChange={handleChange} placeholder={"Apelido"} size={"md"} textColor={"white"}/>
                    <Button onClick={handleNicknameUpdate} colorScheme={"purple"} size={"lg"} isLoading={isUploading}>
                        LOGIN
                    </Button>
                </Stack>
            </Flex>
        </Flex>
  );
}