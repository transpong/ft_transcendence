import { ButtonGroup, Button, Avatar, HStack, Text, Flex} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { IoExit } from "react-icons/io5";
import { useNavigate } from "react-router";
import { IApiUserMe, userService } from "../../services/users-service";
import { useMemo, useState } from "react";
import { avatarUrl } from "../../helpers/avatar-url";
import { clearCookies } from "../../helpers/clear-cookies";

export default function NavBar() {
  const navigate = useNavigate();

  const [me, setMe] = useState<IApiUserMe>();
  useMemo(async () => {
    const myData = await userService.getMe();

    setMe(myData);
  }, []);

  async function handleLogoff () {
    clearCookies();
    await userService.logout()
    navigate("/")
  }

  return (
    <HStack h="14%" align="center" justify="space-between">
      <Button
        colorScheme={"purple"}
        marginLeft="20px"
        paddingLeft="70px"
        paddingRight="70px"
        onClick={() => navigate("/home")}
      >
        Transpong
      </Button>
      <ButtonGroup>
        <Button colorScheme={"purple"} onClick={() => navigate("/home/pong")}>
          Jogar
        </Button>
        <Button colorScheme={"purple"} onClick={() => navigate("/home/matches")}>
          Lista de Jogos
        </Button>
        <Button colorScheme={"purple"} onClick={() => navigate("/home/matches/live")}>
          Jogos ao vivo
        </Button>
        <Button colorScheme={"purple"} onClick={() => navigate("/home/ranking")}>
          Ranking
        </Button>
      </ButtonGroup>
      <HStack
        borderRadius={"0.375rem"}
        backgroundColor={"#805AD5"}
        minWidth={"2.5rem"}
      >
        <Flex marginRight={"1rem"} marginLeft={"1rem"} align={"center"} justify={"center"}>
          <Avatar src={avatarUrl(me?.avatar)} />
          <HStack marginRight={"2rem"} marginLeft={"2rem"} cursor={"pointer"} onClick={() => navigate("/home/me")}>
            <Text fontSize={"1rem"} fontWeight={"bold"} color={"white"}>{me?.nickname}</Text>
            <SettingsIcon fontSize={"2rem"} fontWeight={"bold"} color={"white"}/>
          </HStack>
          <IoExit cursor={"pointer"} fontSize={"2rem"} fontWeight={"bold"} color={"white"} onClick={handleLogoff}/>
        </Flex>
      </HStack>
    </HStack>
  );
}
