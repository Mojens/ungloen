<script>
    import { Router, Route } from "svelte-navigator";
    import Home from "./pages/Home/Home.svelte";
    import Navbar from "./components/Navbar/Navbar.svelte";
</script>

<Router>
    <Navbar />
    <Route path="/" component={Home} />
</Router>
