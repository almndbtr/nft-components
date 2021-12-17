/*! For license information please see vendors~main.79339099.iframe.bundle.js.LICENSE.txt */
  fragment AskPrice on Ask {
    id
    currency {
      ...CurrencyShort
    }
    amount
    createdAtTimestamp
  }

  fragment NFTMedia on Media {
    id
    creatorBidShare
    ownerBidShare
    owner {
      id
    }
    creator {
      id
    }
    currentAsk {
      ...AskPrice
    }
    createdAtTimestamp
    metadataURI
    metadataHash
    contentURI
    contentHash
  }
`,AUCTION_PARTIALS=graphql_request_1.gql`
  fragment CurrencyShort on Currency {
    id
    name
    symbol
    decimals
  }

  fragment PreviousReserveBid on InactiveReserveAuctionBid {
    id
    bidder {
      id
    }
    transactionHash
    createdAtTimestamp
    amount
    bidType
    bidInactivatedAtTimestamp
    bidInactivatedAtBlockNumber
  }

  fragment CurrentReserveBid on ReserveAuctionBid {
    bidType
    amount
    transactionHash
    createdAtTimestamp
    bidder {
      id
    }
  }

  fragment ReserveAuctionPartial on ReserveAuction {
    id
    tokenId
    tokenContract
    transactionHash
    status
    approved
    reservePrice
    firstBidTime
    token
    createdAtTimestamp
    approvedTimestamp
    curator {
      id
    }
    curatorFeePercentage
    tokenOwner {
      id
    }
    auctionCurrency {
      ...CurrencyShort
    }
    currentBid {
      ...CurrentReserveBid
    }
    previousBids {
      ...PreviousReserveBid
    }
    duration
    expectedEndTimestamp
    finalizedAtTimestamp
  }
`;exports.GET_AUCTION_BY_CURATOR=graphql_request_1.gql`
  ${AUCTION_PARTIALS}
  ${MEDIA_PARTIALS}

  fragment ReserveAuctionPartialWithMedia on ReserveAuction {
    ...ReserveAuctionPartial
    media {
      ...NFTMedia
    }
  }

  query getAuctionsByCurator(
    $curators: [String!]
    $approved: [Boolean!]
    $first: Int
    $skip: Int
  ) {
    reserveAuctions(
      where: { curator_in: $curators, approved_in: $approved }
      first: $first
      skip: $skip
      orderBy: createdAtTimestamp
      orderDirection: desc
    ) {
      ...ReserveAuctionPartialWithMedia
    }
  }
`,exports.GET_ALL_AUCTIONS=graphql_request_1.gql`
  ${AUCTION_PARTIALS}

  query getAllAuctions($approved: [Boolean!], $first: Int, $skip: Int) {
    reserveAuctions(where: { approved_in: $approved }, first: $first, skip: $skip) {
      ...ReserveAuctionPartial
    }
  }
`,exports.GET_AUCTION_BY_MEDIA=graphql_request_1.gql`
  ${AUCTION_PARTIALS}

  query getAuctionByMedia($tokens: [String!]) {
    reserveAuctions(
      first: 300
      where: { token_in: $tokens }
      orderBy: createdAtTimestamp
      orderDirection: desc
    ) {
      ...ReserveAuctionPartial
    }
  }
`,exports.GET_MEDIAS_QUERY=graphql_request_1.gql`
  ${AUCTION_PARTIALS}
  ${MEDIA_PARTIALS}

  fragment BidDataPartial on Bid {
    id
    bidder {
      id
    }
    createdAtTimestamp
    transactionHash
    amount
    currency {
      ...CurrencyShort
    }
  }

  fragment TransferPartial on Transfer {
    id
    transactionHash
    from {
      id
    }
    to {
      id
    }
    createdAtTimestamp
    createdAtBlockNumber
  }

  fragment NFTMediaFullData on Media {
    ...NFTMedia
    currentBids {
      ...BidDataPartial
    }
    transfers {
      ...TransferPartial
    }
    reserveAuctions(orderBy: createdAtTimestamp, orderDirection: desc, first: 1) {
      ...ReserveAuctionPartial
    }
  }

  query getMediaAndAuctions(
    $id_ids: [ID!]
    $creator_ids: [String!]
    $owner_ids: [String!]
  ) {
    id: medias(
      where: { id_in: $id_ids }
      first: 500
    ) {
      ...NFTMediaFullData
    }
    creator: medias(
      where: { creator_in: $creator_ids }
      first: 500
    ) {
      ...NFTMediaFullData
    }
    owner: medias(
      where: { owner_in: $owner_ids }
      first: 500
    ) {
      ...NFTMediaFullData
    }
  }
`},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.GET_TOKEN_VALUES_QUERY=void 0;const graphql_request_1=__webpack_require__(257);exports.GET_TOKEN_VALUES_QUERY=graphql_request_1.gql`
  fragment TokenShort on Token {
    id
    symbol
    name
    decimals
    derivedETH
  }
  query getTokenPrices($currencyContracts: [ID!]) {
    bundle(id: "1") {
      ethPrice
    }
    tokens(where: { id_in: $currencyContracts }) {
      ...TokenShort
    }
  }
`},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.DEFAULT_NETWORK_TIMEOUTS_MS=void 0,exports.DEFAULT_NETWORK_TIMEOUTS_MS={Zora:2e3,Graph:5e3,IPFS:1e4,OpenSea:8e3,ZoraIndexer:2e3,Rpc:1e3}},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.KNOWN_CONTRACTS=void 0,function(KNOWN_CONTRACTS){KNOWN_CONTRACTS.ZORA="zora"}(exports.KNOWN_CONTRACTS||(exports.KNOWN_CONTRACTS={}))},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TOKENS_WITHOUT_AUCTIONS=exports.ACTIVE_AUCTIONS_QUERY=exports.BY_IDS=exports.BY_OWNER=void 0;const graphql_request_1=__webpack_require__(257),MEDIA_FRAGMENTS=graphql_request_1.gql`
  fragment IndexerTokenPart on Token {
    id
    tokenId
    owner
    address
    tokenContract {
      name
      symbol
      address
      supportsMetadata
    }
    tokenURI
    minter
    metadata {
      json
    }
    mintTransferEvent {
      transactionHash
      blockTimestamp
      blockNumber
    }
    media {
      contentURI
      contentHash
      metadataHash
      metadataURI
      ownerBidShare
      creatorBidShare
    }
  }
  fragment IndexerAuctionPart on Auction {
    winner
    lastBidAmount
    duration
    tokenId
    auctionId
    tokenContract
    reservePrice
    firstBidTime
    expiresAt
    tokenOwner
    curator
    curatorFee
    curatorFeePercentage
    canceledEvent {
      id
    }
    endedEvent {
      id
    }
    bidEvents {
      id
      value
      sender
      transactionHash
    }
  }
  fragment IndexerAuctionWithToken on Auction {
    ...IndexerAuctionPart
    token {
      ...IndexerTokenPart
    }
  }
`,BASE_FRAGMENTS=graphql_request_1.gql`
  ${MEDIA_FRAGMENTS}
  fragment IndexerTokenWithAuction on Token {
    ...IndexerTokenPart
    auctions(where: { _and: [{ _not: { canceledEvent: {} } }] }) {
      ...IndexerAuctionPart
    }
  }
`;exports.BY_OWNER=graphql_request_1.gql`
  ${BASE_FRAGMENTS}
  query byOwner(
    $addressQueryPart: String_comparison_exp!
    $owner: String
    $offset: Int
    $limit: Int
  ) @cached {
    Token(
      limit: $limit
      offset: $offset
      where: {
        address: $addressQueryPart
        _or: [
          { owner: { _eq: $owner } }
          {
            auctions: {
              _and: [
                { _not: { endedEvent: {} } }
                { _not: { canceledEvent: {} } }
                { tokenOwner: { _eq: $owner } }
              ]
            }
          }
        ]
      }
    ) {
      ...IndexerTokenWithAuction
    }
  }
`,exports.BY_IDS=graphql_request_1.gql`
  ${BASE_FRAGMENTS}
  query byIds($ids: [String!]) @cached {
    Token(where: { id: { _in: $ids } }) {
      ...IndexerTokenWithAuction
    }
  }
`,exports.ACTIVE_AUCTIONS_QUERY=graphql_request_1.gql`
  ${BASE_FRAGMENTS}
  query activeAuctionsQuery($andQuery: [Token_bool_exp!], $limit: Int, $offset: Int)
  @cached {
    Token(
      where: { _and: $andQuery }
      order_by: [
        { auctions_aggregate: { max: { lastBidAmount: asc_nulls_last } } }
        { auctions_aggregate: { count: desc } }
        { tokenId: asc }
      ]
      limit: $limit
      offset: $offset
    ) {
      ...IndexerTokenWithAuction
    }
  }
`,exports.TOKENS_WITHOUT_AUCTIONS=graphql_request_1.gql`
  ${MEDIA_FRAGMENTS}
  query tokensWithoutAuctions($addresses: [String!], $limit: Int, $offset: Int) @cached {
    Token(
      where: {
        address: { _in: $addresses }
        _not: { auctions: {} }
        owner: { _neq: "0x0000000000000000000000000000000000000000" }
      }
      limit: $limit
      offset: $offset
    ) {
      ...IndexerTokenPart
    }
  }
//# sourceMappingURL=vendors~main.79339099.iframe.bundle.js.map