<!-- svelte-ignore a11y-missing-attribute -->
<script>
    import { Link } from "svelte-navigator";
    import { BASE_URL, user, invitations } from "../../stores/globalsStore.js";
    import toastr from "toastr";
    import { onMount } from "svelte";
    import io from "socket.io-client";

    $: notLoggedNavigationLinks = [
        {
            path: "/tjenester",
            name: "Tjenester",
        },
        {
            path: "/om-os",
            name: "Om os",
        },
        {
            path: "/kontakt",
            name: "Kontakt",
        },
        {
            path: "/forum",
            name: "Forum",
        },
        $user
            ? {
                  path: "/log-ud",
                  name: "log ud",
              }
            : {
                  path: "/log-ind",
                  name: "Log ind",
              },
    ];

    const LoggedNavigationLinks = [
        {
            path: "/profil",
            name: "Profil",
        },
    ];

    const LoggedNavigationLinksDropDown = [
        {
            path: "/tjenester/beregn-maanedsloen",
            name: "Beregn måneds løn",
        },
        {
            path: "/tjenester/beregn-koerselsfradrag",
            name: "Beregn kørselsfradrag",
        },
        {
            path: "/tjenester/beregn-feriepenge",
            name: "Beregn feriepenge",
        },
        {
            path: "/tjenester/forum",
            name: "Personlige indlæg",
        },
        {
            path: "/tjenester/share-dollar",
            name: "Share Dollar",
        },
    ];

    async function handleLogout() {
        const response = await fetch($BASE_URL + "/api/auth/logout", {
            credentials: "include",
            method: "POST",
        });
        const data = await response.json();
        if (response.status === 200) {
            toastr.error(data.message);
            localStorage.removeItem("user");
            user.set(null);
        } else {
            toastr.error(data.message);
        }
    }

    async function deleteInvite(id) {
        const response = await fetch(
            $BASE_URL + "/api/private/sharedollar/teams/invite/" + id,
            {
                credentials: "include",
                method: "DELETE",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.error(data.message);
            $invitations = $invitations.filter((invite) => invite.id !== id);
        } else {
            toastr.error(data.message);
        }
    }

    onMount(async () => {
        const response = await fetch(
            $BASE_URL + "/api/private/sharedollar/teams/invite",
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            $invitations = data.invitations;
        }
        if ($user) {
            let socket = io($BASE_URL);
            socket.on("invitesRecieved", (data) => {
                if ($user.id === data.inviteTo.id) {
                    invitations.update((invitations) => {
                        invitations.push(data);
                        return invitations;
                    });
                }
            });
        }
    });
</script>

<nav>
    <ul>
        <li>
            <Link to="/">
                <h1>💰 UngLøn</h1>
            </Link>
        </li>
    </ul>
    <ul>
        {#if $user}
            <li>
                <details class="inline-block" role="list" dir="rtl">
                    <summary
                        class="inline-block"
                        aria-haspopup="listbox"
                        role="link"
                    >
                        <i class="fa fa-bell inline-block center" />
                        {#if $invitations.length > 0}
                            <span class="notification-bubble"
                                >{$invitations.length}</span
                            >
                        {/if}
                    </summary>
                    <ul role="listbox">
                        <h2 class="title-in-noti">Invitationer</h2>
                        {#if $invitations.length === 0}
                            <li>
                                <p class="no-invitation">Ingen invitationer</p>
                            </li>
                        {:else}
                            {#each $invitations as invitation}
                                <li class="down-m">
                                    <div class="icon-container">
                                        <a
                                            class="icon-in-list"
                                            href="/accepter-invitation/{invitation.token}/{invitation
                                                .invitedFrom.id}"
                                        >
                                            <i class="fa fa-check" />
                                        </a>
                                        <a
                                            class="icon-in-list pointer"
                                            on:click={() =>
                                                deleteInvite(invitation.id)}
                                        >
                                            <i class="fa fa-trash" />
                                        </a>
                                        <p class="m-d-0 flex-auto">
                                            {invitation.invitedFrom.team_name}
                                        </p>
                                    </div>
                                </li>
                            {/each}
                        {/if}
                    </ul>
                </details>
            </li>
            {#each LoggedNavigationLinks as link}
                {#if link.name === "log ud"}
                    <li>
                        <button
                            class="btn btn-secondary"
                            on:click={handleLogout}
                        >
                            {link.name}
                        </button>
                    </li>
                {:else}
                    <li>
                        <a href={link.path}>{link.name}</a>
                    </li>
                {/if}
            {/each}
            <li>
                <details role="list" dir="rtl">
                    <summary aria-haspopup="listbox" role="link"
                        >Tjenester</summary
                    >
                    <ul role="listbox">
                        {#each LoggedNavigationLinksDropDown as link}
                            {#if link}
                                <li>
                                    <a href={link.path}>{link.name}</a>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                </details>
            </li>
        {/if}
    </ul>
    <ul>
        {#each notLoggedNavigationLinks as link}
            {#if link.name === "log ud"}
                <li>
                    <button class="btn btn-secondary" on:click={handleLogout}>
                        {link.name}
                    </button>
                </li>
            {:else if link.name === "Log ind"}
                <li>
                    <Link to={link.path}>
                        <button class="btn btn-secondary">
                            {link.name}
                        </button>
                    </Link>
                </li>
            {:else}
                <li>
                    <Link to={link.path}>{link.name}</Link>
                </li>
            {/if}
        {/each}
    </ul>
</nav>

<style>
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    ul {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    ul:first-child {
        flex: 1;
    }

    ul:last-child {
        flex: 2;
        margin-right: 0;
    }

    ul:nth-child(2) {
        flex: 2;
    }

    h1 {
        font-size: 1.5rem;
        margin: 0;
    }
    .inline-block summary::after {
        background-image: none;
        display: none;
    }
    .title-in-noti {
        text-align: center;
        font-size: 1.2rem;
        margin-top: 10px;
        margin-left: 10px;
        margin-right: 10px;
        padding-top: 10px;
        padding-left: 10px;
        padding-right: 10px;
        margin-bottom: 3px !important;
        padding-bottom: 3px !important;
    }
    .icon-container {
        display: flex;
        align-items: center;
    }
    .flex-auto {
        flex: auto;
    }
    .notification-bubble {
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 5px 10px;
    font-size: 12px;
    position: absolute;
    top: -20px;
    right: -15px;
}
</style>
