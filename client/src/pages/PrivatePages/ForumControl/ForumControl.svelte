<script>
    import { BASE_URL } from "../../../stores/globalsStore.js";
    import { onMount } from "svelte";
    import { Confirm } from "svelte-confirm";
    import toastr from "toastr";

    let posts = [];

    let titleToEdit = "";
    let contentToEdit = "";

    async function getAllPosts() {
        const response = await fetch($BASE_URL + "/api/private/forum/", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
            posts = data;
        } else {
            toastr.error(data.message);
        }
    }

    async function deletePost(postId) {
        const response = await fetch($BASE_URL + "/api/forum/" + postId, {
            method: "DELETE",
            credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            getAllPosts();
        } else {
            toastr.error(data.message);
        }
    }

    async function updatePost(postId) {
        console.log(postId);
        console.log(titleToEdit);
        console.log(contentToEdit);
    }

    onMount(() => {
        getAllPosts();
    });
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact">Dine indlæg</h1>
        <h3>Her kan du Oprette, rediger og slette dine indlæg</h3>
    </hgroup>
    <div id="create-post" class="card-end">
        <button class="w-25"> Opret indlæg </button>
    </div>

    <div id="posts-view">
        {#each posts as post}
            <details>
                <summary>#{post.id} <br />{post.title}</summary>
                <h2 class="center">{post.title}</h2>
                <p>
                    {post.content}
                </p>
                <Confirm
                    confirmTitle="Slet indlæg"
                    cancelTitle="Fortryd"
                    let:confirm={confirmThis}
                >
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a
                        class="right-m"
                        on:click={() => confirmThis(deletePost, post.id)}
                        ><i class="fa fa-trash" /></a
                    >
                    <span slot="title">
                        Er du sikker på, at du vil slette dette indlæg?
                    </span>
                    <span slot="description">
                        Du kan ikke fortryde denne handling!
                    </span>
                </Confirm>
                |
                <Confirm
                    confirmTitle="Opdater"
                    cancelTitle="Fortryd"
                    let:confirm={confirmThis}
                >
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a
                        class="left-m"
                        on:click={() => {
                            titleToEdit = post.title;
                            contentToEdit = post.content;
                            confirmThis(updatePost, post.id);
                        }}><i class="fa fa-edit" /></a
                    >
                    <span slot="title"> Opdater indlæg </span>
                    <span slot="description">
                        <p>
                            Efter du har opdateret indlægget, kan du ikke
                            fortryde
                        </p>
                        <form>
                            <label for="title">Titel</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                bind:value={titleToEdit}
                            />
                            <label for="content">Indhold</label>
                            <textarea
                                id="content"
                                name="content"
                                rows="4"
                                cols="50"
                                bind:value={contentToEdit}
                            />
                        </form>
                    </span>
                </Confirm>
            </details>
        {/each}
    </div>
</main>
