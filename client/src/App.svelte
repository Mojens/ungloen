<script>
    import { Router, Route } from "svelte-navigator";
    import Home from "./pages/Home/Home.svelte";
    import Navbar from "./components/Navbar/Navbar.svelte";
    import Login from "./pages/Login/Login.svelte";
    import Register from "./pages/Register/Register.svelte";
    import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.svelte";
    import ResetPassword from "./pages/ResetPassword/ResetPassword.svelte";
    import PrivateRoute from "./router/PrivateRoute.svelte";
    import Profile from "./pages/PrivatePages/Profile/Profile.svelte";
    import Footer from "./components/Footer/Footer.svelte";
    import About from "./pages/About/About.svelte";
    import Contact from "./pages/Contact/Contact.svelte";
    import Forum from "./pages/Forum/Forum.svelte";
    import ProfilePersonalInfo from "./pages/PrivatePages/ProfilePersonalInfo/ProfilePersonalInfo.svelte";
</script>


<Router>
    <Navbar />
    <Route path="/" component={Home} />
    <Route path="/log-ind" component={Login} />
    <Route path="/opret-bruger" component={Register} />
    <Route path="/glemt-adgangskode" component={ForgotPassword} />
    <Route path="/nulstil-adgangskode/:token" component={ResetPassword} />
    <Route path="/om-os" component={About} />
    <Route path="/kontakt" component={Contact} />
    <Route path="/forum" component={Forum} />
    <PrivateRoute path="/profil" let:location>
        <Profile />
    </PrivateRoute>
    <PrivateRoute path="/profil/personlig" let:location>
        <ProfilePersonalInfo />
    </PrivateRoute>
</Router>
<Footer />
