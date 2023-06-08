import {Flex} from "@chakra-ui/layout";
import {
    Button,
    Center,
    FormControl,
    Heading,
    HStack,
    Image,
    PinInput,
    PinInputField,
    Stack,
    Text,
    Tooltip,
    useBreakpointValue,
    useColorModeValue
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {userService} from "../../../../services/users-service";

export default function Me() {
    const [inputMessage, setInputMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const {state} = useLocation();

    useEffect(() => {
        if (inputMessage.length === 6) {
            handleMfaValidation();
        }
    }, [inputMessage]);

    async function handleMfaValidation() {
        setIsUploading(true);

        try {
            await userService.validateMfa(inputMessage);
            setTimeout(() => {
                setIsUploading(false);
                navigate("/home/me");
            }, 1000);
        } catch {
            setTimeout(() => {
                setIsUploading(false);
                setInputMessage("");
            }, 1000);
        }
    }

    const qrCodeSize = useBreakpointValue({
        base: "200px",
        sm: "150px",
        md: "150px",
        lg: "150px",
        xl: "150px",
    });

    const stackWidth = useBreakpointValue({
        base: "100%",
        sm: "100%",
        md: "100%",
        lg: "100%",
        xl: "100%",
    });


    return (
        <>
            <Flex
                w="100%"
                align="center"
                justify="center"
            >
                <Stack
                    spacing={4}
                    w={stackWidth}
                    maxW="2xl"
                    maxH={useBreakpointValue({base: "100%", sm: "100%", md: "100%", lg: "100%", xl: "100%"})}
                    bg={useColorModeValue("white", "gray.700")}
                    rounded="xl"
                    boxShadow="lg"
                    p={5}
                    my={8}
                    overflow={"auto"}

                >
                    <Center>
                        <Heading lineHeight={1.1} fontSize={{base: '2xl', md: '1xl', lg: '2xl'}}>
                            Para ativar a autenticação de dois fatores, siga os passos abaixo:
                        </Heading>
                    </Center>
                    <Center
                        fontSize={{base: 'sm', sm: 'md'}}
                        color={useColorModeValue('gray.800', 'gray.400')}>
                        Instale um aplicativo de autenticação no seu celular
                    </Center>
                    <Center
                        fontSize={{base: 'sm', sm: 'sm'}}
                        fontWeight="bold"
                        color={useColorModeValue('gray.800', 'gray.400')}>
                        Escaneie o QR Code abaixo utilizando o aplicativo de autenticação
                    </Center>
                    <Center>
                        <Image
                            src={state.qr_code}
                            boxSize={qrCodeSize}/>
                    </Center>
                    <Center
                        fontSize={{base: 'sm', sm: 'md'}}
                        color={useColorModeValue('gray.800', 'gray.400')}>
                        Digite o código de 6 dígitos gerado pelo aplicativo
                    </Center>
                    <FormControl>
                        <Center>
                            <HStack>
                                <PinInput otp
                                          value={inputMessage}
                                          onChange={(e) => setInputMessage(e)}
                                          onComplete={(e) => setInputMessage(e)}
                                          placeholder='🏓'

                                >
                                    <PinInputField/>
                                    <PinInputField/>
                                    <PinInputField/>
                                    <PinInputField/>
                                    <PinInputField/>
                                    <PinInputField/>
                                </PinInput>
                            </HStack>
                        </Center>
                    </FormControl>
                    <Stack spacing={6}>
                        <Center>
                            <Tooltip label={<Stack>
                                <Text>Esse é o único contato que você terá com o secret</Text>
                                <Text>Caso não consiga validar, volte a tela anterior e desative</Text>
                                <Text>Caso perca o segredo, não irá mais conseguir fazer login</Text>
                            </Stack>} placement='left' defaultIsOpen backgroundColor="red">
                                <Button
                                    colorScheme={"purple"}
                                    width={"40%"}
                                    onClick={handleMfaValidation}
                                    isLoading={isUploading}
                                >
                                    Validar
                                </Button>
                            </Tooltip>
                        </Center>
                    </Stack>
                </Stack>
            </Flex>
        </>
    );
}
