import {Flex} from "@chakra-ui/layout";
import {useEffect, useMemo, useState} from "react";
import {Outlet, useLocation, useNavigate, useOutlet} from "react-router-dom";
import {IApiUserMe, userService} from "../../../../services/users-service";
import {gameService, IApiMatchHistory, IApiRanking,} from "../../../../services/game-service";
import ProfileCard from "../../../../components/ProfileCard/me/ProfileCard";
import ProfileContent from "../../../../components/ProfileContent/me/ProfileContent";
import {useBreakpointValue} from "@chakra-ui/react";

export default function Me() {
    const [isUploading, setIsUploading] = useState(false);
    const [me, setMe] = useState<IApiUserMe>();
    const [matchesList, setMatchesList] = useState<IApiMatchHistory[]>([]);
    const [userRanking, setUserRanking] = useState<IApiRanking>();
    const navigate = useNavigate();
    const {key} = useLocation();

    useMemo(async () => {
        const myData = await userService.getMe();
        setMe(myData);

        const matches = await gameService.getMatchesHistory(myData?.nickname || 'inexistent');
        setMatchesList(matches);

        const ranking = await gameService.getUserRanking(myData?.nickname || 'inexistent');
        setUserRanking(ranking);
    }, []);

    useEffect(() => {
        userService.getMe().then((data) => {
            setMe(data);
        });
    }, [key]);

    async function handlePhotoSelect(file: File | null) {
        setIsUploading(true);

        if (!file) return;

        const photoFormData = new FormData();

        photoFormData.append("file", file);

        try {
            await userService.uploadAvatar(photoFormData);
            window.location.reload();
        } catch {
            setIsUploading(false);
        }
    }

    async function handleMfaActivation() {
      try {
        const data = await userService.activateMfa();

        navigate(`/home/me/mfa`, {
            state: {
                qr_code: data.qr_code_url,
            },
        });
      } catch {}
    }

    async function handleMfadeactivation() {
        await userService.disableMfa();
        const myData = await userService.getMe();
        setMe(myData);
    }

    const isLargeScreen = useBreakpointValue({base: false, sm: false, md: true});

    return useOutlet() ? (
        <Outlet/>
    ) : (
        <>
            {isLargeScreen ? (
                <Flex h="100%" w="100%" borderRadius="20px" align="center" gap={2}>
                    <ProfileCard
                        isUploading={isUploading}
                        me={me}
                        handlePhotoSelect={handlePhotoSelect}
                        handleMfaActivation={handleMfaActivation}
                        handleMfadeactivation={handleMfadeactivation}
                    />
                    <ProfileContent userRanking={userRanking} me={me} matchesList={matchesList}/>
                </Flex>
            ) : (
                <Flex direction="column" h="100%" w="100%" borderRadius="20px" align="center" gap={2} padding={4}>
                    <ProfileCard
                        isUploading={isUploading}
                        me={me}
                        handlePhotoSelect={handlePhotoSelect}
                        handleMfaActivation={handleMfaActivation}
                        handleMfadeactivation={handleMfadeactivation}
                    />
                    <ProfileContent userRanking={userRanking} me={me} matchesList={matchesList} key={me?.id}/>
                </Flex>
            )}
        </>
    );
}
