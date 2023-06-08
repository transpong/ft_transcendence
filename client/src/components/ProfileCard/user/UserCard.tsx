import {Avatar, Button, Flex, Grid, GridItem, Text, useBreakpointValue, VStack} from "@chakra-ui/react";
import {FC} from "react";
import {IUserProfile} from "../../../services/users-service";
import {avatarUrl} from "../../../helpers/avatar-url";

interface IUserCardProps {
    profile?: IUserProfile;
    handleAddFriend: () => void;
    handleRemoveFriend: () => void;
    handleBlockUser: () => void;
    handleUnblockUser: () => void;
}

const UserCard: FC<IUserCardProps> = ({
                                          profile,
                                          handleAddFriend,
                                          handleRemoveFriend,
                                          handleBlockUser,
                                          handleUnblockUser,
                                      }: IUserCardProps) => {

    const buttonSize = useBreakpointValue({base: '85%', md: '90%'});
    const buttonSpacing = useBreakpointValue({base: '2', md: '4'});
    const gridTemplateColumns = useBreakpointValue({base: '1fr', md: '1fr'});
    const avatarSize = useBreakpointValue({base: 'xl', md: 'lg', sm: 'lg', lg: '2xl'});
    const fontSize = useBreakpointValue({base: '15px', md: '25px', lg: '40px'});
    const padding = useBreakpointValue({base: '8', md: '5', sm: '1', lg: '8'});
    return (
        <Flex alignItems="center" justifyContent="center" height="70vh">
            <Grid
                padding={padding}
                templateColumns={gridTemplateColumns}
                gap="4"
                borderRadius="20px"
                border="8px"
                borderColor="#805AD5"
                backgroundColor="white"
                overflow="auto"
                maxWidth="500px"
                height="100%"
            >
                <GridItem>
                    <Flex direction="column" align="center" justify="center" height="100%">
                        <Avatar
                            size={avatarSize}
                            marginBottom={useBreakpointValue({base: '2', md: '4'})}
                            src={avatarUrl(profile?.avatar) || ""}
                        />
                        <Text fontSize={fontSize} fontWeight="bold" marginBottom={buttonSpacing}>
                            {profile?.nickname}
                        </Text>
                        <VStack justify={"center"}>
                            {!profile?.is_friend ? (
                                <Button width={buttonSize} colorScheme="purple" marginBottom={buttonSpacing}
                                        onClick={handleAddFriend}>
                                    Adicionar amigo
                                </Button>
                            ) : (
                                <Button width={buttonSize} colorScheme="purple" marginBottom={buttonSpacing}
                                        onClick={handleRemoveFriend}>
                                    Remover amigo
                                </Button>
                            )}
                            {!profile?.is_blocked ? (
                                <Button width={buttonSize} colorScheme="purple" marginBottom={buttonSpacing}
                                        onClick={handleBlockUser}>
                                    Bloquear
                                </Button>
                            ) : (
                                <Button width={buttonSize} colorScheme="purple" marginBottom={buttonSpacing}
                                        onClick={handleUnblockUser}>
                                    Desbloquear
                                </Button>
                            )}

                        </VStack>
                    </Flex>
                </GridItem>
            </Grid>
        </Flex>
    );
};

export default UserCard;
