import { analyze } from "./analyzer";
import generateFront from "./generateFront";


const analysis = analyze(__dirname + "/demo/api.ts");

generateFront(__dirname + "/../output", analysis);

