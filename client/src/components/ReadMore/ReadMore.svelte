<script>
  export let textContent = "";
  export let maxChars = 100;
  export let readMoreLabel = "Læs mere";
  export let readLessLabel = "Læs mindre";
  export let maxWords;

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

<p class="text-content">{displayText}</p>
<a class="read-more-trigger" on:click|preventDefault={toggleText}
  >{isClosed ? readMoreLabel : readLessLabel}</a
>

<style>
  .text-content {
    display: inline;
  }
  .read-more-trigger {
    cursor: pointer;
    display: inline;
  }
</style>
