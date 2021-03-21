import { Container, Flex, HStack, Link, Text } from '@chakra-ui/layout'
import { Image, VStack } from '@chakra-ui/react'
import React from 'react'
import config from '../config.json'
import twitter from '../assets/img/twitter.png';
import octocat from '../assets/img/octocat.png'
import { FiTwitter, FiGithub } from "react-icons/fi";
import { FaTelegramPlane, FaTwitter, FaGithubAlt } from "react-icons/fa";

export const Footer = () => {
    return (
        <Flex w="100%" background="#E5E5E5" h="180px" marginTop="80px">
            <Container maxW="container.lg">
                <Flex h="100%" align="center" justify="center">
                    <Flex w="100%" justify="space-between" align="center">
                        <VStack spacing={4} align="flex-start">
                            <Text fontSize="lg" fontWeight="300">
                                #Buttonists
                            </Text>
                            <Text fontSize="lg" fontWeight="300">
                                #TezosDeFiHackathon
                            </Text>
                        </VStack>

                        <HStack spacing={4} align="center">
                            <Link alignSelf="flex-end" fontSize="18px" fontWeight="300" href="https://github.com/Timikcool/tezos-mandala"><FaGithubAlt /></Link>
                            <Link alignSelf="flex-end" fontSize="18px" fontWeight="300" href={`https://better-call.dev/${config.network}/${config.contract}/`}><FaTwitter /></Link>
                            <Link alignSelf="flex-end" fontSize="18px" fontWeight="300" href={`https://better-call.dev/${config.network}/${config.contract}/`}><FaTelegramPlane /></Link>
                        </HStack>

                    </Flex>
                </Flex>
            </Container >
        </Flex >
    )
}
