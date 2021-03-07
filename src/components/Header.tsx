import { Button } from '@chakra-ui/button';
import { Flex, Link, Box, HStack } from '@chakra-ui/layout';
import { Link as ReactLink } from 'react-router-dom';
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

    return (
        <Flex justify="space-between" w="100%" paddingTop="32px">
            <Logo>
                Tezos Mandala
            </Logo>

            <Box>
                <HStack spacing={8}>
                    <Link as={HashLink} smooth to="/#create-mandala" textDecoration="none" _hover={{ textDecoration: "none" }}>
                        <Button variant="outline" colorScheme="black" border="none" textDecoration="none" >Get Mandala</Button>
                    </Link>

                    <Link as={HashLink} smooth to='/#why-tezos-mandala' >
                        Why Mandala
                    </Link>
                    <Link as={ReactLink} to="/my-collection">
                        My Collection
                    </Link>
                    <Link as={ReactLink} to="/explore">
                        Explore Mandalas
                    </Link>
                </HStack>
            </Box>
        </Flex >
    )
}

export default Header;