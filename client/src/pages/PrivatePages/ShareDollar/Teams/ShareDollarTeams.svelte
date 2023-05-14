<!-- svelte-ignore a11y-missing-attribute -->
<script>
    document.title = "UngLøn | ShareDollar";
    import { BASE_URL, user } from "../../../../stores/globalsStore.js";
    import { onMount } from "svelte";
    import toastr from "toastr";
    import io from "socket.io-client";
    import { Confirm } from "svelte-confirm";

    let ownedTeams = [];
    let teamsApartOf = [];

    let showForm = false;
    let createButtonContent = "Opret et team";

    let teamName = "";
    let teamNameToEdit = "";

    function toogleForm() {
        showForm = !showForm;
        if (showForm) {
            createButtonContent = "Annuller";
        } else {
            createButtonContent = "Opret et team";
            teamName = "";
        }
    }
    async function createTeam() {
        const response = await fetch(
            $BASE_URL + "/api/private/sharedollar/teams",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ teamName }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success("Team oprettet");
            getTeamsApartOf();
            getOwnedTeams();
            toogleForm();
        } else {
            toastr.error(data.message);
        }
    }
    async function getOwnedTeams() {
        const response = await fetch(
            $BASE_URL + "/api/private/sharedollar/teams/own",
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            ownedTeams = data.teams;
        }
    }
    async function getTeamsApartOf() {
        const response = await fetch(
            $BASE_URL + "/api/private/sharedollar/teams/",
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
            teamsApartOf = data.teams;
        }
    }
    async function updateTeamName(teamId) {
        const response = await fetch(
            $BASE_URL + "/api/private/sharedollar/teams/" + teamId,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ teamName: teamNameToEdit }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            getTeamsApartOf();
            getOwnedTeams();
        } else {
            toastr.error(data.message);
        }
    }
    async function deleteTeam(teamId) {
        const response = await fetch(
            $BASE_URL + "/api/private/sharedollar/teams/delete/" + teamId,
            {
                method: "DELETE",
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            ownedTeams = [];
            teamsApartOf = [];
            getTeamsApartOf();
            getOwnedTeams();
        } else {
            toastr.error(data.message);
        }
    }

    onMount(() => {
        getTeamsApartOf();
        getOwnedTeams();
    });
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact down-m">ShareDollar</h1>
        <h3 class="top-m">
            Her kan du se dine egen teams, og de teams du er en del af. Du kan
            oprette nye teams, inviter andre til dit team, du kan forlade teams,
            og slette teams. I dine teams kan du sætte regnigner op og anmod om
            betalinger fra andre i dit team.
        </h3>
    </hgroup>
    <hr />
    <div class="create-team">
        <button class="create-team-buttton" on:click={toogleForm}>
            {createButtonContent}
        </button>
        <br />
        <br />
        <br />
        {#if showForm}
            <div>
                <form on:submit|preventDefault={createTeam}>
                    <label class="w-100 bold" for="teamName">Team navn </label>
                    <input
                        type="text"
                        bind:value={teamName}
                        placeholder="Team Penge"
                        name="teamName"
                        id="teamName"
                    />
                    <button type="submit">Opret</button>
                </form>
            </div>
        {/if}
    </div>
    <hr />
    <div class="teams-own">
        <hgroup>
            <h2 class="title-contact down-m p-36">Dine teams</h2>
            <h3 class="top-m">Her forneden kan du se de teams du ejer</h3>
        </hgroup>
        <details role="list">
            {#if ownedTeams.length === 0}
                <summary aria-haspopup="listbox" role="button">
                    Du ejer ingen teams
                </summary>
            {:else}
                <summary aria-haspopup="listbox" role="button">
                    Dine teams
                </summary>
                <ul role="listbox">
                    {#each ownedTeams as team}
                        <li>
                            <a>
                                {team.team_name}
                                <Confirm
                                    confirmTitle={"Slet Team"}
                                    cancelTitle={"Fortryd"}
                                    let:confirm={confirmThis}
                                >
                                    <a
                                        class="icon-in-list"
                                        href="#"
                                        on:click={() => {
                                            confirmThis(deleteTeam, team.id);
                                        }}><i class="fa fa-trash" /></a
                                    >
                                    <span slot="title">
                                        Er du sikker på, at du vil slette dette
                                        team?
                                    </span>
                                    <span slot="description">
                                        Du kan ikke fortryde denne handling!
                                    </span>
                                </Confirm>
                                <Confirm
                                    confirmTitle={"Opdater"}
                                    cancelTitle={"Fortryd"}
                                    let:confirm={confirmThis}
                                >
                                    <a
                                        href="#"
                                        class="icon-in-list"
                                        on:click={() => {
                                            teamNameToEdit = team.team_name;
                                            confirmThis(
                                                updateTeamName,
                                                team.id
                                            );
                                        }}
                                    >
                                        <i class="fa fa-edit" /></a
                                    >
                                    <span slot="title">Opdater team navn</span>
                                    <span slot="description">
                                        <p>
                                            Er du sikker på du vil opdatere team
                                            navnet?
                                        </p>
                                        <form style="z-index: 1;">
                                            <label
                                                class="w-100 bold"
                                                for="teamName"
                                            >
                                                Team navn
                                            </label>
                                            <input
                                                type="text"
                                                bind:value={teamNameToEdit}
                                                placeholder="Team Penge"
                                                name="teamName"
                                                id="teamName"
                                            />
                                        </form>
                                    </span>
                                </Confirm>

                                <a
                                    class="icon-in-list"
                                    href="/tjenester/share-dollar/{team.id}"
                                    ><i class="fa fa-arrow-circle-o-right" /></a
                                >
                            </a>
                        </li>
                    {/each}
                </ul>
            {/if}
        </details>
    </div>
    <hr />
    <div class="teams-apart-of">
        <hgroup>
            <h2 class="title-contact down-m p-36">Teams du en del af</h2>
            <h3 class="top-m">
                Her forneden kan du se de teams du er en del af
            </h3>
        </hgroup>
        <details role="list">
            {#if teamsApartOf.length === 0}
                <summary aria-haspopup="listbox" role="button">
                    Du er ikke en del af nogen teams
                </summary>
            {:else}
                <summary aria-haspopup="listbox" role="button">
                    Teams du en del af
                </summary>
                <ul role="listbox">
                    {#each teamsApartOf as team}
                        <li>
                            <a>
                                {team.team_name}
                                <Confirm
                                    confirmTitle={"Slet Team"}
                                    cancelTitle={"Fortryd"}
                                    let:confirm={confirmThis}
                                >
                                    <a
                                        class="icon-in-list"
                                        href="#"
                                        on:click={() => {
                                            confirmThis(deleteTeam, team.id);
                                        }}><i class="fa fa-trash" /></a
                                    >
                                    <span slot="title">
                                        Er du sikker på, at du vil slette dette
                                        team?
                                    </span>
                                    <span slot="description">
                                        Du kan ikke fortryde denne handling!
                                    </span>
                                </Confirm>
                                <Confirm
                                    confirmTitle={"Opdater"}
                                    cancelTitle={"Fortryd"}
                                    let:confirm={confirmThis}
                                >
                                    <a
                                        href="#"
                                        class="icon-in-list"
                                        on:click={() => {
                                            teamNameToEdit = team.team_name;
                                            confirmThis(
                                                updateTeamName,
                                                team.id
                                            );
                                        }}
                                    >
                                        <i class="fa fa-edit" /></a
                                    >
                                    <span slot="title">Opdater team navn</span>
                                    <span slot="description">
                                        <p>
                                            Er du sikker på du vil opdatere team
                                            navnet?
                                        </p>
                                        <form style="z-index: 1;">
                                            <label
                                                class="w-100 bold"
                                                for="teamName"
                                            >
                                                Team navn
                                            </label>
                                            <input
                                                type="text"
                                                bind:value={teamNameToEdit}
                                                placeholder="Team Penge"
                                                name="teamName"
                                                id="teamName"
                                            />
                                        </form>
                                    </span>
                                </Confirm>

                                <a
                                    class="icon-in-list"
                                    href="/tjenester/share-dollar/{team.id}"
                                    ><i class="fa fa-arrow-circle-o-right" /></a
                                >
                            </a>
                        </li>
                    {/each}
                </ul>
            {/if}
        </details>
    </div>
</main>

<style>
    .create-team-buttton {
        width: 250px;
        float: right;
    }
</style>