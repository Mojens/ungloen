<script>
    import { onMount } from "svelte";
    import { BASE_URL } from "../../stores/globalsStore.js";
    import toastr from "toastr";

    let subject = "";
    let publishedPosts = [];
    async function getPublishedPosts() {
        const response = await fetch($BASE_URL + "/api/forum");
        const data = await response.json();
        if (response.status === 200) {
            publishedPosts = data;
        } else {
            toastr.error(data.message);
        }
    }
    async function orderPostBySubject() {
        if (subject === "") {
            return getPublishedPosts();
        }
        console.log(subject);
        const response = await fetch(
            $BASE_URL + "/api/forum/subject/" + subject
        );
        const data = await response.json();
        if (response.status === 200) {
            publishedPosts = data;
        } else {
            publishedPosts = [];
            toastr.error(data.message);
        }
    }

    onMount(() => {
        getPublishedPosts();
    });
</script>

<main class="container">
    <hgroup>
        <h1 class="title-contact">Velkommen til vores forum</h1>
        <h3>Her kan du se alle de indlæg der er blevet oprettet af brugere.</h3>
    </hgroup>
    <div id="filter">
        <h2 class="down-m">Find det emne du ønsker</h2>
        <label for="subject">Emne</label>
        <select
            bind:value={subject}
            on:change={orderPostBySubject}
            id="subject"
        >
            <option value="">Alle</option>
            <option value="Årsopgørelse">Årsopgørelse</option>
            <option value="Skat">Skat</option>
            <option value="Aktier">Aktier</option>
            <option value="Arv">Arv</option>
            <option value="Løn">Løn</option>
        </select>
    </div>
    <div>
        {#if subject !== ""}
            <h2 class="down-m">Emne: {subject}</h2>
            {#if publishedPosts.length === 0}
                <p>Der er ingen indlæg med dette emne</p>
            {/if}
        {:else}
            <h2 class="down-m">Alle emner</h2>
        {/if}
        <div>
            <ul class="post-list">
                {#each publishedPosts as post}
                    <li class="post-item">
                        <p class="date">Skrevet: <b>{post.date}</b></p>
                        <h2 class="down-m">{post.title}</h2>
                        <p class="content">{post.content}</p>
                        <p class="author">Oprettet af {post.author}</p>
                        {#if post.comments}
                            <details class="down-m">
                                <summary role="button">Se Kommentar</summary>
                                <ul class="post-list">
                                    {#each post.comments as comment}
                                     <li class="post-item">
                                        <p class="date">Skrevet: <b>{comment.date}</b></p>
                                        <p class="content">{comment.content}</p>
                                        <p class="author">Kommentaret af: {comment.author}</p>
                                     </li>
                                    {/each}
                                </ul>
                            </details>
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</main>

<style>
    .post-list {
        list-style: none;
        padding: 0;
    }

    .post-item {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        list-style: none;
        padding: 3%;
    }

    .post-item h2 {
        margin-top: 0;
    }
    .author {
        font-style: italic;
        margin-top: 5px;
        font-size: small;
        float: right;
    }
    .date {
        font-style: italic;
        margin-top: 5px;
        font-size: small;
        float: right;
    }
</style>
