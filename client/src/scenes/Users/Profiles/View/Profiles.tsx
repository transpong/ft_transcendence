import {Flex} from "@chakra-ui/layout";
import {useBreakpointValue} from "@chakra-ui/react";
import {useMemo, useState} from "react";
import {Outlet, useOutlet, useParams} from "react-router-dom";
import {gameService, IApiMatchHistory, IApiRanking} from "../../../../services/game-service";
import {IUserProfile, userService} from "../../../../services/users-service";
import UserCard from "../../../../components/ProfileCard/user/UserCard";
import UserContent from "../../../../components/ProfileContent/user/UserContent";

export default function Me() {
    const {user} = useParams()

    const [profile, setProfile] = useState<IUserProfile>();
    const [matchesList, setMatchesList] = useState<IApiMatchHistory[]>([]);
    const [userRanking, setUserRanking] = useState<IApiRanking>();

    useMemo(async () => {
        const userProfile = await userService.getProfile(user || '');
        setProfile(userProfile);

        const matches = await gameService.getMatchesHistory(userProfile?.nickname || 'inexistent');
        setMatchesList(matches);

        const ranking = await gameService.getUserRanking(userProfile?.nickname || 'inexistent');
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

    const isLargeScreen = useBreakpointValue({base: false, sm: false, md: true});

    return useOutlet() ? <Outlet/> : (
        <>
            {isLargeScreen ? (
                    <Flex h="100%" w="100%" borderRadius="20px" align="center" gap={2}>
                        <UserCard handleAddFriend={handleAddFriend} handleRemoveFriend={handleRemoveFriend}
                                  handleBlockUser={handleBlockUser} handleUnblockUser={handleUnblockUser}
                                  profile={profile}/>
                        <UserContent matchesList={matchesList} userRanking={userRanking} profile={profile}
                                     key={profile?.id}/>
                    </Flex>)
                : (
                    <Flex direction="column" h="100%" w="100%" borderRadius="20px" align="center" gap={2} padding={4}>
                        <UserCard handleAddFriend={handleAddFriend} handleRemoveFriend={handleRemoveFriend}
                                  handleBlockUser={handleBlockUser} handleUnblockUser={handleUnblockUser}
                                  profile={profile}/>
                        <UserContent matchesList={matchesList} userRanking={userRanking} profile={profile}
                                     key={profile?.id}/>
                    </Flex>
                )}
        </>
    );
}
