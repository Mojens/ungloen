<script>
    export let pageTitle;
    document.title = pageTitle;

    import { BASE_URL } from "../../../stores/globalsStore.js";
    import { forum_subjects } from "../../../stores/taxStore.js";
    import { startLoading, stopLoading } from "../../../util/loadingButton.js";
    import { onMount } from "svelte";
    import { Confirm } from "svelte-confirm";
    import toastr from "toastr";
    import ReadMore from "../../../components/ReadMore/ReadMore.svelte";
	import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb.svelte";

    const breadCrumbs = [
		{
			title: "Tjenester",
			path: "/tjenester",
		},
		{
			title: "Dine indlæg",
			path: ""
		},
        {
            title: "Forum",
            path: "/forum",
        }
	]

    let posts = [];

    let titleToEdit = "";
    let contentToEdit = "";
    let is_publishedToEdit = false;
    let subjectToEdit = "";

    let showForm = false;
    let title = "";
    let content = "";
    let subject = "";
    let is_published = false;

    let submitNewPostButtonElement;
    let newPostFormButtonElement;


    function toggleForm() {
        showForm = !showForm;
        if (showForm) {
            newPostFormButtonElement.innerText = "Anuller";
        } else {
            newPostFormButtonElement.innerText = "Nyt indlæg";
            if (title !== "" || content !== "" || is_published !== false) {
                title = "";
                content = "";
                is_published = false;
            }
        }
    }

    async function getAllPosts() {
        const response = await fetch(`${$BASE_URL}/api/private/forum/posts`, {
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
            await getAllPosts();
        } else {
            toastr.error(data.message);
        }
    }

    async function updatePost(postId) {
        const response = await fetch(
            `${$BASE_URL}/api/private/forum/posts/${postId}`,
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
            await getAllPosts();
        } else {
            toastr.error(data.message);
        }
    }

    async function createPost() {
        startLoading(submitNewPostButtonElement);

        const response = await fetch(`${$BASE_URL}/api/private/forum/posts/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                content: content,
                is_published: is_published,
                subject: subject,
            }),
        });
        const data = await response.json();
        if (response.status === 200) {
            toastr.success(data.message);
            await getAllPosts();
            toggleForm();
            stopLoading(submitNewPostButtonElement);
        } else {
            toastr.error(data.message);
            stopLoading(submitNewPostButtonElement);
        }
    }

    onMount(async () => {
        await getAllPosts();
    });
</script>

<BreadCrumb breadCrumbs={breadCrumbs} />
<main class="container">
    <hgroup>
        <h1 class="title-contact">Dine indlæg</h1>
        <h3>
            Her kan du Oprette, rediger, slette og gør dine indlæg private.
            <br />
            Du kan klikke på en af dine indlæg for at se dine muligheder.
        </h3>
    </hgroup>
    <div id="create-post">
        <div id="create-btn-container" class="card-end">
            <button
                class="w-25"
                bind:this={newPostFormButtonElement}
                on:click={() => toggleForm()}
            >
                Nyt indlæg
            </button>
        </div>
        {#if showForm}
            <form class="new-post-form" on:submit|preventDefault={createPost}>
                <label for="title">Titel</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    min="3"
                    max="50"
                    placeholder="Hvad er Årsopgørelse?"
                    bind:value={title}
                    required
                />
                <label for="email">Indhold</label>
                <textarea
                    id="content"
                    name="content"
                    rows="4"
                    cols="50"
                    placeholder="Årsopgørelse er en opgørelse over din økonomi i det forgangne år. Den viser, hvor meget du har tjent, og hvor meget du har betalt i skat. Du kan se din årsopgørelse på skat.dk."
                    bind:value={content}
                    required
                />

                <label for="subject">Emne</label>
                <select bind:value={subject} required id="subject">
                    <option value="" disabled>Vælg et emne</option>
                    {#each $forum_subjects as forum_subject}
                        <option value={forum_subject}>{forum_subject}</option>
                    {/each}
                </select>
                <fieldset>
                    <label for="switch" class="w-25">
                        <input
                            class="w-25"
                            type="checkbox"
                            id="switch"
                            name="switch"
                            role="switch"
                            bind:checked={is_published}
                        />
                        Offentliggør mit indlæg
                    </label>
                </fieldset>
                <button type="submit" bind:this={submitNewPostButtonElement}>Opret indlæg</button>
            </form>
        {/if}
        <hr />
    </div>

    <div id="posts-view">
        {#each posts as post}
            <details>
                <summary>
                    <p class="post-id">#{post.id}</p>
                    <p class="card-end down-m-0">
                        {#if post.is_published}
                            <span class="published">Offentliggjort</span>
                        {:else}
                            <span class="not-published"
                                >Ikke offentliggjort</span
                            >
                        {/if}
                    </p>
                    <br />
                    <h2 class="down-m top-m">
                        {post.title}
                    </h2>
                </summary>
                <h2 class="center">{post.title}</h2>
                <p>
                    <ReadMore
                        textContent={post.content}
                        maxChars={175}
                        readMoreLabel="Læs mere"
                        readLessLabel="Læs mindre"
                        maxWords={2000}
                    />
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
                            is_publishedToEdit = post.is_published;
                            subjectToEdit = post.subject;
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
                            <select
                                bind:value={subjectToEdit}
                                required
                                id="subject"
                            >
                                <option value="" disabled>Vælg et emne</option>
                                {#each $forum_subjects as forum_subject}
                                    <option value={forum_subject}
                                        >{forum_subject}</option
                                    >
                                {/each}
                            </select>
                            <fieldset>
                                <label for="switch" class="w-75">
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
            </details>
        {/each}
    </div>
</main>

<style>
    .post-id {
        font-style: italic;
        margin-top: 5px;
        font-size: small;
        float: left;
        margin-bottom: 5px !important;
        padding: 5px;
    }
    .published {
        color: green;
        font-style: italic;
        font-size: small;
    }
    .not-published {
        color: red;
        font-style: italic;
        font-size: small;
    }
</style>
