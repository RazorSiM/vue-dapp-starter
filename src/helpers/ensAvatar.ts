import { $fetch } from "ohmyfetch";
const getAvatarImageUrl = async (ensAddress: string) => {
  const ensImageUrl = `https://metadata.ens.domains/mainnet/avatar/${ensAddress}`;
  try {
    await $fetch(ensImageUrl);
    return ensImageUrl;
  } catch (error) {
    console.info("ENS avatar not found");
    return "";
  }
};

export { getAvatarImageUrl };
