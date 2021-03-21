import { Button } from '@chakra-ui/button';
import { Link } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import React from 'react'
import { useApp } from '../state/app';
import { shortage } from '../utils/shortage';
import config from '../config.json';

const WalletButton = () => {
    const { userAddress, connectWallet, disconnectWallet } = useApp();

    const handleConnect = async () => {
        try {
            await connectWallet();
        } catch (error) {
            console.log({ error });

        }
    }

    const handleDisconnect = async () => {
        try {
            await disconnectWallet();
        } catch (error) {
            console.log(error);
        }
    }

    if (userAddress) {
        return <Menu placement="bottom-start" offset={[-32, 10]} colorScheme="orange    " >
            <MenuButton variant="outline"
                color="orange.500"
                colorScheme="orange"
                boxShadow="none"
                fontWeight="400"
                borderColor="orange.500"
                _hover={{ boxShadow: 'none' }}
                _focus={{ backgroundColor: 'var(--chakra-colors-orange-100)', background: 'var(--chakra-colors-orange-100)' }}
                as={Button}>
                {shortage(userAddress)}
            </MenuButton>
            <MenuList>
                <MenuItem onClick={handleDisconnect}>Disconnect Wallet</MenuItem>
                <MenuItem as={Link} href={`https://better-call.dev/${config.network}/${config.contract}/`} target="_blank" rel="noreferrer noopener" _hover={{ textDecoration: 'none', color: 'inherit' }} >Open in Explorer</MenuItem>
            </MenuList>
        </Menu >
    }
    return (
        <Button variant="outline"
            color="black"
            boxShadow="none"
            fontWeight="400"
            _hover={{ boxShadow: 'none' }}
            // _focus={{ background: '#e2e8f0' }}
            onClick={handleConnect}>Connect Wallet</Button>
    )
}

export default WalletButton;
