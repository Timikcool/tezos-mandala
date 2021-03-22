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
    useToast,
    Box
} from "@chakra-ui/react"
import { debounce, get } from "lodash";
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
    const [errorDescription, setErrorDescription] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { connectWallet, wallet, contract: contractInstance, setupContract } = useApp()
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
            const contract = contractInstance || await setupContract();
            const op = await contract.methods.buy(1).send({ amount: price, mutez: true });
            setStatus('success')

            await op.confirmation()
            toast({
                title: "Seed created",
                description: "Check it in the My Collection tab",
                status: "success",
                duration: 3500,
                isClosable: true,
                position: "top-right"
            })

        } catch (error) {
            console.log(error);
            if (error?.title === 'Aborted') {
                setStatus('initial');
                onClose();
                return;
            }

            if (error?.name === "MissedBlockDuringConfirmationError") {
                setStatus('error')
                return setErrorDescription('This thing is that it takes some time to confirm your previous operation. Please try again in a minute. It should work OK then.')
            }

            if (error?.name === 'BeaconWalletNotInitialized') {
                setStatus('error');
                return setErrorDescription("Tezos wallet didn't make it this time. Please refresh a page and try again")
            }

            const additional = get(error, 'data[1].with.string', '')
            const errorString = error?.title ? `${error.title} ${additional}` : JSON.stringify(error);
            setStatus('error')
            setErrorDescription(errorString)
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
                    <ModalBody >
                        {
                            status === 'initial' && (<VStack spacing={4}>
                                <Text>
                                    You are buying a mandala seed. It may be converted to mandala or traded whenever you want.
                        </Text>
                                <Text>
                                    To convert it click the Create Mandala button on the Seed card in the My Collection tab.
                        </Text>
                                <Text as={Box}>
                                    <Text fontWeight="bold" display="inline">Important:</Text> Please don’t send tez directly from your exchange account as this can result in the loss of your seed.
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
                                borderRadius="6px"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Yay!
                            </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    Your transaction was successfully sent and should be confirmed in a minute. Once it’s confirmed, your Mandala Seed will appear in the My Collection tab.
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
                                borderRadius="6px"
                            >
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Oops! Blockchain didn't make it this time.
                            </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    {errorDescription || 'Something went wrong. Please try again'}
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
