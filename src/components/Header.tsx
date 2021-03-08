import { Button } from '@chakra-ui/button';
import { Flex, Link, Box, HStack } from '@chakra-ui/layout';
import { NavLink as ReactLink, useHistory } from 'react-router-dom';
import React from 'react'
import styled from 'styled-components';
import { HashLink } from 'react-router-hash-link';
import { useApp } from '../state/app';


const Logo = styled.span`
font-family: Roboto;
font-style: normal;
font-weight: 500;
font-size: 18px;
line-height: 33px;
color: #14213D;
`;




const Header = () => {
    const { wallet, connectWallet } = useApp();
    const history = useHistory();
    const handleMyCollectionClick = async () => {
        try {
            if (!wallet) {
                await connectWallet()

            }
            history.push('/my-collection')
        } catch (error) {

        }

    }

    return (
        <Flex justify="space-between" w="100%" paddingTop="32px">
            <Logo>
                Tezos Mandala
            </Logo>

            <Box>
                <HStack spacing={8}>
                    <Link as={HashLink} smooth to="/#create-mandala" textDecoration="none" _hover={{ textDecoration: "none", color: 'inherit' }}>
                        <Button variant="outline" colorScheme="black" border="none" textDecoration="none" >Get Mandala</Button>
                    </Link>

                    <Link as={HashLink} smooth to='/#why-tezos-mandala' _hover={{ color: 'inherit', textDecoration: 'underline' }} >
                        Why Mandala
                    </Link>
                    <Link as={ReactLink} to="/my-collection" onClick={handleMyCollectionClick} activeStyle={{ color: ' #FCA311' }} _hover={{ color: 'inherit', textDecoration: 'underline' }}>
                        My Collection
                    </Link>
                    <Link as={ReactLink} to="/explore" activeStyle={{ color: ' #FCA311' }} _hover={{ color: 'inherit', textDecoration: 'underline' }}>
                        Explore Mandalas
                    </Link>
                </HStack>
            </Box>
        </Flex >
    )
}

export default Header;