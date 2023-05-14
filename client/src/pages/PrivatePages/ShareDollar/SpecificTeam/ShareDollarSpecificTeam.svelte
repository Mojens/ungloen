<!-- svelte-ignore a11y-missing-attribute -->
<script>
    import { useParams } from "svelte-navigator";
    import { onMount } from "svelte";
    import { BASE_URL, user, whoJoinedChat, chatMessages } from "../../../../stores/globalsStore";
    import { Confirm } from "svelte-confirm";
    import io from "socket.io-client";
    import toastr from "toastr";

    let teamId = "";
    const params = useParams();
    teamId = $params.teamId;

    let teamMembers = [];
    let teamCreator = {};
    let teamName = "";
    let isAdmin = false;

    let inviteEmail = "";

    let messageToSend = "";

    let socket = io($BASE_URL);
    socket.on("userJoined", (user) => {
        whoJoinedChat.update((whoJoinedChat) => {
            whoJoinedChat.push(user);
            return whoJoinedChat;
        });
    });

    async function getTeamData() {
        const response = await fetch(
            $BASE_URL + "/api/private/sharedollar/teams/" + teamId,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            teamMembers = data.team.teamMembers;
            teamCreator = data.team.teamCreator;
            teamName = data.team.teamName;
            isAdmin = data.team.isAdmin;
            document.title = teamName;
        } else {
            toastr.error(data.message);
        }
    }
    async function sendMessage() {
        let buttonElement = document.getElementById("send-message-btn");
        buttonElement.setAttribute("aria-busy", "true");
        buttonElement.setAttribute("class", "button w-25 float-right secondary");
        const response = await fetch(
            $BASE_URL +
                "/api/private/sharedollar/teams/" +
                teamId +
                "/messages",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageToSend,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            socket.emit("chatMessage", {
                room: teamId,
                message: messageToSend,
                userId: $user.id,
                name: $user.first_name + " " + $user.last_name,
                date: new Date().toISOString().slice(0, 19).replace("T", " "),
            });
            messageToSend = "";
            buttonElement.removeAttribute("aria-busy");
            buttonElement.setAttribute("class", "button w-25 float-right");

        } else {
            toastr.error(data.message);
        }
    }
    async function getAllMessages() {
        const response = await fetch(
            $BASE_URL +
                "/api/private/sharedollar/teams/" +
                teamId +
                "/messages",
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            chatMessages.update((chatMessages) => {
                chatMessages = data.messages;
                return chatMessages;
            });
        } else {
            toastr.error(data.message);
        }
    }
    async function inviteUser() {}

    onMount(async () => {
        await getAllMessages();
        await getTeamData();
        socket = io($BASE_URL);
        const room = {
            teamId: teamId,
            teamName: teamName,
            user: $user,
        };
        socket.on("connect", () => {
            socket.emit("joinRoom", room);
        });

        socket.on("disconnect", () => {
            socket.emit("leaveRoom", room);
        });
        socket.on("userLeft", (user) => {
            console.log(user);
            toastr.error(
                    user.first_name +
                        " " +
                        user.last_name +
                        "<br/> Er ikke længere med i chatten!"
                );
        });

        socket.on("userJoined", (user) => {
            whoJoinedChat.update((whoJoinedChat) => {
                whoJoinedChat.push(user);
                toastr.success(
                    user.first_name +
                        " " +
                        user.last_name +
                        "<br/> Er nu med i chatten!"
                );
                return whoJoinedChat;
            });
        });
        socket.on("message", (message) => {
            chatMessages.update((chatMessages) => {
                chatMessages.push(message);
                return chatMessages;
            });
        });
    });
</script>

<main class="container">
    <h1 class="center title-contact down-m">{teamName}</h1>
    {#if isAdmin}
        <div class="grid top-m">
            <div>
                <Confirm
                    confirmTitle={"Inviter medlem"}
                    cancelTitle={"Annuller"}
                    let:confirm={confirmThis}
                >
                    <button
                        class="button"
                        on:click={() => confirmThis(inviteUser)}
                    >
                        Inviter medlemmer
                    </button>
                    <span slot="title">
                        <h2 class="center">Inviter en ny medlem!</h2>
                    </span>
                    <span slot="description">
                        <form>
                            <label for="inviteEmail" class="p-24">Email</label>
                            <input
                                type="email"
                                bind:value={inviteEmail}
                                name="inviteEmail"
                                id="inviteEmail"
                                class="input"
                            />
                        </form>
                    </span>
                </Confirm>
            </div>
            <div>
                <button class="button"> Håndter medlemmer </button>
            </div>
        </div>
    {/if}
    <div>
        <article>
            <em data-tooltip="Alle beskeder vil automatisk slettet efter 30 dage"><i class="fa fa-question-circle"></i></em>
            <header class="center p-down-0 down-m p-top-0">
                <h2 class="p-36 down-m">{teamName}</h2>
            </header>
            <div class="chat-box">
                {#if $chatMessages.length === 0}
                    <div class="center">
                        <h5 class="center bold" style="margin-top: 20%;">Der er ingen beskeder endnu</h5>
                    </div>
                {/if}
                {#each $chatMessages as chatMessage}
                    {#if chatMessage.userId === $user.id}
                        <div class="sent">
                            <span class="message-metadata-sent"
                                >{chatMessage.name} | {chatMessage.date}</span
                            >
                            <div>{chatMessage.message}</div>
                        </div>
                    {:else}
                        <div class="received">
                            <span class="message-metadata-received"
                                >{chatMessage.name} | {chatMessage.date}</span
                            >
                            <div>{chatMessage.message}</div>
                        </div>
                    {/if}
                {/each}
            </div>
            <footer class="p-down">
                <div class="chat-input">
                    <form>
                        <textarea
                            class="input chat-message-input"
                            bind:value={messageToSend}
                            name="message"
                            placeholder="Skriv en besked"
                        />
                        <Confirm>
                            <a class="icon-button pointer"
                            data-tooltip="Her kan du anmode dine venner om at betale dig tilbage"
                            data-placement="bottom"
                            >
                                <i class="fa fa-money fa-3x" />
                            </a>
                        </Confirm>
                        <button
                            id="send-message-btn"
                            class="button w-25 float-right"
                            on:click|preventDefault={sendMessage}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </footer>
        </article>
    </div>
</main>

<style>
    .received {
        background-color: #e2e2e2;
        color: black;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 15px 15px 15px 0;
        width: 50%;
    }

    .sent {
        background-color: #4caf50;
        color: white;
        padding: 10px;
        margin-bottom: 10px;
        text-align: right;
        border-radius: 15px 15px 0 15px;
        width: 50%;
        margin-left: auto;
    }

    .message-metadata-sent {
        font-size: 12px;
        color: white;
    }
    .message-metadata-received {
        font-size: 12px;
        color: black;
    }
</style>
