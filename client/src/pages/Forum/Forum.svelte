<script>
    export let pageTitle;
    document.title = pageTitle;

    import { useNavigate } from "svelte-navigator";
    import { onMount } from "svelte";
    import { BASE_URL, user } from "../../stores/globalsStore.js";
    import { forum_subjects } from "../../stores/taxStore.js";
    import { Confirm } from "svelte-confirm";
    import { startLoading, stopLoading } from "../../util/loadingButton.js";
    import ReadMore from "../../components/ReadMore/ReadMore.svelte";
    import toastr from "toastr";

    let comment = "";
    let subject = "";
    let publishedPosts = [];
    let userPostLikes = [];
    let userCommentLikes = [];

    let titleToEdit = "";
    let contentToEdit = "";
    let is_publishedToEdit = false;
    let subjectToEdit = "";

    let commentToEdit = "";

    let addCommentButtonElement;

    const navigate = useNavigate();

    async function deleteComment(commentId) {
        const response = await fetch(
            `${$BASE_URL}/api/private/forum/comments/${commentId}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            publishedPosts = [];
            await getPublishedPosts();
        } else {
            toastr.error(data.message);
        }
    }

    async function updateComment(commentId) {
        const response = await fetch(
            `${$BASE_URL}/api/private/forum/comments/${commentId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: commentToEdit,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            publishedPosts = [];
            await getPublishedPosts();
        } else {
            toastr.error(data.message);
        }
    }

    async function deletePost(postId) {
        const response = await fetch(
            `${$BASE_URL}/api/private/forum/posts/${postId}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            await getPublishedPosts();
        } else {
            toastr.error(data.message);
        }
    }

    async function updatePost(postId) {
        const response = await fetch(
            `$BASE_URL}/api/private/forum/posts/${postId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: titleToEdit,
                    content: contentToEdit,
                    is_published: is_publishedToEdit,
                    subject: subjectToEdit,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            publishedPosts = [];
            await getPublishedPosts();
        } else {
            toastr.error(data.message);
        }
    }

    async function addComment(postId) {
        startLoading(addCommentButtonElement);

        const response = await fetch(
            `${$BASE_URL}/api/private/forum/comments`,
            {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment: comment,
                    post_id: postId,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            comment = "";
            await getPublishedPosts();
            stopLoading(addCommentButtonElement);
        } else if (response.status === 401) {
            toastr.error(data.message);
            navigate("/log-ind", { replace: true });
            stopLoading(addCommentButtonElement);
        } else {
            toastr.error(data.message);
            stopLoading(addCommentButtonElement);
            comment = "";
        }
    }

    async function getPublishedPosts() {
        const response = await fetch(`${$BASE_URL}/api/forum/posts`);
        const data = await response.json();
        if (response.status === 200) {
            publishedPosts = data;
        } else {
            toastr.error(data.message);
        }
    }

    async function sortPostBySubject() {
        if (subject === "") {
            return getPublishedPosts();
        }
        const response = await fetch(
            `${$BASE_URL}/api/forum/posts/subject/${subject}`
        );
        const data = await response.json();
        if (response.status === 200) {
            publishedPosts = data;
        } else {
            publishedPosts = [];
        }
    }

    async function getLikedPosts() {
        const response = await fetch(
            `${$BASE_URL}/api/private/forum/posts/likes`,
            {
                method: "GET",
                credentials: "include",
            }
        );
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
        const response = await fetch(
            `${$BASE_URL}/api/private/forum/comments/likes`,
            {
                credentials: "include",
            }
        );
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

    async function likePost(post_id) {
        const response = await fetch(
            `${$BASE_URL}/api/private/forum/posts/likes/${post_id}`,
            {
                credentials: "include",
                method: "POST",
            }
        );
        const data = await response.json();
        if (response.status === 200 || response.status === 201) {
            await getLikedPosts();
            await getPublishedPosts();
        } else if (response.status === 401) {
            toastr.error(data.message);
            navigate("/log-ind", { replace: true });
        } else {
            toastr.error(data.message);
        }
    }

    async function likeComment(post_id) {
        const response = await fetch(
            `${$BASE_URL}/api/private/forum/comments/likes/${post_id}`,
            {
                credentials: "include",
                method: "POST",
            }
        );
        const data = await response.json();
        if (response.status === 200 || response.status === 201) {
            await getLikedComments();
            await getPublishedPosts();
        } else if (response.status === 401) {
            toastr.error(data.message);
            navigate("/log-ind", { replace: true });
        } else {
            toastr.error(data.message);
        }
    }

    onMount(async () => {
        await getPublishedPosts();
        await getLikedComments();
        await getLikedPosts();
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
        <select bind:value={subject} on:change={sortPostBySubject} id="subject">
            <option value="">Alle</option>
            {#each $forum_subjects as subject}
                <option value={subject}>{subject}</option>
            {/each}
        </select>
    </div>
    <div id="post">
        {#if subject !== ""}
            <h2 class="down-m">Alle indlæg om: {subject}</h2>
            {#if publishedPosts.length === 0}
                <p>Der er ingen indlæg med dette emne</p>
            {:else}
                <p>
                    Fundet <b>{publishedPosts.length}</b> indlæg om
                    <b>{subject}</b>
                </p>
            {/if}
        {:else}
            <h2 class="down-m">Alle indlæg</h2>
            <p>
                Fundet <b>{publishedPosts.length}</b> indlæg
            </p>
        {/if}
        <div>
            <ul class="post-list">
                {#each publishedPosts as post}
                    <li class="post-item">
                        {#if $user}
                            {#if post.user_id === $user.id}
                                <div
                                    class="admin-controls card-end"
                                    id="admin-control-post-{post.id}"
                                >
                                    <Confirm
                                        confirmTitle="Slet indlæg"
                                        cancelTitle="Fortryd"
                                        let:confirm={confirmThis}
                                    >
                                        <a
                                            class="right-m"
                                            on:click={() =>
                                                confirmThis(
                                                    deletePost,
                                                    post.id
                                                )}><i class="fa fa-trash" /></a
                                        >
                                        <span slot="title">
                                            Er du sikker på, at du vil slette
                                            dette indlæg?
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
                                        <a
                                            href="#"
                                            class="left-m"
                                            on:click={() => {
                                                titleToEdit = post.title;
                                                contentToEdit = post.content;
                                                is_publishedToEdit =
                                                    post.is_published;
                                                subjectToEdit = post.subject;
                                                confirmThis(
                                                    updatePost,
                                                    post.id
                                                );
                                            }}><i class="fa fa-edit" /></a
                                        >
                                        <span slot="title">
                                            Opdater indlæg
                                        </span>
                                        <span slot="description">
                                            <p>
                                                Efter du har opdateret
                                                indlægget, kan du ikke fortryde
                                            </p>
                                            <form>
                                                <label for="title">Titel</label>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    name="title"
                                                    bind:value={titleToEdit}
                                                />
                                                <label for="content"
                                                    >Indhold</label
                                                >
                                                <textarea
                                                    id="content"
                                                    name="content"
                                                    rows="4"
                                                    cols="50"
                                                    bind:value={contentToEdit}
                                                />
                                                <select
                                                    bind:value={subjectToEdit}
                                                    required
                                                    id="subject"
                                                >
                                                    <option value="" disabled
                                                        >Vælg et emne</option
                                                    >
                                                    {#each $forum_subjects as forum_subject}
                                                        <option
                                                            value={forum_subject}
                                                            >{forum_subject}</option
                                                        >
                                                    {/each}
                                                </select>
                                                <fieldset>
                                                    <label
                                                        for="switch"
                                                        class="w-75"
                                                    >
                                                        <input
                                                            class="w-25"
                                                            type="checkbox"
                                                            id="switch"
                                                            name="switch"
                                                            role="switch"
                                                            bind:checked={is_publishedToEdit}
                                                        />
                                                        Offentliggør mit indlæg
                                                    </label>
                                                </fieldset>
                                            </form>
                                        </span>
                                    </Confirm>
                                </div>
                            {/if}
                        {/if}
                        <p class="post-id">#{post.id}</p>
                        <p class="date">Skrevet: <b>{post.date}</b></p>
                        <h2 class="down-m">{post.title}</h2>
                        <p class="content">
                            <ReadMore
                                textContent={post.content}
                                maxChars={175}
                                readMoreLabel="Læs mere"
                                readLessLabel="Læs mindre"
                            />
                        </p>
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
                            <summary role="button">Se Kommentar</summary>
                            {#if post.comments}
                                <h2 class="down-m">Kommentar</h2>
                                <ul class="post-list">
                                    {#each post.comments as comment}
                                        <li class="post-item">
                                            {#if $user}
                                                {#if comment.user_id === $user.id}
                                                    <div
                                                        class="admin-controls card-end"
                                                        id="admin-control-post-{post.id}"
                                                    >
                                                        <Confirm
                                                            confirmTitle="Slet kommentar"
                                                            cancelTitle="Fortryd"
                                                            let:confirm={confirmThis}
                                                        >
                                                            <a
                                                                class="right-m"
                                                                on:click={() =>
                                                                    confirmThis(
                                                                        deleteComment,
                                                                        comment.id
                                                                    )}
                                                                ><i
                                                                    class="fa fa-trash"
                                                                /></a
                                                            >
                                                            <span slot="title">
                                                                Er du sikker på,
                                                                at du vil slette
                                                                denne kommentar?
                                                            </span>
                                                            <span
                                                                slot="description"
                                                            >
                                                                Du kan ikke
                                                                fortryde denne
                                                                handling!
                                                            </span>
                                                        </Confirm>
                                                        |
                                                        <Confirm
                                                            confirmTitle="Opdater"
                                                            cancelTitle="Fortryd"
                                                            let:confirm={confirmThis}
                                                        >
                                                            <a
                                                                class="left-m"
                                                                on:click={() => {
                                                                    commentToEdit =
                                                                        comment.content;
                                                                    confirmThis(
                                                                        updateComment,
                                                                        comment.id
                                                                    );
                                                                }}
                                                                ><i
                                                                    class="fa fa-edit"
                                                                /></a
                                                            >
                                                            <span slot="title">
                                                                Opdater
                                                                Kommentar
                                                            </span>
                                                            <span
                                                                slot="description"
                                                            >
                                                                <p>
                                                                    Efter du har
                                                                    opdateret
                                                                    din
                                                                    kommentar,
                                                                    kan du ikke
                                                                    fortryde
                                                                </p>
                                                                <form>
                                                                    <label
                                                                        for="title"
                                                                        >Kommentar</label
                                                                    >
                                                                    <textarea
                                                                        id="content"
                                                                        name="content"
                                                                        rows="4"
                                                                        cols="50"
                                                                        bind:value={commentToEdit}
                                                                    />
                                                                </form>
                                                            </span>
                                                        </Confirm>
                                                    </div>
                                                {/if}
                                            {/if}
                                            <p class="date">
                                                Kommenterede: <b
                                                    >{comment.date}</b
                                                >
                                            </p>
                                            <p class="content">
                                                <ReadMore
                                                    textContent={comment.content}
                                                    maxChars={140}
                                                    readMoreLabel="Læs mere"
                                                    readLessLabel="Læs mindre"
                                                />
                                            </p>
                                            <p class="author">
                                                Kommenteret af: {comment.author}
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
                                <button bind:this={addCommentButtonElement} type="submit">
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
        padding: 1.5%;
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
