const fs = require("fs");

const FILE = "tasks.json";

function load() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function save(tasks) {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

function add(text) {
  const tasks = load();
  tasks.push({ text, done: false });
  save(tasks);
  console.log(`Added: ${text}`);
}

function list() {
  const tasks = load();
  if (tasks.length === 0) {
    console.log("No tasks yet.");
    return;
  }
  tasks.forEach((task, i) => {
    const mark = task.done ? "x" : " ";
    console.log(`${i + 1}. [${mark}] ${task.text}`);
  });
}

// Turn "2" into position 1 in the array, or return -1 if it is invalid
function getIndex(tasks, value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > tasks.length) {
    console.log("Task number not found. Run 'list' to see numbers.");
    return -1;
  }
  return n - 1;
}

function done(value) {
  const tasks = load();
  const i = getIndex(tasks, value);
  if (i === -1) return;
  tasks[i].done = true;
  save(tasks);
  console.log(`Done: ${tasks[i].text}`);
}

function remove(value) {
  const tasks = load();
  const i = getIndex(tasks, value);
  if (i === -1) return;
  const [removed] = tasks.splice(i, 1);
  save(tasks);
  console.log(`Deleted: ${removed.text}`);
}

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd) {
    console.log('Usage: node todo.js add "task" | list | done N | delete N');
  } else if (cmd === "add" && args.length > 1) {
    add(args.slice(1).join(" "));
  } else if (cmd === "list") {
    list();
  } else if (cmd === "done" && args.length > 1) {
    done(args[1]);
  } else if (cmd === "delete" && args.length > 1) {
    remove(args[1]);
  } else {
    console.log("Unknown command. Try: add, list, done, delete");
  }
}

main();