export const formatName = (name) => {
  const firstName = name.replace(/-/g, " ").split(" ")[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1);
};