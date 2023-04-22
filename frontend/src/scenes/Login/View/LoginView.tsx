import React from "react"
import { Button } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import "./Login.css"

export default function LoginView(){
    return(
        <React.Fragment>
           <div className="loginBox"> 
                <figure className="gif">
                    {/* <img className="user" src="https://i.ibb.co/yVGxFPR/2.png" height="100px" width="100px"/> */}
                    <img className="user" src="docs/gifs/42.gif" height="200px" width="200px"/>
                </figure>
                {/* <h3>Sign in here</h3> */}
                <form action="login.php" method="post">
                    {/* <div className="inputBox"> 
                        <input id="uname" type="text" name="Username" placeholder="Username"/> 
                        <input id="pass" type="password" name="Password" placeholder="Password"/> 
                    </div>  */}
                    {/* <input type="submit" name="" value="Login"/> */}
                    <div style={{margin:"auto"}}>
                    <Stack spacing={10} direction='column' align='center'>
                        <Button colorScheme='purple' size='lg'>LOGIN COM 42</Button>
                        <Button colorScheme='purple' size='lg'>LOGIN TESTE</Button>
                    </Stack>
                    </div>
                </form> 
                {/* <a href="#">Forget Password<br/> </a> */}
                {/* <div className="text-center">
                    <p style={{color: "#59238F;"}}>Sign-Up</p>
                </div> */}
            </div>
            {/* <h1 style={{textAlign:"center", fontWeight:"bold",fontSize:"70px", marginTop:"100px"}}>
                TRANSPONG
            </h1>
            <div style={{margin:"auto"}}>
                <Stack spacing={10} direction='column' align='center'>
                    <Button colorScheme='teal' size='lg'>LOGIN COM 42</Button>
                    <Button colorScheme='teal' size='lg'>LOGIN TESTE</Button>
                </Stack>
            </div> */}
        </React.Fragment>
    )
}