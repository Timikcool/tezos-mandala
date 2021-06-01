import { Button } from '@chakra-ui/button';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Box, Input, Radio, RadioGroup, Spinner, Stack, Text, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import fix from '../utils/crutch';
import { useApp } from '../state/app';
import { oldContract as oldContractAddress, contract as contractAddress } from '../config.json'
import { get } from 'lodash';
import { char2Bytes } from "@taquito/utils";



const RenameMandalaModal = () => {
    const { renamingMandala, setRenamingMandala, contract: contractInstance, setupContract } = useApp();
    const [renaming, setRenaming] = useState(false);
    const [mandalaName, setMandalaName] = useState(renamingMandala?.name || '')
    const toast = useToast();
    const close = () => {
        setRenamingMandala(null);
        setRenaming(false);
    }
    const handleRename = async () => {
        setRenaming(true);
        try {
            const contract = contractInstance || await setupContract();
            const op = await contract.methods.name(renamingMandala.id, char2Bytes(mandalaName)).send();
            toast({
                title: "Transaction was sent",
                description: "The transaction was sent and should be confirmed in a minute.",
                status: "success",
                duration: 3500,
                isClosable: true,
                position: "top-right"
            });
            setRenaming(false);
            setRenamingMandala(null);
            op.confirmation().then(() => {
                toast({
                    title: "Yay! Your mandala is successfully renamed",
                    description: "Check it in My Collection tab.",
                    status: "success",
                    duration: 3500,
                    isClosable: true,
                    position: "top-right"
                });
            })
        } catch (error) {
            console.log(error)
            if (error?.title === 'Aborted') {
                // setStatus('initial');
                // onClose();
                // return;
                // close();
            }

            if (error?.name === "MissedBlockDuringConfirmationError") {
                return toast({
                    title: 'Error',
                    description: 'This thing is that it takes some time to confirm your previous operation. Please try again in a minute. It should work OK then.',
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right"
                })
            }

            if (error?.name === 'BeaconWalletNotInitialized') {
                return toast({
                    title: 'Error',
                    description: "Tezos wallet didn't make it this time. Please refresh a page and try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right"
                })
            }

            const additional = get(error, 'data[1].with.string', '')
            const errorString = error?.title ? `${error.title} ${additional}` : JSON.stringify(error);

            toast({
                title: 'Error',
                description: errorString,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })

        } finally {
            close()
        }

    }
    if (!renamingMandala) return null;
    const isInvalid = char2Bytes(mandalaName).length > 60;
    // const isSeed = migratingMandala.rarity === 'Seed';
    return (
        <Modal isOpen onClose={close} isCentered closeOnEsc={!renaming} closeOnOverlayClick={!renaming} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader isTruncated>{`Rename #${renamingMandala.id} mandala`}</ModalHeader>
                {!renaming && <ModalCloseButton />}
                <ModalBody>
                    {
                        renaming ? (<VStack spacing={8}>
                            <Text >Please wait...</Text>
                            <Spinner
                                thickness="4px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="orange.500"
                                size="xl"
                            />
                        </VStack>) :
                            (<VStack spacing={4}>

                                <Text>You are about to rename your mandala. If that’s your intent, please type the new name in the New Name field and click Rename. Please note that the name should have maximum 30 characters.</Text>
                                <Input
                                    value={mandalaName}
                                    onChange={e => setMandalaName(e.target.value)}
                                    placeholder="Mandala name"
                                    size="md"
                                    maxLength={30}
                                    colorScheme="orange.500"
                                    isInvalid={isInvalid}
                                    errorBorderColor="red.300"
                                    _focus={isInvalid ? { borderColor: "red.500", boxShadow: '0 0 0 1px var(--chakra-colors-red-500)' } : { borderColor: "orange.500", boxShadow: '0 0 0 1px var(--chakra-colors-orange-500)' }}
                                />
                                {isInvalid && <Text color="red.500" fontSize="12px">Can't be renamed to that due blockchain limitations. Please try shorter name</Text>}

                                <Text>
                                    <Text fontWeight="bold" display="inline">Important: </Text>At the moment, we support Latin-only characters for names. Please do not try to use other characters as your new mandala name won't be displayed correctly for the next two months.
                            </Text>
                                <Text>
                                    <Text fontWeight="bold" display="inline">Important: </Text>You will NOT be able to cancel renaming your mandala after clicking Rename. Remember that each new renaming will require twice as much waiting compared to the previous one. Thus, after you click Rename for the first time, you will be able to rename it again in 2 months. If you choose to rename it again after that, you will have to wait 4 months. Then it will be 8, 16, 32 months and so forth. We therefore urge you to be very careful and double-check everything when renaming your mandala.
                            </Text>

                            </VStack>)
                    }
                </ModalBody >

                <ModalFooter>

                    {!renaming && <Button variant="outline"
                        colorScheme="black"
                        disabled={isInvalid}
                        border="none" onClick={handleRename} _focus={{ background: '#e2e8f0' }} >Rename</Button>}
                </ModalFooter>
            </ModalContent >
        </Modal >
    )
}

export default RenameMandalaModal;