<script>

</script>
<main class="container">
    <h1>Hello</h1>
    <div class="grid">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
      <button>Button</button>
<input type="submit">
<form>

    <!-- Grid -->
    <div class="grid">
  
      <!-- Markup example 1: input is inside label -->
      <label for="firstname">
        First name
        <input type="text" id="firstname" name="firstname" placeholder="First name" required>
      </label>
  
      <label for="lastname">
        Last name
        <input type="text" id="lastname" name="lastname" placeholder="Last name" required>
      </label>
  
    </div>
  
    <!-- Markup example 2: input is after label -->
    <label for="email">Email address</label>
    <input type="email" id="email" name="email" placeholder="Email address"  required>
    <small>We'll never share your email with anyone else.</small>
  
    <!-- Button -->
    <button type="submit">Submit</button>
  
  </form>

  <table>
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
        <th scope="col">Heading</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr>
        <th scope="row">1</th>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
      <tr>
        <th scope="row">1</th>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
        <td>Cell</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th scope="col">#</th>
        <td scope="col">Total</td>
        <td scope="col">Total</td>
        <td scope="col">Total</td>
        <td scope="col">Total</td>
        <td scope="col">Total</td>
      </tr>
    </tfoot>
  </table>

  <div class="grid">
    <div>
        <article>
            <header>Header</header>
            Body
            <footer>Footer</footer>
          </article>
    </div>
    <div>
        <article>
            <header>Header</header>
            Body
            <footer>Footer</footer>
          </article>
    </div>
    <div>
        <article>
            <header>Header</header>
            Body
            <footer>Footer</footer>
          </article>
    </div>
  </div>
  <progress></progress>
  <button aria-busy="true">Please wait…</button>
<button aria-busy="true" class="secondary"></button>
<p>Tooltip on a <a href="#" data-tooltip="Tooltip">link</a></p>
<p>Tooltip on <em data-tooltip="Tooltip">inline element</em></p>
<p><button data-tooltip="Tooltip">Tooltip on a button</button></p>
</main>