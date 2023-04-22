import React from "react"
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Stack, HStack, VStack } from '@chakra-ui/react'
import { Center, Square, Circle } from '@chakra-ui/react'
import "./Login.css"

export default function LoginView(){
    return(
        // <Center bg='tomato' h='auto' w={"max-content"} color='white'>
        <div style={{margin:"auto"}}>
        <Stack spacing={10} direction='column' align='center'>
            <Button colorScheme='teal' size='lg'>LOGIN COM 42</Button>
            <Button colorScheme='teal' size='lg'>LOGIN TESTE</Button>
        </Stack>
        </div>
        // </Center>
    )
}