import { SettingsIcon } from "@chakra-ui/icons";
import { Button, Box } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  type: 'group' | 'individual'
}

const HeaderNavgation = (props: Props) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const blockUser = async () => {
    setIsBlocked(true);
  }

  const unblockUser = async () => {
    setIsBlocked(false);
  };

  return (
    <Box mr="3px">
     { props.type == 'individual' ?
      (
        isBlocked ?
        <Button size="7px" fontSize="12px" borderRadius="3px" padding="2px" onClick={unblockUser}>Unblock</Button> :
        <Button size="7px" fontSize="12px" borderRadius="3px" padding="2px" onClick={blockUser} >Block</Button>
      )
     :
      <SettingsIcon /> }
    </Box>
  );
};

export default HeaderNavgation;
