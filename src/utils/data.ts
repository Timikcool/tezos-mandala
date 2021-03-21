import { reduce } from "lodash";
import selectObjectByKeys from "./selectObjectByKeys";

export const processMandalas = (tokens) => {

    const totalMandalas = reduce(tokens,(acc, token, id) => {
        //   const id = selectObjectByKeys(token, {type:'nat', name:'key'})
        if (id === "0") return acc;

        const name = token[0];
        const ownerAddress = token[3];
        const rarity = token[4];
        const imageString = token[5];
        
        return [
          ...acc,
          { id, timestamp:id, rarity, ownerAddress, name, imageString },
        ];
      }, []);

      return totalMandalas;
}