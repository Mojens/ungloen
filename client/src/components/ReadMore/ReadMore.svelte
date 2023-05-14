<script>
  export let textContent = "";
  export let maxChars = 100;
  export let readMoreLabel = "Læs mere";
  export let readLessLabel = "Læs mindre";
  export let maxWords = null;

  let isClosed = true;

  let getClosedText = () => {
    if (maxWords) {
      let words = textContent.split(" ");
      if (words.length > maxWords) {
        return words.slice(0, maxWords).join(" ") + "...";
      }
    }
    if (textContent.length > maxChars) {
      return textContent.slice(0, maxChars) + "...";
    }
    return textContent;
  };

  let displayText = getClosedText();

  const toggleText = () => {
    isClosed = !isClosed;
    displayText = isClosed ? getClosedText() : textContent;
  };
</script>

{#if textContent.length > maxChars || (maxWords && textContent.split(" ").length > maxWords)}
  <p class="text-content">{displayText}</p>
  <a class="read-more-trigger" on:click|preventDefault={toggleText}>
    {isClosed ? readMoreLabel : readLessLabel}
  </a>
{/if}

{#if !(textContent.length > maxChars || (maxWords && textContent.split(" ").length > maxWords))}
  <p class="text-content">{textContent}</p>
{/if}

<style>
  .text-content {
    display: inline;
  }
  .read-more-trigger {
    cursor: pointer;
    display: inline;
  }
</style>
