export default function pathToAnchor(path: string[]) {
  return "api-" + path.map(sanitize).join("---");
}

function sanitize(s: string) {
  return s.replace(/[^a-zA-Z0-9]/g, "");
}
