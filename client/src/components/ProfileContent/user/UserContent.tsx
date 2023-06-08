import {Flex, Text, Box} from "@chakra-ui/react";
import MatchCard from "../../MatchCard/MatchCard";
import RankingCard from "../../RankingCard/RankingCard";
import {IApiMatchHistory, IApiRanking} from "../../../services/game-service";
import {IUserProfile} from "../../../services/users-service";
import {FC} from "react";

interface IUserContentProps {
    userRanking?: IApiRanking | undefined;
    profile?: IUserProfile | undefined;
    matchesList: IApiMatchHistory[];
}

const UserContent: FC<IUserContentProps> = ({userRanking, profile, matchesList}: IUserContentProps) => {
    return (
        <Flex
            width={"100%"}
            height="70vh"
            marginLeft={"1%"}
            border={"8px"}
            borderColor={"#805AD5"}
            flexDirection={"column"}
            borderRadius={"20px"}
        >
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
                        return <MatchCard match={match} key={match.id}/>;
                    })}
                </Box>
            </Box>
        </Flex>
    );
};

export default UserContent;
