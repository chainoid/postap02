#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
set -e

export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}

# remove previous crypto material and config transactions
rm -fr config/*
rm -fr crypto-config/*

# generate crypto material
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

# generate genesis block for orderer
configtxgen -profile TwoOrgOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
configtxgen -profile TwoOrgChannel1 -outputCreateChannelTx ./config/channel1.tx -channelID parsel-channel
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel1 configuration transaction..."
  exit 1
fi

configtxgen -profile TwoOrgChannel2 -outputCreateChannelTx ./config/channel2.tx -channelID client-channel
if [ "$?" -ne 0 ]; then
  echo "Failed to generate channel1 configuration transaction..."
  exit 1
fi


# generate anchor peer transaction
configtxgen -profile TwoOrgChannel1 -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID parsel-channel -asOrg Org1MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org1MSP..."
  exit 1
fi

configtxgen -profile TwoOrgChannel2 -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID client-channel -asOrg Org1MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org1MSP..."
  exit 1
fi

configtxgen -profile TwoOrgChannel1 -outputAnchorPeersUpdate ./config/Org2MSPanchors.tx -channelID parsel-channel -asOrg Org2MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org2MSP..."
  exit 1
fi

configtxgen -profile TwoOrgChannel2 -outputAnchorPeersUpdate ./config/Org2MSPanchors.tx -channelID client-channel -asOrg Org2MSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for Org2MSP..."
  exit 1
fi