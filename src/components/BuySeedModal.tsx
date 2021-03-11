import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Text,
    VStack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Spinner
} from "@chakra-ui/react"
import { debounce } from "lodash";

import React, { useEffect, useState } from 'react'
import { useApp } from "../state/app";


const BuySeedModal = () => {
    const [status, setStatus] = useState<'initial' | 'processing' | 'error' | 'success'>('initial')
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { connectWallet, buySeed, wallet } = useApp();
    const handleGetMandala = async () => {
        if (!wallet) {
            await connectWallet();
        }

        onOpen();
    };

    const handleBuy = async () => {
        try {
            setStatus('processing');
            const success = await buySeed();

            if (success) {
                setStatus('success')
                debounce(onClose, 3500)();
            } else {
                setStatus('error')
            }
        } catch (error) {
            setStatus('error')
        }
    }

    useEffect(() => {
        return () => {
            setStatus('initial')
        }
    }, [])
    return (
        <>
            <Button
                variant="outline"
                colorScheme="black"
                border="none"
                _focus={{ background: '#e2e8f0' }}
                onClick={handleGetMandala}
            >
                Get Mandala
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={status !== 'processing'} closeOnEsc={status !== 'processing'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Buy Mandala Seed</ModalHeader>
                    {status !== 'processing' && <ModalCloseButton />}
                    <ModalBody>
                        {
                            status === 'initial' && (<VStack spacing={4}>
                                <Text>
                                    You are buying mandala seed which might be converted to mandala whenever you want, or traded as well
                        </Text>
                                <Text>
                                    For conversion go to My Collection and click Create Mandala button on Seed card
                        </Text>
                            </VStack>)
                        }

                        {
                            status === 'processing' && (<VStack spacing={8}>
                                <Text >Please wait...</Text>
                                <Spinner
                                    thickness="4px"
                                    speed="0.65s"
                                    emptyColor="gray.200"
                                    color="orange.500"
                                    size="xl"
                                />
                            </VStack>)
                        }

                        {
                            status === 'success' && (<Alert
                                status="success"
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                height="200px"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Success!
                            </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    Your Mandala Seed will appear at My Collection tab in a minute
                            </AlertDescription>
                            </Alert>)
                        }

                        {
                            status === 'error' && (<Alert
                                status="error"
                                variant="subtle"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                height="200px"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Error
                            </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    Something went wrong. Please try again
                            </AlertDescription>
                            </Alert>)
                        }

                    </ModalBody>

                    <ModalFooter>
                        {/* <Button colorScheme="red" mr={3} onClick={onClose}>
                            Close
                        </Button> */}
                        {status === 'initial' && <Button variant="outline"
                            colorScheme="black"
                            border="none" onClick={handleBuy} _focus={{ background: '#e2e8f0' }} >Buy Seed</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default BuySeedModal
