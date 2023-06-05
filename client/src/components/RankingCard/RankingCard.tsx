import {
  Text,
  Avatar,
  Flex,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { avatarUrl } from "../../helpers/avatar-url";

interface Props {
  position: number;
  nickname: string;
  avatar: string;
  matches: number;
  wins: number;
  losses: number;
  draws: number;
}

export default function RankingCard(props: Props) {
  const { position, nickname, matches, wins, losses, avatar, draws } = props;
  const navigate = useNavigate();

  return (
    <HStack
      align="center"
      padding="10px"
      margin="10px"
      border="1px"
      borderRadius="10"
      backgroundColor="rgba(255,255,255, 0.9)"
    >
      <HStack w="35%">
        <VStack alignItems="center" spacing="0">
          <Text fontSize="12">Posição:</Text>
          <Text fontWeight="bold" fontSize="20">
            {position}
          </Text>
        </VStack>
        <Flex
          alignItems="center"
          onClick={() => navigate(`/home/profile/${nickname}`)}
          cursor="pointer"
        >
          <Avatar src={avatarUrl(avatar)} />
          <Text ml="3" fontWeight="bold">
            {nickname}
          </Text>
        </Flex>
      </HStack>
      <HStack w="50%" justifyContent="space-between">
        <VStack alignItems="center" spacing="0">
          <Text fontSize="12">Partidas:</Text>
          <Text fontWeight="bold" fontSize="20">
            {matches}
          </Text>
        </VStack>
        <VStack alignItems="center" spacing="0">
          <Text fontSize="12">Vitórias:</Text>
          <Text fontWeight="bold" fontSize="20">
            {wins}
          </Text>
        </VStack>
        <VStack alignItems="center" spacing="0">
          <Text fontSize="12">Derrotas:</Text>
          <Text fontWeight="bold" fontSize="20">
            {losses}
          </Text>
        </VStack>
        <VStack alignItems="center" spacing="0">
          <Text fontSize="12">Empates:</Text>
          <Text fontWeight="bold" fontSize="20">
            {draws}
          </Text>
        </VStack>
        <VStack alignItems="center" spacing="0">
          <Text fontSize="12">Pontuação:</Text>
          <Text fontWeight="bold" fontSize="20">
            {wins - losses}
          </Text>
        </VStack>
      </HStack>
    </HStack>
  );
}
