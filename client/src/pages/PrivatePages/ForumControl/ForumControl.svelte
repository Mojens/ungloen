<script>
    import { BASE_URL } from "../../../stores/globalsStore.js";
    import { onMount } from "svelte";
    import toastr from "toastr";

    let posts = [];

    async function getAllPosts() {
        const response = await fetch($BASE_URL + "/api/private/forum/", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
            posts = data;
            console.log(posts);
        } else {
            toastr.error(data.message);
        }
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
    <div id="posts-view">
        {#each posts as post}
            <details>
                <summary>#{post.id} <br />{post.title}</summary>
                <h2 class="center">{post.title}</h2>
                <p>
                    {post.content}
                </p>
                <a><i class="fa fa-edit" /></a>
                <a><i class="fa fa-trash" /></a>
            </details>
        {/each}
    </div>
</main>
