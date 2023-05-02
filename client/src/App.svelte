<script>
    import { Router, Route } from "svelte-navigator";
    import Home from "./pages/Home/Home.svelte";
</script>

<Router>
    <Route path="/" component={Home} />
</Router>