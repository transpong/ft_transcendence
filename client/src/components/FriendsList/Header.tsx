import { MinusIcon, AddIcon } from "@chakra-ui/icons";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

type Props = {
    minimized: () => void;
    getStatusMinimized: () => boolean;
};

const Header = (props: Props) => {
    return (
        <Flex
            minHeight={"40px"}
            backgroundColor={"#805AD5"}
            borderTopRadius={""}
            justify={"center"}
            cursor={"pointer"}
            onClick={() => props.minimized()}
            _hover={{
                bg: useColorModeValue("#402d6a", "#402d6a"),
            }}
        >
            <Flex flexDirection="column" mx="5" justify="center">
                <Text
                    color={useColorModeValue("#805AD5", "#805AD5")}
                    fontSize="larger"
                    fontWeight="bold"
                    style={{ color: "white" }} // Adicionado estilo inline para definir a cor roxa
                >
                    CHAT
                </Text>
            </Flex>
            <Flex align={"center"} flexDirection={"row-reverse"}>
                {props.getStatusMinimized() ? <MinusIcon /> : <AddIcon />}
            </Flex>
        </Flex>
    );
};

export default Header;
