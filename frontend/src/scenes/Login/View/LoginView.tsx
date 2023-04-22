import React from "react"
import { Button } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import "./Login.css"

export default function LoginView(){
    return(
        <React.Fragment>
            <h1 style={{textAlign:"center", fontWeight:"bold",fontSize:"70px", marginTop:"100px"}}>
                TRANSPONG
            </h1>
            <div style={{margin:"auto"}}>
                <Stack spacing={10} direction='column' align='center'>
                    <Button colorScheme='teal' size='lg'>LOGIN COM 42</Button>
                    <Button colorScheme='teal' size='lg'>LOGIN TESTE</Button>
                </Stack>
            </div>
        </React.Fragment>
    )
}