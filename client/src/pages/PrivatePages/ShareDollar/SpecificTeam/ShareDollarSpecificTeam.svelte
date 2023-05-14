<!-- svelte-ignore a11y-missing-attribute -->
<script>
    import { useParams } from "svelte-navigator";
    import { onMount } from "svelte";
    import { BASE_URL } from "../../../../stores/globalsStore";
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

    let whoJoinedChat = [];

    let socket = io($BASE_URL);
    socket.on("hasJoined", (data) => {
        whoJoinedChat.push(data);
        console.log(whoJoinedChat);
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
    async function inviteUser() {}

    onMount(async () => {
        getTeamData();
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
                    <button on:click={() => confirmThis(inviteUser)}>
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
                            />
                        </form>
                    </span>
                </Confirm>
            </div>
            <div>
                <button> Håndter medlemmer </button>
            </div>
        </div>
    {/if}
    <div>
        <article>
            <header class="center p-down-0">
                <h2 class="p-36 down-m">{teamName}</h2>
            </header>
            <div class="chat-box" />
            <footer class="p-down">
                <div>
                    <form>
                        <input
                            class="inline-block bg-primary chat-message-input"
                            type="text"
                            name="message"
                            placeholder="Skriv en besked"
                        />
                        <Confirm>
                            <a class="left-m">
                                <i class="fa fa-money" />
                            </a>
                        </Confirm>
                        <button class="inline-block w-25 float-right">
                            Send
                        </button>
                    </form>
                </div>
            </footer>
        </article>
    </div>
</main>
