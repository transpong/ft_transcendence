import { Button } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import "./Login.css"

export default function LoginView(){
    return(
           <div className="loginBox"> 
                <figure className="gif">
                    <img className="school42" src="docs/gifs/42.gif" height="200px" width="200px"/>
                </figure>
                    <div>
                    <Stack spacing={10} direction='column' align='center'>
                        <Button colorScheme='purple' size='lg'>LOGIN COM 42</Button>
                        <Button colorScheme='purple' size='lg'>LOGIN TESTE</Button>
                    </Stack>
                    </div>
            </div>
    )
}