export const whitespaceSeparated = (s = "") => {
  const clean = (s || "").trim().replace(/\s+/g, " ");
  return clean ? clean.split(" ") : [];
};
