<script>
    import { Link } from "svelte-navigator";
    import { BASE_URL, user } from "../../stores/globalsStore.js";
    import toastr from "toastr";

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
                <details class="navbar-dropdown dropdown-details">
                    <summary aria-haspopup="listbox" class="dropdown-summary"
                        >Værktøjer</summary
                    >
                    <ul role="listbox" class="dropdown-ul z-index">
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
    .dropdown-ul {
        position: absolute;
        left: 0;
        background-color: white;
        border-radius: 8px;
        display: block;
    }
    .dropdown-summary {
        margin-left: 10px;
    }
    .dropdown-details {
        display: inline-block;
        position: relative;
    }
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
    .z-index {
        z-index: 100;
    }
</style>
