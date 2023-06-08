import {ReactNode, useMemo, useState} from 'react';
import {
    Avatar,
    Box,
    Flex,
    HStack,
    IconButton,
    Link as ChakraLink,
    Stack,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import {Link as RouteLink, useNavigate} from "react-router-dom";
import {avatarUrl} from "../../helpers/avatar-url";
import {CloseIcon, HamburgerIcon, SettingsIcon} from '@chakra-ui/icons';
import {IApiUserMe, userService} from "../../services/users-service";
import {IoExit} from "react-icons/io5";
import {clearCookies} from "../../helpers/clear-cookies";

const Links: string[] = ['Lista de Jogos', 'Ranking', 'Jogos ao vivo', 'Jogar'];
const Redirects: string[] = ['/home/matches', '/home/ranking', '/home/matches/live', '/home/pong'];

const NavLink = ({children, route}: { children: ReactNode, route: string }) => (
    <ChakraLink
        as={RouteLink}
        to={route}
        px={2}
        py={1}
        rounded="md"
        _hover={{
            color: '#5e3caa',
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'white'),
        }}
        color="white"
        fontWeight={1000}
    >
        {children}
    </ChakraLink>
);


export default function Simple() {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const navigate = useNavigate();

    const [me, setMe] = useState<IApiUserMe>();
    useMemo(async () => {
        const myData = await userService.getMe();

        if (!myData) return;
        if (!myData?.nickname) navigate("/nickname");
        setMe(myData);
    }, [navigate]);

    async function handleLogoff() {
        clearCookies();
        sessionStorage.clear();
        await userService.logout();
        navigate("/");
    }

    return (
        <Box mb="36px">
            <Box bg={useColorModeValue('#805AD5', '#805AD5')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon/> : <HamburgerIcon/>}
                        aria-label={'Open Menu'}
                        display={{md: 'none'}}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <NavLink key={"Transpong"} route={"/home"}>Transpong</NavLink>
                        <HStack
                            as={'nav'}
                            spacing={5}
                            color={'white'}
                            display={{base: 'none', md: 'flex'}}>
                            {Links.map((link, index) => (
                                <NavLink key={link} route={Redirects[index]}>{link}</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems="center" gap='2'>
                        <RouteLink to={"/home/me"}>

                            <Flex alignItems="center" gap='2'>
                                <Avatar
                                    size={'sm'}
                                    src={avatarUrl(me?.avatar)}
                                />
                                <Box ml={2} fontWeight={"600"}>{me?.nickname}</Box>
                                <SettingsIcon
                                    fontSize={"2rem"}
                                    fontWeight={"bold"}
                                    color={"white"}
                                />
                            </Flex>
                        </RouteLink>
                        <IoExit
                            cursor={"pointer"}
                            fontSize={"2rem"}
                            fontWeight={"bold"}
                            color={"white"}
                            onClick={handleLogoff}
                        />
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{md: 'none'}}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link, index) => (
                                <NavLink key={link} route={Redirects[index]}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </Box>
    );
}
