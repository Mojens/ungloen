<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { onMount } from "svelte";
    import { BASE_URL } from "../../stores/globalsStore.js";
    import toastr from "toastr";

    let comment = "";
    let subject = "";
    let publishedPosts = [];
    let userPostLikes = [];
    let userCommentLikes = [];

    async function addComment(postId) {
        const response = await fetch($BASE_URL + "/api/comments/forum", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment: comment,
                post_id: postId,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            getPublishedPosts();
        } else if (response.status === 401) {
            toastr.error(data.message);
            const from =
                ($location.state && $location.state.from) || "/log-ind";
            navigate(from, { replace: true });
        } else {
            toastr.error(data.message);
        }
    }
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
        const response = await fetch(
            $BASE_URL + "/api/subject/forum/" + subject
        );
        const data = await response.json();
        if (response.status === 200) {
            publishedPosts = data;
        } else {
            publishedPosts = [];
            toastr.error(data.message);
        }
    }
    async function getLikedPost() {
        const response = await fetch($BASE_URL + "/api/likes/posts/forum/", {
            credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
            if (data.length === 0) {
                userPostLikes[0] = {
                    id: 0,
                    post_id: 0,
                    user_id: 0,
                };
            } else {
                userPostLikes = data;
            }
        } else {
            userPostLikes = [];
        }
    }
    async function getLikedComments() {
        const response = await fetch($BASE_URL + "/api/likes/comments/forum/", {
            credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
            if (data.length === 0) {
                userCommentLikes[0] = {
                    id: 0,
                    comment_id: 0,
                    user_id: 0,
                };
            } else {
                userCommentLikes = data;
            }
        } else {
            userCommentLikes = [];
        }
    }
    getLikedComments();
    getLikedPost();
    const navigate = useNavigate();
    const location = useLocation();
    async function likePost(post_id) {
        const response = await fetch(
            $BASE_URL + "/api/likes/posts/forum/" + post_id,
            {
                credentials: "include",
                method: "POST",
            }
        );
        const data = await response.json();
        console.log(data);
        if (response.status === 200 || response.status === 201) {
            getLikedPost();
            getPublishedPosts();
        } else if (response.status === 401) {
            toastr.error(data.message);
            const from =
                ($location.state && $location.state.from) || "/log-ind";
            navigate(from, { replace: true });
        } else {
            toastr.error(data.message);
        }
    }
    async function likeComment(post_id) {
        const response = await fetch(
            $BASE_URL + "/api/likes/comments/forum/" + post_id,
            {
                credentials: "include",
                method: "POST",
            }
        );
        const data = await response.json();
        console.log(data);
        if (response.status === 200 || response.status === 201) {
            getLikedComments();
            getPublishedPosts();
        } else if (response.status === 401) {
            toastr.error(data.message);
            const from =
                ($location.state && $location.state.from) || "/log-ind";
            navigate(from, { replace: true });
        } else {
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
            <h2 class="down-m">Alle indlæg om: {subject}</h2>
            {#if publishedPosts.length === 0}
                <p>Der er ingen indlæg med dette emne</p>
            {/if}
        {:else}
            <h2 class="down-m">Alle indlæg</h2>
        {/if}
        <div>
            <ul class="post-list">
                {#each publishedPosts as post}
                    <li class="post-item">
                        <p class="post-id">#{post.id}</p>
                        <p class="date">Skrevet: <b>{post.date}</b></p>
                        <h2 class="down-m">{post.title}</h2>
                        <p class="content">{post.content}</p>
                        <p class="author">Oprettet af {post.author}</p>
                        {#if userPostLikes.length <= 0}
                            <button
                                class="like-button w-25"
                                on:click={() => likePost(post.id)}
                            >
                                <span class="like-icon">&#x2665;</span>
                                <span class="like-count">{post.likes}</span>
                            </button>
                        {:else if userPostLikes.length >= 1}
                            {#if userPostLikes.filter((like) => like.post_id === post.id).length > 0}
                                <button
                                    class="like-button-liked w-25"
                                    on:click={() => likePost(post.id)}
                                >
                                    <span class="like-icon">&#x2665</span>
                                    <span class="like-count-liked"
                                        >{post.likes}</span
                                    >
                                </button>
                            {:else}
                                <button
                                    class="like-button w-25"
                                    on:click={() => likePost(post.id)}
                                >
                                    <span class="like-icon">&#x2665</span>
                                    <span class="like-count">{post.likes}</span>
                                </button>
                            {/if}
                        {/if}
                        <details class="down-m">
                            <!-- svelte-ignore a11y-no-redundant-roles -->
                            <summary role="button">Se Kommentar</summary>
                            {#if post.comments}
                                <h2 class="down-m">Kommentar</h2>
                                <ul class="post-list">
                                    {#each post.comments as comment}
                                        <li class="post-item">
                                            <p class="date">
                                                Skrevet: <b>{comment.date}</b>
                                            </p>
                                            <p class="content">
                                                {comment.content}
                                            </p>
                                            <p class="author">
                                                Kommentaret af: {comment.author}
                                            </p>
                                            {#if userCommentLikes.length <= 0}
                                                <button
                                                    class="like-button w-25"
                                                    on:click={() =>
                                                        likeComment(comment.id)}
                                                >
                                                    <span class="like-icon"
                                                        >♥</span
                                                    >
                                                    <span class="like-count"
                                                        >{comment.likes}</span
                                                    >
                                                </button>
                                            {:else if userCommentLikes.length >= 1}
                                                {#if userCommentLikes.filter((like) => like.comment_id === comment.id).length > 0}
                                                    <button
                                                        class="like-button-liked w-25"
                                                        on:click={() =>
                                                            likeComment(
                                                                comment.id
                                                            )}
                                                    >
                                                        <span class="like-icon"
                                                            >♥</span
                                                        >
                                                        <span
                                                            class="like-count-liked"
                                                            >{comment.likes}</span
                                                        >
                                                    </button>
                                                {:else}
                                                    <button
                                                        class="like-button w-25"
                                                        on:click={() =>
                                                            likeComment(
                                                                comment.id
                                                            )}
                                                    >
                                                        <span class="like-icon"
                                                            >♥</span
                                                        >
                                                        <span class="like-count"
                                                            >{comment.likes}</span
                                                        >
                                                    </button>
                                                {/if}
                                            {/if}
                                        </li>
                                    {/each}
                                </ul>
                            {/if}
                            <form
                                on:submit|preventDefault={() =>
                                    addComment(post.id)}
                            >
                                <label for="comment">Skriv en kommentar</label>
                                <textarea
                                    bind:value={comment}
                                    id="comment"
                                    placeholder="Skriv en kommentar"
                                />
                                <button class="btn btn-primary" type="submit">
                                    Tilføj kommentar
                                </button>
                            </form>
                        </details>
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
    .post-id {
        font-style: italic;
        margin-top: 5px;
        font-size: small;
        float: left;
        margin-bottom: 5px !important;
        padding: 5px;
    }
    .like-button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 10px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        color: #555;
    }
    .like-button::after {
        content: "likes";
        font-size: 10px;
    }
    .like-button-liked {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 10px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        color: #e54343;
        box-shadow: inset 0 0 0 2px #e54343;
    }
    .like-button-liked::after {
        content: "likes";
        font-size: 10px;
    }

    .like-button:hover {
        background-color: #f7f7f7;
        color: #e54343;
        box-shadow: inset 0 0 0 2px #e54343;
    }

    .like-icon {
        margin-right: 5px;
    }

    .like-count {
        display: inline-block;
        background-color: #f7f7f7;
        border-radius: 50%;
        width: 40px;
        height: 20px;
        text-align: center;
        margin-left: 5px;
        font-size: 12px;
        font-weight: bold;
        color: #555;
    }
    .like-count-liked {
        display: inline-block;
        background-color: #f7f7f7;
        border-radius: 50%;
        width: 40px;
        height: 20px;
        text-align: center;
        margin-left: 5px;
        font-size: 12px;
        font-weight: bold;
        color: #e54343;
    }
</style>
