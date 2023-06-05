import { Flex } from "@chakra-ui/layout";
import { Text, Avatar, Button, Box, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import RankingCard from "../../../../components/RankingCard/RankingCard";
import MatchCard from "../../../../components/MatchCard/MatchCard";
import { useOutlet, Outlet, useParams } from "react-router-dom";
import { gameService, IApiMatchHistory, IApiRanking } from "../../../../services/game-service";
import { IUserProfile, userService } from "../../../../services/users-service";
import { avatarUrl } from "../../../../helpers/avatar-url";

export default function Me(){
  const { user } = useParams()

  const [profile, setProfile] = useState<IUserProfile>();
  const [matchesList, setMatchesList] = useState<IApiMatchHistory[]>([]);
  const [userRanking, setUserRanking] = useState<IApiRanking>();

  useMemo(async () => {
    const userProfile = await userService.getProfile(user || '');
    setProfile(userProfile);

    const matches = await gameService.getMatchesHistory(userProfile.nickname);
    setMatchesList(matches);

    const ranking = await gameService.getUserRanking(userProfile.nickname);
    setUserRanking(ranking);
  }, [user]);

  async function handleAddFriend() {
    await userService.addFriend(profile?.nickname || '')
    const userProfile = await userService.getProfile(user || "");
    setProfile(userProfile);
  }

  async function handleRemoveFriend() {
    await userService.removeFriend(profile?.nickname || "");
    const userProfile = await userService.getProfile(user || "");
    setProfile(userProfile);
  }

  async function handleBlockUser() {
    await userService.blockUser(profile?.nickname || "");
    const userProfile = await userService.getProfile(user || "");
    setProfile(userProfile);
  }

  async function handleUnblockUser() {
    await userService.unblockUser(profile?.nickname || "");
    const userProfile = await userService.getProfile(user || "");
    setProfile(userProfile);
  }

  return useOutlet() ? <Outlet/> : (
    <>
      <Flex h='100%' w={"100%"} borderRadius={"20px"} align={"center"}>
        <Flex backgroundColor={"white"} width={"30%"} height={"90%"} marginLeft={"1%"} border={"8px"} borderColor={"#805AD5"} align={"center"} justify={"center"} flexDirection={"column"} borderRadius={"20px"}>
          <Avatar size={"2xl"} marginBottom={"55px"} src={avatarUrl(profile?.avatar) || ""} />
          <Text fontSize={"35px"} fontWeight={"bold"} marginBottom={"15px"}>
            {profile?.nickname}
          </Text>
          <VStack justify={"center"}>
            { !profile?.is_friend ?
              <Button size={"md"} colorScheme={"purple"} onClick={handleAddFriend}>
                Adicionar amigo
              </Button> :
              <Button size={"md"} colorScheme={"purple"} onClick={handleRemoveFriend}>
                Remover amigo
              </Button>
            }
            { !profile?.is_blocked ?
                <Button size={"md"} colorScheme={"purple"} onClick={handleBlockUser}>
                  Bloquear
                </Button> :
                <Button size={"md"} colorScheme={"purple"} onClick={handleUnblockUser}>
                  Desbloquear
                </Button>
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
            nickname={profile?.nickname || ""}
            matches={userRanking?.matches || 0}
            wins={userRanking?.wins || 0}
            losses={userRanking?.loses || 0}
            avatar={profile?.avatar || ""}
            draws={userRanking?.draws || 0}
          />

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