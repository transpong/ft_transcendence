import { Button, Flex, Stack, Image, Input } from '@chakra-ui/react'
import "./CreateNickNameLoginView.css"
import React from "react"
import { useLocation } from "react-router";

export default function CreateNickNameLoginView(){
    const [value, setValue] = React.useState('')
    const handleChange : React.ChangeEventHandler<HTMLInputElement>  = (event) => setValue(event.target.value)

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const auth42Code = queryParams.get('code');
    console.log(auth42Code); //TODO logic implementation

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
                    <Input onChange={handleChange} placeholder={"Apelido"} size={"md"} textColor={"white"}/>
                    <Button onClick={() => console.log(`VALUE=${value}`)} colorScheme={"purple"} size={"lg"}>
                        LOGIN
                    </Button>
                </Stack>
            </Flex>
        </Flex>
  );
}