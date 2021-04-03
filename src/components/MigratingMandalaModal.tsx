import { Button } from '@chakra-ui/button';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Box, Input, Radio, RadioGroup, Spinner, Stack, Text, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import fix from '../utils/crutch';
import { useApp } from '../state/app';
import { migrationContract } from '../config.json'
import { get } from 'lodash';

const MigratingMandalaModal = () => {
    const { migratingMandala, setMigratingMandala, contract: contractInstance, setupContract, userAddress, Tezos } = useApp();
    const [migrating, setMigrating] = useState(false);
    const [migrateOption, setMigrateOption] = useState('0')
    const toast = useToast();
    const close = () => {
        setMigrateOption('0');
        setMigratingMandala(null);
        setMigrating(false);
    }
    const handleMigrate = async () => {
        setMigrating(true);
        try {
            const contract = contractInstance || await setupContract();
            const migrationContractInstance = await Tezos.wallet.at(migrationContract);
            const sc = (contract.methods.update_operators([
                {
                    add_operator: {
                        owner: userAddress,
                        operator: migrationContract,
                        token_id: migratingMandala.id
                    }
                }
            ]).parameterSchema.root.val = fix);
            const updateOperatorsOperation = await contract.methods.update_operators([
                {
                    add_operator: {
                        owner: userAddress,
                        operator: migrationContract,
                        token_id: migratingMandala.id,
                    },
                },
            ]).send();
            await updateOperatorsOperation.confirmation();
            const op = await migrationContractInstance.methods.migrate_seed(migrateOption, migratingMandala.id).send();
            toast({
                title: "Transaction was sent",
                description: "The transaction was sent and should be confirmed in a minute.",
                status: "success",
                duration: 3500,
                isClosable: true,
                position: "top-right"
            });
            setMigrating(false);
            setMigratingMandala(null);
            op.confirmation().then(() => {
                toast({
                    title: "Mandala was migrated",
                    description: "Your Mandala was successfully migrated.",
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
    if (!migratingMandala) return null;
    const isSeed = migratingMandala.rarity === 'Seed';
    return (
        <Modal isOpen onClose={close} size={migrating ? 'lg' : "5xl"} closeOnEsc={!migrating} closeOnOverlayClick={!migrating} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader isTruncated>{`Migration of #${migratingMandala.id} mandala to Tezos Mandala v2`}</ModalHeader>
                {!migrating && <ModalCloseButton />}
                <ModalBody>
                    {
                        migrating ? (<VStack spacing={8}>
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
                                <VStack spacing={4}>
                                    <Text>
                                        We’re migrating to Tezos Mandala v2. It’s a more secure version where we lowered the possible number of mandalas from 1999 to 1124 in order to make each mandala in your collection, be it Unique, Eye, or Tezos, even more rare. In order to migrate to v2, you have to choose from three options for each of your seeds and mandalas: get a new seed, transfer the mandala, or get a refund.
                                    </Text>
                                    <Text>
                                        All seeds and mandalas from v2 can be transformed into v2 seeds with the same ID. If you wish to keep a mandala from v1 you can transfer it to v2 without any changes and with the same ID. If you wish to return a seed or a mandala to us, you can get a refund, i.e. the amount paid minus the tx fee for refunding.
                                    </Text>
                                    <Text as={Box}>
                                        <Text fontWeight="bold" display="inline">THIS IS IMPORTANT:</Text> only seeds and mandalas with ID lower than 580 are eligible. 579 is the ID at which we halted the sale and announced the migration to v2. Please DO NOT try to use our old contract to get new mandalas. Please mind that once you have sent the migration transaction, you have made the final confirmation of your preferred course of action with regard to the three options described above, and you cannot change your choice in the future.
                                    </Text>
                                </VStack>
                                <RadioGroup onChange={val => setMigrateOption(val as string)} value={migrateOption}>
                                    <Stack direction="column">
                                        <Radio colorScheme="orange" _hover={{ cursor: 'pointer' }} _focus={{ boxShadow: '0 0 0 3px var(--chakra-colors-orange-200)' }} value="0" ><Text fontWeight="500" >Get New Seed</Text></Radio>
                                        <Text size="xs" fontWeight="300" style={{ marginInlineStart: "1.5em" }}>
                                            Exchange your seed or mandala for a new seed in v2 with the same ID. This option has no time limitations.</Text>
                                        <Radio colorScheme="orange" _hover={{ cursor: 'pointer' }} _focus={{ boxShadow: '0 0 0 3px var(--chakra-colors-orange-200)' }} value="1" disabled={isSeed}><Text fontWeight="500">Migrate Your Mandala</Text></Radio>
                                        <Text size="xs" fontWeight="300" style={{ marginInlineStart: "1.5em" }}>
                                            Transfer your mandala to v2 without changes and with the same ID. This option is only available from April 2nd, 2021 at 3 P.M. UTC to April 6th, 2021 at 3 A.M. UTC.    </Text>
                                        <Radio colorScheme="orange" _hover={{ cursor: 'pointer' }} _focus={{ boxShadow: '0 0 0 3px var(--chakra-colors-orange-200)' }} value="2" ><Text fontWeight="500">Get Refund</Text></Radio>
                                        <Text size="xs" fontWeight="300" style={{ marginInlineStart: "1.5em" }}>
                                            Send us your seed or mandala to get tez you had paid for it minus the tx fee for refunding. The tez are sent to the address from which you had sent your seed/mandala. You can use that tez to buy seeds in v2 but only at their current price (the starting price in v2 is 30 tez). This option is only available from April 2nd, 2021 at 3 P.M. UTC to April 6th, 2021 at 3 A.M. UTC.</Text>
                                    </Stack>
                                </RadioGroup>


                            </VStack>)
                    }
                </ModalBody >

                <ModalFooter>

                    {!migrating && <Button variant="outline"
                        colorScheme="black"
                        border="none" onClick={handleMigrate} _focus={{ background: '#e2e8f0' }} >Send</Button>}
                </ModalFooter>
            </ModalContent >
        </Modal >
    )
}

export default MigratingMandalaModal;