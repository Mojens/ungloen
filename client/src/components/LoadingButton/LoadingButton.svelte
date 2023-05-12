<script>
    export let buttonContent = "";
    export let loadingTime = 0;

    let isLoading = false;
    let isDisabled = "";


    async function loadButton() {
        isLoading = true;
        isDisabled = "secondary";
        setTimeout(() => {
            isDisabled = "";
            isLoading = false;
        }, loadingTime);
    }
</script>

<button
    on:click={loadButton}
    aria-busy={isLoading}
    class={isDisabled}
    type="submit"
>
    {buttonContent}
</button>
