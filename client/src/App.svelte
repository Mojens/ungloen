<script>
    import { Router, Route } from "svelte-navigator";
    import { isAuthenticated, BASE_URL, user } from "./stores/globalsStore.js";
    import { onMount } from "svelte";
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
    import Tools from "./pages/Tools/Tools.svelte";
    import MonthlyPayment from "./pages/PrivatePages/MonthlyPayment/MonthlyPayment.svelte";
    import HolidayPayment from "./pages/PrivatePages/HolidayPayment/HolidayPayment.svelte";
    import DrivingDeduction from "./pages/PrivatePages/DrivingDeduction/DrivingDeduction.svelte";
    import ForumControl from "./pages/PrivatePages/ForumControl/ForumControl.svelte";
    import ActivateUser from "./pages/ActivateUser/ActivateUser.svelte";
    import SendActivationCode from "./pages/SendActivationCode/SendActivationCode.svelte";
    import ScrollToTop from "./components/ScrollToTop/ScrollToTop.svelte";
    import ShareDollarTeams from "./pages/PrivatePages/ShareDollar/Teams/ShareDollarTeams.svelte";
    import ShareDollarSpecificTeam from "./pages/PrivatePages/ShareDollar/SpecificTeam/ShareDollarSpecificTeam.svelte";
    import AcceptInvitation from "./pages/PrivatePages/ShareDollar/AcceptInvitation/AcceptInvitation.svelte";

    onMount(async () => {
        const response = await fetch(
            $BASE_URL + "/api/private/auth/check-session",
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
            isAuthenticated.set(true);
            user.set(data.user);
        }
        if (!$isAuthenticated) {
            user.set(null);
            
        }
    });
</script>

<Router>
    <Navbar />
    <Route path="/" component={Home} />
    <Route path="/log-ind" component={Login} />
    <Route path="/opret-bruger" component={Register} />
    <Route path="/glemt-adgangskode" component={ForgotPassword} />
    <Route path="/nulstil-adgangskode/:token" component={ResetPassword} />
    <Route path="/aktiver-bruger" component={ActivateUser} />
    <Route path="/send-aktiveringskode" component={SendActivationCode} />
    <Route path="/om-os" component={About} />
    <Route path="/kontakt" component={Contact} />
    <Route path="/forum" component={Forum} />
    <Route path="/tjenester" component={Tools} />
    <PrivateRoute path="/profil" let:location>
        <Profile />
    </PrivateRoute>
    <PrivateRoute path="/profil/personlig" let:location>
        <ProfilePersonalInfo />
    </PrivateRoute>
    <PrivateRoute path="/tjenester/beregn-maanedsloen" let:location>
        <MonthlyPayment />
    </PrivateRoute>
    <PrivateRoute path="/tjenester/beregn-koerselsfradrag" let:location>
        <DrivingDeduction />
    </PrivateRoute>
    <PrivateRoute path="/tjenester/beregn-feriepenge" let:location>
        <HolidayPayment />
    </PrivateRoute>
    <PrivateRoute path="/tjenester/forum" let:location>
        <ForumControl />
    </PrivateRoute>
    <PrivateRoute path="/tjenester/share-dollar" let:location>
        <ShareDollarTeams />
    </PrivateRoute>
    <PrivateRoute path="/tjenester/share-dollar/:teamId" let:location>
        <ShareDollarSpecificTeam />
    </PrivateRoute>
    <PrivateRoute path="/accepter-invitation/:token/:teamId" let:location>
        <AcceptInvitation />
    </PrivateRoute>
</Router>
<ScrollToTop />
<Footer />
