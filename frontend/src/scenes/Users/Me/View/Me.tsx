import { Flex } from "@chakra-ui/layout";
import { Text, Avatar, Button, Box } from "@chakra-ui/react";
import { useState } from "react";
import RankingCard from "../../../../components/RankingCard/RankingCard";
import MatchCard from "../../../../components/MatchCard/MatchCard";
import { useNavigate, useOutlet, Outlet } from "react-router-dom";

export default function Me(){
  const position = 7
  const nickname = "Nickname"
  const [isMFA, setMFA] = useState(false);
  const navigate = useNavigate();
  const teste = [
    {
      winner: {
        nickname: "Lucas",
        points: 10,
      },
      loser: {
        nickname: "Yuri",
        points: 10,
      },
    },
    {
      winner: {
        nickname: "Lucas",
        points: 10,
        avatar: "https://bit.ly/dan-abramov",
      },
      loser: {
        nickname: "Yuri",
        points: 10,
      },
    },
    {
      winner: {
        nickname: "Lucas",
        points: 10,
      },
      loser: {
        nickname: "Yuri",
        points: 10,
      },
    },
    {
      winner: {
        nickname: "Lucas",
        points: 10,
        avatar: "https://bit.ly/dan-abramov",
      },
      loser: {
        nickname: "Yuri",
        points: 10,
      },
    },
    {
      winner: {
        nickname: "Lucas",
        points: 10,
      },
      loser: {
        nickname: "Yuri",
        points: 10,
      },
    },
    {
      winner: {
        nickname: "Lucas",
        points: 10,
        avatar: "https://bit.ly/dan-abramov",
      },
      loser: {
        nickname: "Yuri",
        points: 10,
      },
    },
    {
      winner: {
        nickname: "Lucas",
        points: 10,
      },
      loser: {
        nickname: "Yuri",
        points: 10,
      },
    },
    {
      winner: {
        nickname: "Lucas",
        points: 10,
      },
      loser: {
        nickname: "Yuri",
        points: 10,
      },
    },
    {
      winner: {
        nickname: "Lucas",
        points: 10,
      },
      loser: {
        nickname: "Yuri",
        points: 10,
      },
    },
  ]
  return useOutlet() ? <Outlet/> : ( 
    <>
      <Flex h='100%' w={"100%"} borderRadius={"20px"} align={"center"}>
        <Flex backgroundColor={"white"} width={"30%"} height={"90%"} marginLeft={"1%"} border={"8px"} borderColor={"#805AD5"} align={"center"} justify={"center"} flexDirection={"column"} borderRadius={"20px"}>
          <Avatar size={"2xl"} marginBottom={"55px"}/>
          <Button colorScheme={"purple"} marginBottom={"15px"} onClick={() => console.log("upload de nova imagem")}>
            Upload Avatar
          </Button>
          <Text fontSize={"35px"} fontWeight={"bold"} marginBottom={"15px"}>
            {nickname}
          </Text>
          { !isMFA ?
            <Button size={"lg"} colorScheme={"purple"} onClick={() => {
              navigate("/home/me/mfa");
              setMFA(true)
            }}>
              Ativar MFA
            </Button> :
            <Button size={"lg"} colorScheme={"purple"} onClick={() => setMFA(false)}>
              Desativar MFA
            </Button>
          }
        </Flex>
        <Flex width={"100%"} height={"90%"} marginLeft={"1%"} border={"8px"} borderColor={"#805AD5"} flexDirection={"column"} borderRadius={"20px"}>
          <Text
          fontSize={"25px"}
          fontWeight={"bold"}
          textColor="white"
          textAlign="center"
          >
            Status
          </Text>
          <RankingCard position={position} nickname={nickname} matches={10} wins={7} losses={3}/>

          <Text
            fontSize={"25px"}
            fontWeight={"bold"}
            textColor="white"
            textAlign="center"
          >
            Histórico de partidas
          </Text>
          <Box h="98%" w={"100%"} overflowY="scroll">
            <Box>
              {teste.map((match) => {
                return <MatchCard winner={match.winner} loser={match.loser} />;
              })}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}