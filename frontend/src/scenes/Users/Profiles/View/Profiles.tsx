import { Flex } from "@chakra-ui/layout";
import { Text, Avatar, Button, Box, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import RankingCard from "../../../../components/RankingCard/RankingCard";
import MatchCard from "../../../../components/MatchCard/MatchCard";
import { useOutlet, Outlet } from "react-router-dom";
import { gameService, IApiMatchHistory, IApiRanking } from "../../../../services/game-service";

export default function Me(){
  const nickname = "Nickname"
  const avatar = "Nickname";
  const [isFriend, setIsFriend] = useState(false);

  const [matchesList, setMatchesList] = useState<IApiMatchHistory[]>([]);
  const [userRanking, setUserRanking] = useState<IApiRanking>();

  useMemo(async () => {
    const matches = await gameService.getMatchesHistory('TODO myData.nickname');
    setMatchesList(matches);

    const ranking = await gameService.getUserRanking('TODO myData.nickname');
    setUserRanking(ranking);
  }, []);

  return useOutlet() ? <Outlet/> : (
    <>
      <Flex h='100%' w={"100%"} borderRadius={"20px"} align={"center"}>
        <Flex backgroundColor={"white"} width={"30%"} height={"90%"} marginLeft={"1%"} border={"8px"} borderColor={"#805AD5"} align={"center"} justify={"center"} flexDirection={"column"} borderRadius={"20px"}>
          <Avatar size={"2xl"} marginBottom={"55px"}/>
          <Text fontSize={"35px"} fontWeight={"bold"} marginBottom={"15px"}>
            {nickname}
          </Text>
          <VStack justify={"center"}>
            { !isFriend ?
              <Button size={"md"} colorScheme={"purple"} onClick={() => setIsFriend(true)}>
                Adicionar amigo
              </Button> :
              <Button size={"md"} colorScheme={"purple"} onClick={() => setIsFriend(false)}>
                Remover amigo
              </Button>
            }
            { isFriend ?
                <Button size={"md"} colorScheme={"purple"} onClick={() => console.log("chegue")}>
                  Bloquear
                </Button> : null
            }

          </VStack>
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
          <RankingCard
            position={userRanking?.position || 0}
            nickname={nickname || ""}
            matches={userRanking?.matches || 0}
            wins={userRanking?.matches || 0}
            losses={userRanking?.matches || 0}
            avatar={avatar || ""}/>

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
              {matchesList.map((match) => {
                return <MatchCard match={match} />;
              })}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}