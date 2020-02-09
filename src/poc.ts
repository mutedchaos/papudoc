import { analyze } from "./analyzer";
import generateFront from "./generateFront";

generateFront(__dirname + "/../output", analyze(__dirname + "/demo/api.ts"));
