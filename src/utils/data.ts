import selectObjectByKeys from "./selectObjectByKeys";

export const processMandalas = (tokens, owners, metadata) => {

    const totalMandalas = tokens.reduce((acc, token) => {
        //   const id = selectObjectByKeys(token, {type:'nat', name:'key'})
        const id = token.data.key_string;
        if (id === "0") return acc;

        const timestamp = token.data.timestamp;
        let rarity = selectObjectByKeys(token.data.value, {
          type: "bytes",
          name: "rarity",
        })?.value?.replace(/['"]+/g, "");

        const name = selectObjectByKeys(token.data.value, {
          type: "bytes",
          name: "name",
        })?.value?.replace(/['"]+/g, "");

        if (name === "Seed") rarity = name;

        const hash = token.data.key_hash;
        const owner = owners.find(
          (owner) =>
            selectObjectByKeys(owner.data.key, {
              type: "nat",
              name: "token_id",
            })?.value === id
        );

        const ownerAddress = selectObjectByKeys(owner?.data.key, {
          type: "address",
          name: "owner",
        })?.value;

        let imageString = null;
        const imageUri = selectObjectByKeys(token.data.value, {
          type: "bytes",
          name: "artifactUri",
        })?.value;

        if (imageUri) {
          imageString = metadata.find((meta) =>
            imageUri.includes(meta.data?.key?.value)
          )?.data.value.value;
        }
        return [
          ...acc,
          { id, timestamp, rarity, hash, ownerAddress, name, imageString },
        ];
      }, []);

      return totalMandalas;
}