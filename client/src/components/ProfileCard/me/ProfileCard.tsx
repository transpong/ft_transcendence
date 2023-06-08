import {Avatar, Button, Flex, Grid, GridItem, Input, Text, useBreakpointValue} from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';
import {avatarUrl} from '../../../helpers/avatar-url';
import {IApiUserMe} from '../../../services/users-service';
import {FC, useRef} from 'react';

interface IProfileSectionProps {
    isUploading: boolean;
    me: IApiUserMe | undefined;
    handlePhotoSelect: (file: File | null) => void;
    handleMfaActivation: () => Promise<void>;
    handleMfadeactivation: () => Promise<void>;
}

const ProfileCard: FC<IProfileSectionProps> = ({
                                                   isUploading,
                                                   me,
                                                   handlePhotoSelect,
                                                   handleMfaActivation,
                                                   handleMfadeactivation,
                                               }: IProfileSectionProps) => {
    const navigate = useNavigate();
    const buttonSize = useBreakpointValue({base: '85%', md: '90%'});
    const buttonSpacing = useBreakpointValue({base: '2', md: '4'});
    const gridTemplateColumns = useBreakpointValue({base: '1fr', md: '1fr'});
    const avatarSize = useBreakpointValue({base: 'xl', md: 'lg', sm: 'lg', lg: '2xl'});
    const fontSize = useBreakpointValue({base: '15px', md: '25px', lg: '40px'});
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);
    const padding = useBreakpointValue({base: '8', md: '5', sm: '1', lg: '8'});
    const handleButtonClick = () => {
        hiddenInputRef.current?.click();
    };

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
                        <Avatar size={avatarSize} marginBottom={useBreakpointValue({base: '2', md: '4'})}
                                src={avatarUrl(me?.avatar)}/>
                        <Input
                            hidden
                            type="file"
                            ref={hiddenInputRef}
                            onChange={(e) => handlePhotoSelect(e.target.files && e.target.files[0])}
                        />

                        <Button
                            width={buttonSize}
                            colorScheme="purple"
                            marginBottom={buttonSpacing}
                            isLoading={isUploading}
                            onClick={handleButtonClick}
                        >
                            Atualizar Avatar
                        </Button>
                        <Text fontSize={fontSize} fontWeight="bold" marginBottom={buttonSpacing}>
                            {me?.nickname}
                        </Text>
                        <Button width={buttonSize} colorScheme="purple" marginBottom={buttonSpacing}
                                onClick={() => navigate('/nickname')}>
                            Alterar Nickname
                        </Button>
                        {
                            sessionStorage.getItem("isGuest") != "true" && !me?.is_mfa_enabled ? (
                                <Button width={buttonSize} colorScheme="purple" onClick={handleMfaActivation}>
                                    Ativar MFA
                                </Button>
                            ) : (
                                sessionStorage.getItem("isGuest") != "true" && me?.is_mfa_enabled && (
                                    <Button width={buttonSize} colorScheme="purple" onClick={handleMfadeactivation}>
                                        Desativar MFA
                                    </Button>
                                )
                            )
                        }
                    </Flex>
                </GridItem>
            </Grid>
        </Flex>
    );
};

export default ProfileCard;
