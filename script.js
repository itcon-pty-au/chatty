let currentAbortController = null;
let chatHistory = [];

document.addEventListener('DOMContentLoaded', function () {
    chatHistory = [];
    const selectedRole = localStorage.getItem('chatty_role');
    switch (selectedRole) {
        case 'pair-programmer':
            chatHistory = [{ role: "system", content: "Your will always introduce yourself as Chatty! You are an EXPERT PROGRAMMER. You role is to be a helpful pair programmer to the user. The project is as much yours as its the users. You need to be as much helpful as you possibly can. If you are not clear on any part of the question, clarify it. You will provide 'to-the-point' answers and suggestions. Absolutely no hallucination allowed in your responses. Code snippets should have minimal comments and avoid obvious comments. Code snippets should follow proper coding standards and use CAMEL CASING for naming conventions. Follow effective naming for objects. In case of a code snippet response, avoid providing explanations unless asked specifically. Ensure that the code provided is readable, performant, efficient, modular and error free. Keep it simple. During debugging, try to identify the root cause and suggest possible solutions. Let the user figure out the best solution." }];
            break;
        case 'early-learning':
            chatHistory = [{ role: "system", content: "Your will always introduce yourself as Chatty! You are an expert in Early Education. You specialize in handling various situations relating to care, education and play for 0 to 4 year old kids. You are an expert in talking to parents about their child's activities at the center, reporting any incidents and notify them of any events or activities planned for the child. You are located in Victoria, Australia and need to know about the child care rules in the state and country. You are also an expert in first aid related to babies and kids, allergies, anaphalaxis. You are also an expert on dealing and interacting with kids that are in the ADHD spectrum, Autism and other mental disorders. You will need to provide help on planning activities for kids, writing daily reports and all documentation activities pertaining to the education center. When a question is asked, ask any follow up questions to make sure you understand it. Respond in non-complicated english. All responses should be in a kind, understanding and inclusive tone. Be very supportive, motivational and kind. Use expressive smileys when appropriate." }];
            break;
        case 'custom-role':
            customRoleDescription = "Your will always introduce yourself as Chatty! " + localStorage.getItem('chatty_role_description');
            chatHistory = [{ role: "system", content: customRoleDescription }];
            break;
        default:
            chatHistory = [{ role: "system", content: "Your will always introduce yourself as Chatty! Provide helpful answers on any questions from the user. Ask any follow up questions if needed.Once you understand the question, consider yourself as an expert in that area and then answer thew question. Ensure the answers are factual." }];
            break;
    }

    if (window.matchMedia('(hover: hover)').matches) {
        const inputGroup = document.querySelector('.input-group');
        const chatBox = document.querySelector('.chat-box');
        const resizeGrip = document.getElementById('resize-grip');
        let isResizing = false;

        function startResize(e) {
            e.preventDefault();
            isResizing = true;
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', stopResize);
        }

        function handleMouseMove(e) {
            if (!isResizing) return;
            let clientY = e.clientY || e.touches[0].clientY;
            const chatContainerRect = inputGroup.parentNode.getBoundingClientRect();
            const newHeight = chatContainerRect.bottom - clientY;
            const maxHeight = chatContainerRect.height - resizeGrip.offsetHeight;
            if (newHeight >= 65 && newHeight <= maxHeight) {
                inputGroup.style.height = newHeight + 'px';
                chatBox.style.flexGrow = '0';
                chatBox.style.height = `calc(${chatContainerRect.height}px - ${newHeight}px - ${resizeGrip.offsetHeight}px)`;
            }
        }

        function stopResize() {
            isResizing = false;
            chatBox.style.flexGrow = '1';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopResize);
        }

        resizeGrip.addEventListener('mousedown', startResize);
    }
});

document.getElementById('save-api-key-btn').addEventListener('click', function () {
    event.preventDefault();
    const apiKey = document.getElementById('api-key-input').value;
    const selectedRole = document.getElementById('role-select').value;
    let customRoleDescription = document.getElementById('custom-role-description').value;
    //console.log("selectedRole: " + selectedRole);
    if (apiKey.trim() !== '') {
        localStorage.setItem('openai_api_key', apiKey);
        localStorage.setItem('chatty_role', selectedRole);
        localStorage.setItem('chatty_role_description', customRoleDescription);
        document.getElementById('api-key-container').style.display = 'none';
        document.querySelector('.chat-container').style.display = 'flex';
        document.getElementById('costEstimate').style.display = 'block';
        document.getElementById('logout').style.display = 'block';

        switch (selectedRole) {
            case 'pair-programmer':
                chatHistory = [{ role: "system", content: "Your will always introduce yourself as Chatty! You are an EXPERT PROGRAMMER. You role is to be a helpful pair programmer to the user. The project is as much yours as its the users. You need to be as much helpful as you possibly can. If you are not clear on any part of the question, clarify it. You will provide 'to-the-point' answers and suggestions. Absolutely no hallucination allowed in your responses. Code snippets should have minimal comments and avoid obvious comments. Code snippets should follow proper coding standards and use CAMEL CASING for naming conventions. Follow effective naming for objects. In case of a code snippet response, avoid providing explanations unless asked specifically. Ensure that the code provided is readable, performant, efficient, modular and error free. Keep it simple. During debugging, try to identify the root cause and suggest possible solutions. Let the user figure out the best solution." }];
                break;
            case 'early-learning':
                chatHistory = [{ role: "system", content: "Your will always introduce yourself as Chatty! You are an expert in Early Education. You specialize in handling various situations relating to care, education and play for 0 to 4 year old kids. You are an expert in talking to parents about their child's activities at the center, reporting any incidents and notify them of any events or activities planned for the child. You are located in Victoria, Australia and need to know about the child care rules in the state and country. You are also an expert in first aid related to babies and kids, allergies, anaphalaxis. You are also an expert on dealing and interacting with kids that are in the ADHD spectrum, Autism and other mental disorders. You will need to provide help on planning activities for kids, writing daily reports and all documentation activities pertaining to the education center. When a question is asked, ask any follow up questions to make sure you understand it. Respond in non-complicated english. All responses should be in a kind, understanding and inclusive tone. Be very supportive, motivational and kind. Use expressive smileys when appropriate." }];
                break;
            case 'custom-role':
                customRoleDescription = "Your will always introduce yourself as Chatty! " + localStorage.getItem('chatty_role_description');
                chatHistory = [{ role: "system", content: customRoleDescription }];
                break;
            default:
                chatHistory = [{ role: "system", content: "Your will always introduce yourself as Chatty! Provide helpful answers on any questions from the user. Ask any follow up questions if needed.Once you understand the question, consider yourself as an expert in that area and then answer thew question. Ensure the answers are factual." }];
                break;
        }
    } else {
        alert('Please enter a valid API key.');
    }
    //console.log("chatHistory: " + JSON.stringify(chatHistory));

});

document.getElementById('chat-box').addEventListener('contextmenu', function (event) {
    event.preventDefault();
    let targetMessage = event.target.closest('.message');
    if (targetMessage) {
        const targetMessageId = parseInt(targetMessage.getAttribute('data-message-id'), 10);
        const message = chatHistory.find(m => m.id === targetMessageId);
        const customContextMenu = document.getElementById('customContextMenu');
        customContextMenu.style.display = 'block';
        customContextMenu.style.left = `${event.pageX}px`;
        customContextMenu.style.top = `${event.pageY}px`;
        customContextMenu.setAttribute('data-target-message-id', targetMessageId.toString());
        const editMessageOption = document.getElementById('editMsg');
        if (message && message.role === "user") {
            editMessageOption.style.display = 'block';
        } else {
            editMessageOption.style.display = 'none';
        }
    }
});

window.addEventListener('click', function () {
    document.getElementById('customContextMenu').style.display = 'none';
});

document.getElementById('customContextMenu').addEventListener('click', function (event) {
    const targetMessageId = parseInt(this.getAttribute('data-target-message-id'), 10);
    if (targetMessageId) {
        if (event.target.textContent === "Delete") {
            const targetMessageElement = document.querySelector(`.message[data-message-id="${targetMessageId}"]`);
            if (targetMessageElement) {
                targetMessageElement.remove();
            }
            chatHistory = chatHistory.filter(message => message.id !== targetMessageId);
            this.style.display = 'none';
        } else if (event.target.textContent === "Edit") {
            editMessage(targetMessageId);
            this.style.display = 'none';
        }
    }
});

let editingMessageId = null;
function editMessage(targetMessageId) {
    const message = chatHistory.find(message => message.id === targetMessageId);
    if (message) {
        document.getElementById('user-input').value = message.content;
        editingMessageId = targetMessageId;
    }
}

document.getElementById('export-btn').addEventListener('click', function () {
    if (chatHistory.length > 1) {
        const fileName = prompt("Please enter a file name for the export:", "chat-history");
        if (fileName) {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chatHistory));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", fileName + ".json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    } else {
        alert("No chat history to export.");
    }
});

document.getElementById('user-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.getElementById('send-btn').click();
    }
});

document.getElementById('new-chat-btn').addEventListener('click', function (event) {
    if (window.innerWidth <= 768 || event.ctrlKey) {
        clearAndStartNewChat();
        updateCostEstimate();
    } else {
        if (chatHistory.length > 1) {
            const userAgrees = confirm("Do you want to export the current chat before starting a new one? Warning: The current chat cannot be recovered later.");
            if (userAgrees) {
                document.getElementById('export-btn').click();
                setTimeout(clearAndStartNewChat, 1000);
                updateCostEstimate();
            }
        }
    }
});

function clearAndStartNewChat() {
    chatHistory = [];
    const selectedRole = localStorage.getItem('chatty_role');
    switch (selectedRole) {
        case 'pair-programmer':
            chatHistory = [{ role: "system", content: "Your will always introduce yourself as Chatty! You are an EXPERT PROGRAMMER. You role is to be a helpful pair programmer to the user. The project is as much yours as its the users. You need to be as much helpful as you possibly can. If you are not clear on any part of the question, clarify it. You will provide 'to-the-point' answers and suggestions. Absolutely no hallucination allowed in your responses. Code snippets should have minimal comments and avoid obvious comments. Code snippets should follow proper coding standards and use CAMEL CASING for naming conventions. Follow effective naming for objects. In case of a code snippet response, avoid providing explanations unless asked specifically. Ensure that the code provided is readable, performant, efficient, modular and error free. Keep it simple. During debugging, try to identify the root cause and suggest possible solutions. Let the user figure out the best solution." }];
            break;
        case 'early-learning':
            chatHistory = [{ role: "system", content: "Your will always introduce yourself as Chatty! You are an expert in Early Education. You specialize in handling various situations relating to care, education and play for 0 to 4 year old kids. You are an expert in talking to parents about their child's activities at the center, reporting any incidents and notify them of any events or activities planned for the child. You are located in Victoria, Australia and need to know about the child care rules in the state and country. You are also an expert in first aid related to babies and kids, allergies, anaphalaxis. You are also an expert on dealing and interacting with kids that are in the ADHD spectrum, Autism and other mental disorders. You will need to provide help on planning activities for kids, writing daily reports and all documentation activities pertaining to the education center. When a question is asked, ask any follow up questions to make sure you understand it. Respond in non-complicated english. All responses should be in a kind, understanding and inclusive tone. Be very supportive, motivational and kind. Use expressive smileys when appropriate." }];
            break;
        case 'custom-role':
            customRoleDescription = "Your will always introduce yourself as Chatty! " + localStorage.getItem('chatty_role_description');
            chatHistory = [{ role: "system", content: customRoleDescription }];
            break;
        default:
            chatHistory = [{ role: "system", content: "Your will always introduce yourself as Chatty! Provide helpful answers on any questions from the user. Ask any follow up questions if needed.Once you understand the question, consider yourself as an expert in that area and then answer thew question. Ensure the answers are factual." }];
            break;
    }
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    document.getElementById('user-input').value = '';
    sessionTotalCost = 0;
}

document.getElementById('import-btn').addEventListener('click', function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = readerEvent => {
            try {
                const content = JSON.parse(readerEvent.target.result);
                chatHistory = content;
                updateCostEstimate();
                sessionTotalCost = 0;
                updateSessionTotalCostUI();
                renderChatHistory();
            } catch (e) {
                alert("Failed to load the file: " + e.message);
            }
        }
        reader.readAsText(file);
    }
    input.click();
});

function updateSessionTotalCostUI() {
    const chatHistoryContentLength = chatHistory.reduce((total, message) => total + message.content.length, 0);
    const currentInputLength = document.getElementById('user-input').value.length;
    const totalTokens = chatHistoryContentLength + currentInputLength;
    //console.log(totalTokens);
    const nextApiCallCost = ((totalTokens / 1000) * costPerThousandTokens);
    document.getElementById('costEstimate').textContent = `Next API Call: $${nextApiCallCost.toFixed(2)}`;
}

function renderChatHistory() {
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    chatHistory.forEach(message => {
        if (message.role !== "system") {
            appendMessage(message.content, message.role, message.id);
        }
    });
}

document.getElementById('send-btn').addEventListener('click', function () {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput) {
        if (editingMessageId !== null) {
            const messageIndex = chatHistory.findIndex(message => message.id === editingMessageId);
            if (messageIndex !== -1) {
                chatHistory[messageIndex].content = userInput;
                chatHistory.splice(messageIndex + 1);
                renderChatHistory();
                editingMessageId = null;
                fetchResponse(userInput);
            }
        } else {
            const newMessageId = getNextMessageId();
            chatHistory.push({ id: newMessageId, role: "user", content: userInput });
            appendMessage(userInput, 'user', newMessageId);
            fetchResponse(userInput);
        }
        document.getElementById('user-input').value = '';
    }
});

function getNextMessageId() {
    if (chatHistory.length > 0) {
        const maxId = chatHistory.length;
        return maxId;
    } else {
        return 1;
    }
}

let messageIdCounter = 1;

function appendMessage(text, sender, id) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.setAttribute('data-message-id', id);
    let formattedMessage;
    if (sender === 'user') {
        formattedMessage = `<pre>${escapeHTML(text)}</pre>`;
    } else {
        messageDiv.classList.add('bot-message');
        // Use Showdown to convert markdown to HTML, then format code blocks
        const converter = new showdown.Converter();
        let html = converter.makeHtml(text);
        formattedMessage = formatMarkdown(html);
        //console.log(formattedMessage);
    }
    messageDiv.innerHTML = formattedMessage;
    document.getElementById('chat-box').appendChild(messageDiv);
    document.getElementById('user-input').value = '';
}

function formatMarkdown(html) {
    return html.replace(/<pre><code class="([^"]+)">([\s\S]+?)<\/code><\/pre>/gim, (match, lang, code) => {
        let copyButton = `<i class="fa fa-copy copy-code-icon" onclick="copyCodeToClipboard(this)" style="float: right; cursor: pointer;"></i>`;
        let language = lang.split(' ')[1] ? lang.split(' ')[1].replace('language-', '') : lang.replace('language-', '');
        let codeHeader = language ? `<div class="code-header">${language.toUpperCase()} ${copyButton}</div>` : '';
        return `<div class="code-block">${codeHeader}<pre><code class="${lang}">${code}</code></pre></div>`;
    });
}

function escapeHTML(code) {
    return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function copyCodeToClipboard(element) {
    const codeToCopy = element.parentElement.nextElementSibling.querySelector('pre code').innerText;
    navigator.clipboard.writeText(codeToCopy).then(() => {
        element.classList.add('copied');
        setTimeout(() => element.classList.remove('copied'), 1500);
    }).catch(err => {
        console.error('Error copying text to clipboard', err);
        element.classList.add('copy-err');
        setTimeout(() => element.classList.remove('copy-err'), 1500);
    });
}

// function fetchResponse(userMessage) {
//     if (currentAbortController) {
//         currentAbortController.abort();
//     }
//     currentAbortController = new AbortController();

//     const spinner = document.getElementById('spinner');
//     spinner.style.display = 'inline-block';
//     spinner.classList.remove('spinner-error');
//     spinner.title = "Click here to abort this request";
//     spinner.onclick = function () {
//         currentAbortController.abort();
//         spinner.style.display = 'none';
//         //console.log('Request aborted by the user.');
//     };

//     const apiKey = localStorage.getItem('openai_api_key');
//     if (!apiKey) {
//         console.error('API key is missing.');
//         spinner.classList.add('spinner-error');
//         setTimeout(() => spinner.style.display = 'none', 2000);
//         return;
//     }

//     const messagesForAPI = chatHistory.map(({ role, content }) => ({ role, content }));

//     const data = {
//         model: "gpt-4o",
//         messages: messagesForAPI,
//         top_p: 0.1,
//         n: 1
//     };

//     fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${apiKey}`
//         },
//         body: JSON.stringify(data),
//         signal: currentAbortController.signal
//     })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(err => {
//                     const errorMessage = err.error.message || 'Network failure. Please try again.';
//                     throw new Error(errorMessage);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.choices && data.choices.length > 0) {
//                 const botMessage = data.choices[0].message.content.trim();
//                 const messageId = getNextMessageId();
//                 chatHistory.push({ id: messageId, role: "assistant", content: botMessage });
//                 const responseLength = botMessage.length;
//                 const responseCost = ((responseLength / 1000) * costPerThousandTokens);
//                 sessionTotalCost += responseCost;
//                 updateCostEstimate();
//                 //console.log('Updated chatHistory after user message:', chatHistory);
//                 appendMessage(botMessage, 'assistant', messageId);
//             }
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//             displayErrorMessage(error.message);
//         })
//         .finally(() => {
//             spinner.style.display = 'none';
//             currentAbortController = null;
//         });
// }

window.onload = function () {
    const apiKey = localStorage.getItem('openai_api_key');
    if (apiKey) {
        document.getElementById('api-key-container').style.display = 'none';
        document.querySelector('.chat-container').style.display = 'flex';
        document.getElementById('costEstimate').style.display = 'block';
        document.getElementById('logout').style.display = 'block';
    }
};

function displayErrorMessage(message) {
    const errorMessageContainer = document.createElement('div');
    errorMessageContainer.classList.add('error-message');
    errorMessageContainer.textContent = message;

    if (message.includes("API key")) {
        const retryLink = document.createElement('a');
        retryLink.href = "#";
        retryLink.textContent = " Click here to update the API key.";
        retryLink.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('openai_api_key');
            localStorage.removeItem('chatty_role');
            window.location.reload();
        });
        errorMessageContainer.appendChild(retryLink);
    }

    const chatBox = document.getElementById('chat-box');
    chatBox.appendChild(errorMessageContainer);
}

//let sessionTotalCost = 0;
// const costPerThousandTokens = 0.01;
// function updateCostEstimate() {
//     const chatHistoryContentLength = chatHistory.reduce((total, message) => total + message.content.length, 0);
//     const currentInputLength = document.getElementById('user-input').value.length;
//     const totalTokens = chatHistoryContentLength + currentInputLength;
//     //console.log(totalTokens);
//     const nextApiCallCost = ((totalTokens / 1000) * costPerThousandTokens);
//     sessionTotalCost += nextApiCallCost;
//     document.getElementById('costEstimate').textContent = `Next API Call: $${nextApiCallCost.toFixed(2)}, Total: $${sessionTotalCost.toFixed(2)}`;
// }

var logoutElement = document.getElementById('logout');
if (logoutElement) {
    logoutElement.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('openai_api_key');
        localStorage.removeItem('chatty_role');
        localStorage.removeItem('chatty_role_description');
        window.location.reload();
    });
}

let sessionTotalCost = 0;
const costPerMillionTokensRequest = 5 / 1000000;
const costPerMillionTokensResponse = 15 / 1000000;

function updateCostEstimate() {
    const chatHistoryContentLength = chatHistory.reduce((total, message) => total + message.content.length, 0);
    const currentInputLength = document.getElementById('user-input').value.length;
    const totalTokens = chatHistoryContentLength + currentInputLength;
    const nextApiCallCost = ((totalTokens / 1000) * costPerMillionTokensRequest * 1000);
    document.getElementById('costEstimate').textContent = `Next API Call: $${nextApiCallCost.toFixed(2)}, Total: $${sessionTotalCost.toFixed(2)}`;
}

function fetchResponse(userMessage) {
    if (currentAbortController) {
        currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    const spinner = document.getElementById('spinner');
    spinner.style.display = 'inline-block';
    spinner.classList.remove('spinner-error');
    spinner.title = "Click here to abort this request";
    spinner.onclick = function () {
        currentAbortController.abort();
        spinner.style.display = 'none';
    };

    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
        console.error('API key is missing.');
        spinner.classList.add('spinner-error');
        setTimeout(() => spinner.style.display = 'none', 2000);
        return;
    }

    const messagesForAPI = chatHistory.map(({ role, content }) => ({ role, content }));

    const data = {
        model: "gpt-4o",
        messages: messagesForAPI,
        top_p: 0.1,
        n: 1
    };

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data),
        signal: currentAbortController.signal
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    const errorMessage = err.error.message || 'Network failure. Please try again.';
                    throw new Error(errorMessage);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.choices && data.choices.length > 0) {
                const botMessage = data.choices[0].message.content.trim();
                const messageId = getNextMessageId();
                chatHistory.push({ id: messageId, role: "assistant", content: botMessage });
                const responseLength = botMessage.length;
                const responseCost = ((responseLength / 1000) * costPerMillionTokensResponse * 1000);
                sessionTotalCost += responseCost;
                updateCostEstimate();
                appendMessage(botMessage, 'assistant', messageId);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            displayErrorMessage(error.message);
        })
        .finally(() => {
            spinner.style.display = 'none';
            currentAbortController = null;
        });
}
