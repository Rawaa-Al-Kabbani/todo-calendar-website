async function lists() {
  const response = await fetch("/getListsByUser", {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}
export default lists;
