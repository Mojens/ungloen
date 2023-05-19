<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-redundant-roles -->
<script>
    export let pageTitle;
    document.title = pageTitle;

    import { BASE_URL, user } from "../../../../stores/globalsStore.js";
    import { onMount } from "svelte";
    import toastr from "toastr";
    import io from "socket.io-client";
    import { Confirm } from "svelte-confirm";
    import { Link } from "svelte-navigator";

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
            ownedTeams = ownedTeams.filter((team) => team.id !== teamId);
            teamsApartOf = teamsApartOf.filter((team) => team.id !== teamId);
        } else {
            toastr.error(data.message);
        }
    }
    async function leaveTeam(teamId) {
        const response = await fetch(
            $BASE_URL + "/api/private/sharedollar/teams/leave/" + teamId,
            {
                method: "DELETE",
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            teamsApartOf = teamsApartOf.filter((team) => team.id !== teamId);
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
                                        on:click={() => {
                                            confirmThis(deleteTeam, team.id);
                                        }}><i class="fa fa-trash pointer" /></a
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
                                        class="icon-in-list"
                                        on:click={() => {
                                            teamNameToEdit = team.team_name;
                                            confirmThis(
                                                updateTeamName,
                                                team.id
                                            );
                                        }}
                                    >
                                        <i class="fa fa-edit pointer" /></a
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

                                <Link
                                    class="icon-in-list"
                                    to="/tjenester/share-dollar/{team.id}"
                                    ><i class="fa fa-arrow-circle-o-right" /></Link
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
                                {#if !ownedTeams.some((team) => team.team_creator_id === $user.id)}
                                    <Confirm
                                        confirmTitle={"Forlad Team"}
                                        cancelTitle={"Fortryd"}
                                        let:confirm={confirmThis}
                                    >
                                        <a
                                            on:click={() => {
                                                confirmThis(leaveTeam, team.id);
                                            }}
                                            class="icon-in-list"
                                            ><i class="fa fa-user-times" /></a
                                        >
                                        <span slot="title">
                                            Er du sikker på, at du vil forlade
                                            dette team?
                                        </span>
                                        <span slot="description">
                                            Du kan ikke fortryde denne handling! <br
                                            />Du vil ikke længere have adgang
                                            til dette team.
                                            <br />Du skal kontakte team ejeren
                                            for at blive tilføjet igen.
                                        </span>
                                    </Confirm>
                                {/if}
                                <Link
                                    class="icon-in-list"
                                    to="/tjenester/share-dollar/{team.id}"
                                    ><i class="fa fa-arrow-circle-o-right" /></Link
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
