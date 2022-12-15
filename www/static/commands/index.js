axios.get('../logo').then(e => document.querySelector("#logo").src = e.data).catch(e => console.log(e));
axios.get(`${window.location.href}/allcommands`).then(e => {
    const commands = e.data;
    const content = document.querySelector(".content");
    commands.forEach(cmd => {
        const command = document.createElement("a");
        command.setAttribute("id", cmd.name);
        command.href = `${window.location.href}/` + cmd.name;
        command.classList.add("command");
        const nameSpan = document.createElement("span");
        nameSpan.id = "name" + cmd.name;
        nameSpan.innerText = cmd.name;
        const descriptionSpan = document.createElement("span");
        descriptionSpan.id = "description" + cmd.name;
        descriptionSpan.innerText = cmd.description;
        command.appendChild(nameSpan);
        command.appendChild(descriptionSpan);
        const line = document.createElement("span");
        line.classList.add("line");
        content.appendChild(command);
        content.appendChild(line);
    });
}).catch(e => console.log(e));