<script>
    import { Link } from "svelte-navigator";
    import { user } from "../../stores/userStore.js";
    import { BASE_URL } from "../../stores/globalsStore.js";
    import toastr from "toastr";

    $: notLoggedNavigationLinks = [
        {
            path: "/om-os",
            name: "Om os",
        },
        {
            path: "/kontakt",
            name: "Kontakt",
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
    ].filter(Boolean);

    const LoggedNavigationLinks = [
        {
            path: "/profil",
            name: "Profil",
        },
    ];

    const LoggedNavigationLinksDropDown = [
        {
            path: "/beregn-løn",
            name: "Beregn Løn",
        },
    ];

    async function handleLogout() {
        const response = await fetch($BASE_URL + "/api/logout", {
            method: "POST",
        });
        const data = await response.json();
        if (response.status === 200) {
            toastr.error(data.message);
            localStorage.removeItem("user");
            user.set(null);
            $user = null;
        } else {
            toastr.error(data.message);
        }
    }
</script>

<nav>
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
                        <Link to={link.path}>{link.name}</Link>
                    </li>
                {/if}
            {/each}
            <li>
                <details class="navbar-dropdown dropdown-details">
                    <summary aria-haspopup="listbox" class="dropdown-summary"
                        >Værktøjer</summary
                    >
                    <ul role="listbox" class="dropdown-ul">
                        {#each LoggedNavigationLinksDropDown as link}
                            {#if link}
                                <li>
                                    <Link to={link.path}>{link.name}</Link>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                </details>
            </li>
        {/if}
    </ul>
    <ul>
        <li>
            <Link to="/">
                <h1>💰 UngLøn</h1>
            </Link>
        </li>
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
        flex: 1;
        margin-right: 0;
    }

    ul:nth-child(2) {
        flex: 2;
    }

    h1 {
        font-size: 1.5rem;
        margin: 0;
    }
</style>
