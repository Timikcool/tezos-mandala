import { Container, Flex, Link, Text } from '@chakra-ui/layout'
import { VStack } from '@chakra-ui/react'
import React from 'react'
import config from '../config.json'

export const Footer = () => {
    return (
        <Flex w="100%" background="#E5E5E5" h="180px" marginTop="80px">
            <Container maxW="container.lg">
                <Flex h="100%" align="center" justify="center">
                    <VStack spacing={4}  >
                        <Text fontSize="sm" fontWeight="300">
                            Disclaimer: Tezos Mandalas are used as an art experiment to showcase the tooling of the Tezos ecosystem like Beacon, Taquito  etc.
                    </Text>
                        <Link alignSelf="flex-end" fontSize="sm" fontWeight="300" href={`https://better-call.dev/${config.network}/${config.contract}/`}>Smart Contract</Link>
                        <Link alignSelf="flex-end" fontSize="sm" fontWeight="300" href="https://github.com/Timikcool/tezos-mandala">GitHub</Link>
                    </VStack>
                </Flex>
            </Container>
        </Flex>
    )
}
