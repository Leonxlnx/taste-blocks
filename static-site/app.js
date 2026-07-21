const state = { items: [], query: "", category: "", source: "" };

const catalog = document.querySelector("#catalog");
const status = document.querySelector("#catalog-status");
const query = document.querySelector("#query");
const category = document.querySelector("#category");
const source = document.querySelector("#source");
const dialog = document.querySelector("#component-dialog");
const registryRoot = new URL("./r/", window.location.href);

document.querySelector("#registry-url").textContent = `${registryRoot}{name}.json`;

function titleCase(value) {
  return value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function option(value) {
  const element = document.createElement("option");
  element.value = value;
  element.textContent = titleCase(value);
  return element;
}

function componentCard(item) {
  const button = document.createElement("button");
  button.className = "component-card";
  button.type = "button";

  const heading = document.createElement("h3");
  heading.textContent = item.title;
  const description = document.createElement("p");
  description.textContent = item.description;
  const meta = document.createElement("span");
  meta.textContent = `${item.source.project} · ${titleCase(item.category)}`;

  button.append(heading, description, meta);
  button.addEventListener("click", () => openComponent(item));
  return button;
}

function filteredItems() {
  const needle = state.query.trim().toLowerCase();
  return state.items.filter((item) => {
    if (state.category && item.category !== state.category) return false;
    if (state.source && item.source.project !== state.source) return false;
    if (!needle) return true;
    return [item.title, item.name, item.description, item.category, item.renderer, item.source.project]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
}

function render() {
  const matches = filteredItems();
  catalog.replaceChildren();
  status.textContent = `${matches.length} of ${state.items.length} verified components`;

  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No matching components.";
    catalog.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  matches.forEach((item) => fragment.append(componentCard(item)));
  catalog.append(fragment);
}

function openComponent(item) {
  const jsonUrl = new URL(`${item.name}.json`, registryRoot).href;
  const command = `npx shadcn@latest add ${jsonUrl}`;
  document.querySelector("#dialog-meta").textContent = `${item.source.project} · ${item.license.spdx} · ${titleCase(item.category)}`;
  document.querySelector("#dialog-title").textContent = item.title;
  document.querySelector("#dialog-description").textContent = item.description;
  document.querySelector("#dialog-command").textContent = command;
  document.querySelector("#dialog-json").href = jsonUrl;
  document.querySelector("#dialog-source").href = item.source.repository;
  document.querySelector("#copy-command").dataset.command = command;
  dialog.showModal();
}

query.addEventListener("input", (event) => { state.query = event.currentTarget.value; render(); });
category.addEventListener("change", (event) => { state.category = event.currentTarget.value; render(); });
source.addEventListener("change", (event) => { state.source = event.currentTarget.value; render(); });
document.querySelector("#filters").addEventListener("submit", (event) => event.preventDefault());
document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
document.querySelector("#copy-command").addEventListener("click", async (event) => {
  await navigator.clipboard.writeText(event.currentTarget.dataset.command);
  event.currentTarget.textContent = "Copied";
  window.setTimeout(() => { event.currentTarget.textContent = "Copy"; }, 1200);
});

fetch("./catalog.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
    return response.json();
  })
  .then((items) => {
    state.items = items;
    [...new Set(items.map((item) => item.category))].sort().forEach((value) => category.append(option(value)));
    [...new Set(items.map((item) => item.source.project))].sort().forEach((value) => source.append(option(value)));
    render();
  })
  .catch(() => {
    status.textContent = "The catalog could not be loaded.";
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Open the GitHub repository to inspect the registry source.";
    catalog.replaceChildren(empty);
  });
