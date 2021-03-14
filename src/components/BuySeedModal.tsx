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
    Spinner,
    useToast
} from "@chakra-ui/react"
import { debounce } from "lodash";
import config from '../config.json';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getContractStorage } from "../service/bcd";
import { useApp } from "../state/app";
import selectObjectByKeys from "../utils/selectObjectByKeys";
import { tzToMutez } from "../utils/mutez";
import { getPriceFromId } from "../utils/price";


const BuySeedModal = () => {
    const toast = useToast();
    const [status, setStatus] = useState<'initial' | 'processing' | 'error' | 'success'>('initial')
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { connectWallet, wallet, contract } = useApp()
    const timeoutId = useRef(null);

    const handleGetMandala = async () => {
        if (!wallet) {
            await connectWallet();
        }

        onOpen();
    };

    useEffect(() => {
        if (status === 'success') {
            const newTimeoutId = setTimeout(() => {
                console.log({ isOpen, status });

                if (isOpen) {
                    onClose();
                    setStatus('initial');
                }
            }, 5000);
            timeoutId.current = newTimeoutId
        } else {
            clearTimeout(timeoutId.current)
        }
    }, [status])

    const handleBuy = async () => {
        try {
            setStatus('processing');
            const storage = await getContractStorage(config.contract);
            const id = parseInt(selectObjectByKeys(storage, { type: 'nat', name: "next_id" })?.value) + 1;
            const price = tzToMutez(getPriceFromId(id));
            const op = await contract.methods.buy(1).send({ amount: price, mutez: true });
            setStatus('success')

            await op.confirmation()
            toast({
                title: "Seed created",
                description: "It's avaliable at My Collection tab",
                status: "success",
                duration: 3500,
                isClosable: true,
            })

        } catch (error) {
            console.log(error);

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

            <Modal isOpen={isOpen} onClose={() => {
                setStatus('initial');
                onClose();
            }} isCentered closeOnOverlayClick={status !== 'processing'} closeOnEsc={status !== 'processing'}>
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
                                <Text>
                                    <Text fontWeight="bold" display="inline">Important:</Text> Please, do not try to send tez directly from your exchange account, this could cause the loss of your seed.
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
                                    Your transaction successfuly sent. Mandala Seed will appear at My Collection tab after confirmation.
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
