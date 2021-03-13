import { Button } from '@chakra-ui/button';
import { Flex, Link, Box, HStack, VStack } from '@chakra-ui/layout';
import { NavLink as ReactLink, useHistory } from 'react-router-dom';
import React from 'react'
import styled from 'styled-components';
import { HashLink } from 'react-router-hash-link';
import { useApp } from '../state/app';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { Image } from '@chakra-ui/image';
import BuySeedModal from './BuySeedModal';


const Logo = styled.a`
font-family: Roboto;
font-style: normal;
font-weight: 500;
font-size: 18px;
line-height: 33px;
color: #14213D;
text-decoration: none;
display: flex;
align-items: center;

    img { 
        margin-right: 8px;
    }
`;




const Header = () => {
    const { wallet, connectWallet } = useApp();
    const history = useHistory();
    const [show, setShow] = React.useState(false);
    const handleToggle = () => setShow(!show);
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
        <>
            <Flex justify="space-between" w="100%" paddingTop="32px">
                <Logo href="/">
                    <Image src="favicon.png" alt="" w="20px" h="20px" />
                    Tezos Mandala
                </Logo>

                <Box display={{ base: "flex", md: "none" }} align="center" onClick={handleToggle} _hover={{
                    cursor: 'pointer'
                }}>
                    {show ? <CloseIcon /> : <HamburgerIcon />}
                </Box >

                <Box display={{ base: "none", md: "block" }} >
                    <HStack spacing={8}>
                        {/* <Link as={HashLink} smooth to="/#create-mandala" textDecoration="none" _hover={{ textDecoration: "none", color: 'inherit' }}>
                            <Button variant="outline" colorScheme="black" border="none" textDecoration="none" >Get Mandala</Button>
                        </Link> */}

                        <BuySeedModal />

                        <Link as={HashLink} smooth to='/#why-tezos-mandala' _hover={{ textDecoration: 'underline' }} >
                            Why Mandala
                    </Link>
                        <Link as={ReactLink} to="/my-collection" activeStyle={{ color: ' #FCA311' }} _hover={{ textDecoration: 'underline' }}>
                            My Collection
                    </Link>
                        <Link as={ReactLink} to="/explore" activeStyle={{ color: ' #FCA311' }} _hover={{ textDecoration: 'underline' }}>
                            Explore Mandalas
                    </Link>
                    </HStack>
                </Box>
            </Flex >
            {    show && <Box marginLeft="auto" marginRight="0" marginTop="4px" >
                <VStack spacing={4}>
                    <Link as={HashLink} smooth to='/#why-tezos-mandala' _hover={{ color: 'inherit', textDecoration: 'underline' }} >
                        Why Mandala
                    </Link>
                    <Link as={ReactLink} to="/my-collection" onClick={handleMyCollectionClick} activeStyle={{ color: ' #FCA311' }} _hover={{ color: 'inherit', textDecoration: 'underline' }}>
                        My Collection
                    </Link>
                    <Link as={ReactLink} to="/explore" activeStyle={{ color: ' #FCA311' }} _hover={{ color: 'inherit', textDecoration: 'underline' }}>
                        Explore Mandalas
                    </Link>

                    <Link as={HashLink} smooth to="/#create-mandala" textDecoration="none" _hover={{ textDecoration: "none", color: 'inherit' }}>
                        <Button variant="outline" colorScheme="black" border="none" textDecoration="none" >Get Mandala</Button>
                    </Link>
                </VStack>
            </Box>}
        </>
    )
}

export default Header;