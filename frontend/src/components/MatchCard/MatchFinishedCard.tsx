import { Box, Text, Badge, Avatar, Flex, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { avatarUrl } from "../../helpers/avatar-url";
import { IApiMatchHistory } from "../../services/game-service";

interface Props {
  match: IApiMatchHistory;
}

export default function MatchFinishedCard(props: Props) {
  const { match } = props;
  const navigate = useNavigate();

  return (
    <HStack
      align="center"
      justify="space-evenly"
      padding="10px"
      margin="10px"
      border="1px"
      borderRadius="10"
      backgroundColor="rgba(255,255,255, 0.9)"
    >
      <Flex onClick={() => navigate(`/home/profile/${match.user_1.nickname}`)} cursor="pointer">
        <Avatar src={avatarUrl(match.user_1.avatar)} />
        <Box ml="3">
          <Text fontWeight="bold">{match.user_1.nickname}</Text>
          {match.user_1.is_winner && !match.draw ? (
            <Badge ml="1" colorScheme="green">
              Vitória
            </Badge>
          ) : (
            !match.user_1.is_winner && !match.draw ? (
              <Badge ml="1" colorScheme="red">
                Derrota
              </Badge>
            ) : (
              <Badge ml="1" colorScheme="blue">
                Empate
              </Badge>
            )
          )}
        </Box>
      </Flex>
      <Flex>
        <Text ml="10" fontWeight="bold" fontSize="20">
          {match.user_1.score}
        </Text>
        <Text ml="10" fontWeight="bold" fontSize="20">
          x
        </Text>
        <Text ml="10" fontWeight="bold" fontSize="20">
          {match.user_2.score}
        </Text>
      </Flex>
      <Flex onClick={() => navigate(`/home/profile/${match.user_2.nickname}`)} cursor="pointer">
        <Avatar ml="10" src={avatarUrl(match.user_2.avatar)} />
        <Box ml="3">
          <Text fontWeight="bold">{match.user_2.nickname}</Text>
          {match.user_2.is_winner && !match.draw ? (
            <Badge ml="1" colorScheme="green">
              Vitória
            </Badge>
          ) : (
            !match.user_2.is_winner && !match.draw ? (
              <Badge ml="1" colorScheme="red">
                Derrota
              </Badge>
            ) : (
              <Badge ml="1" colorScheme="blue">
                Empate
              </Badge>
            )
          )}
        </Box>
      </Flex>
    </HStack>
  );
}
