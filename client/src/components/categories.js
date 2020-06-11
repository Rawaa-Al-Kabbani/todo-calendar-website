async function categories() {
  const response = await fetch("/getCategories", {
    method: "GET",
    header: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();

  return json;
}

export default categories;
