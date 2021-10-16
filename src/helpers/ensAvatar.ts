import { $fetch } from "ohmyfetch";
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import { initAlchemyProvider } from "~/services/contracts";
import { isAddress } from "@ethersproject/address";

const erc721Abi = [
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 _tokenId) external view returns (string)",
];

const erc1155Abi = [
  "function balanceOf(address _owner, uint256 _id) view returns (uint256)",
  "function uri(uint256 _id) view returns (string)",
];

const getArImage = async (id: string) => {
  const baseUrl = "https://arweave.net";
  const ownerData = await $fetch(`${baseUrl}/graphql`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      query: `
      {
        transactions(ids: ["${id}"]) {
          edges {
            node {
              id
              owner {
                address
              }
            }
          }
        }
      }
      `,
    }),
  });
  const tx = await $fetch(`${baseUrl}/graphql`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      query: `
      {
        transactions(owners: ["${ownerData.data.transactions.edges[0].node.owner.address}"], tags: { name: "Origin", values: ["${ownerData.data.transactions.edges[0].node.id}"] }, sort: HEIGHT_DESC) {
          edges {
            node {
              id
            }
          }
        }
      }
      `,
    }),
  });
  if (tx.data.transactions.edges.length > 0) {
    return `${baseUrl}/${tx.data.transactions.edges[0].node.id}`;
  } else {
    return `${baseUrl}/${id}`;
  }
};

const getGatewayUrl = (uri: string, tokenId?: string): string => {
  const match = new RegExp(/([a-z]+)(?::\/\/|\/)(.*)/).exec(uri);
  if (!match || match.length < 3) {
    return uri;
  }

  const id = match[2];
  let url = uri;

  switch (match[1]) {
    case "ar": {
      url = `https://arweave.net/${id}`;
      break;
    }
    case "ipfs":
      if (id.includes("ipfs") || id.includes("ipns")) {
        url = `https://gateway.ipfs.io/${id}`;
      } else {
        url = `https://gateway.ipfs.io/ipfs/${id}`;
      }
      break;
    case "ipns":
      if (id.includes("ipfs") || id.includes("ipns")) {
        url = `https://gateway.ipfs.io/${id}`;
      } else {
        url = `https://gateway.ipfs.io/ipns/${id}`;
      }
      break;
    case "http":
    case "https":
      break;
  }
  return tokenId ? url.replaceAll("{id}", tokenId) : url;
};

const getAvatarImageUrl = async (
  uri: string,
  ensOrAddress: string
): Promise<string> => {
  const provider = await initAlchemyProvider();
  let address = "";
  if (isAddress(ensOrAddress)) {
    address = ensOrAddress;
  } else {
    address = await provider.resolveName(ensOrAddress);
  }
  const match = new RegExp(/([a-z]+):\/\/(.*)/).exec(uri);
  const match721 = new RegExp(/eip155:1\/erc721:(\w+)\/(\w+)/).exec(uri);
  const match1155 = new RegExp(/eip155:1\/erc1155:(\w+)\/(\w+)/).exec(uri);

  if (match && match.length === 3) {
    const protocol = match[1];
    const id = match[2];

    switch (protocol) {
      case "ar": {
        return await getArImage(id);
      }
      case "ipfs": {
        return `https://gateway.ipfs.io/ipfs/${id}`;
      }
      case "ipns": {
        return `https://gateway.ipfs.io/ipns/${id}`;
      }
      case "http": {
        return uri;
      }
      case "https": {
        return uri;
      }
      default: {
        return uri;
      }
    }
  } else if (address && match721 && match721.length === 3) {
    const contractId = match721[1].toLowerCase();
    const tokenId = match721[2];
    const normalizedAddress = address.toLowerCase();
    try {
      const erc721Contract = new Contract(contractId, erc721Abi, provider);
      const owner = await erc721Contract.ownerOf(tokenId);
      if (!owner || owner.toLowerCase() !== normalizedAddress) {
        throw new Error("ERC721 token not owned by the address");
      }
      const tokenUri = await erc721Contract.tokenURI(tokenId);
      const imageData = await $fetch(
        getGatewayUrl(tokenUri, BigNumber.from(tokenId).toString())
      );
      return getGatewayUrl(imageData.image);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Error getting the token uri");
      }
    }
  } else if (address && match1155 && match1155.length === 3) {
    const contractId = match1155[1].toLowerCase();
    const tokenId = match1155[2];

    try {
      const erc1155Contract = new Contract(contractId, erc1155Abi, provider);
      const balance = (await erc1155Contract.balanceOf(
        address,
        tokenId
      )) as BigNumber;
      if (balance.isZero()) {
        throw new Error("ERC1155 token not owned by the address");
      }
      const tokenUri = await erc1155Contract.uri(tokenId);
      const imageData = await $fetch(
        getGatewayUrl(tokenUri, BigNumber.from(tokenId).toString())
      );
      return getGatewayUrl(imageData.image);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Error getting the token uri");
      }
    }
  } else {
    return "";
  }
};

export { getAvatarImageUrl };
