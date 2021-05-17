/** @jsx jsx */
import { jsx } from "@emotion/react";

import { AuctionResultType, useAuctions } from "@zoralabs/nft-hooks";
import { useMediaContext } from "../context/useMediaContext";
import { NFTPreview } from "../nft-preview/NFTPreview";

type AuctionHouseProps = {
  curatorIds: string[];
  approved?: boolean | null;
  onClick?: (
    evt: React.MouseEvent<HTMLElement>,
    result: AuctionResultType
  ) => void;
};

export const AuctionHouseList = ({
  curatorIds,
  approved = null,
  onClick,
}: AuctionHouseProps) => {
  const { auctions, loading, error } = useAuctions(curatorIds, approved);
  const { getStyles } = useMediaContext();

  if (loading || error) {
    return <span>...</span>;
  }

  return (
    <div {...getStyles("auctionHouseList")}>
      {auctions &&
        auctions.map((auction) => (
          <NFTPreview
            id={auction.tokenId}
            onClick={onClick ? (evt) => onClick(evt, auction) : undefined}
          />
        ))}
    </div>
  );
};