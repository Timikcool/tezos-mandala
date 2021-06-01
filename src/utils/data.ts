import { reduce } from "lodash";
import selectObjectByKeys from "./selectObjectByKeys";

export const processMandalas = (tokens, old = false) => {

    const totalMandalas = reduce(tokens,(acc, token, id) => {
        //   const id = selectObjectByKeys(token, {type:'nat', name:'key'})
        if (id === "0") return acc;

        const name = token[0];
        const canBeRenamedAt = token[1];
        const nextRenameAt = token[2];
        const ownerAddress = token[3];
        const rarity = token[4];
        const imageString = token[5];
        const version = token[6];
        return [
          ...acc,
          { id, timestamp:id, canBeRenamedAt, nextRenameAt, rarity, ownerAddress, name, imageString, version, old },
        ];
      }, []);

      return totalMandalas;
}