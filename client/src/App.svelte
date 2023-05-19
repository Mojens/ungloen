<script>
    import { Router, Route } from "svelte-navigator";
    import { user, BASE_URL } from "./stores/globalsStore.js";
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
            `${$BASE_URL}/api/private/auth/check-session`,
            {
                credentials: "include",
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            user.set(data.user);
        } else {
            user.set(null);
        }
    });
</script>

<Router>
    <Navbar />

    <Route path="/">
        <Home pageTitle="UngLøn | Forside" />
    </Route>

    <Route path="/log-ind">
        <Login pageTitle="UngLøn | Log ind" />
    </Route>

    <Route path="/opret-bruger">
        <Register pageTitle="UngLøn | Opret bruger!" />
    </Route>

    <Route path="/glemt-adgangskode">
        <ForgotPassword pageTitle="UngLøn | Glemt adgangskode" />
    </Route>

    <Route path="/nulstil-adgangskode/:token">
        <ResetPassword pageTitle="UngLøn | Nulstil adgangskode" />
    </Route>

    <Route path="/aktiver-bruger">
        <ActivateUser pageTitle="UngLøn | Aktiver din bruger" />
    </Route>

    <Route path="/send-aktiveringskode">
        <SendActivationCode pageTitle="UngLøn | Send aktiveringskode" />
    </Route>

    <Route path="/om-os">
        <About pageTitle="UngLøn | Om os" />
    </Route>

    <Route path="/kontakt">
        <Contact pageTitle="UngLøn | Kontakt os" />
    </Route>

    <Route path="/forum">
        <Forum pageTitle="UngLøn | Forum" />
    </Route>

    <Route path="/tjenester">
        <Tools pageTitle="UngLøn | Tjenester" />
    </Route>

    <PrivateRoute path="/profil" let:location>
        <Profile
            pageTitle="Profil | {$user.first_name + ' ' + $user.last_name}"
        />
    </PrivateRoute>

    <PrivateRoute path="/profil/personlig" let:location>
        <ProfilePersonalInfo pageTitle="UngLøn | Personlige Oplysninger" />
    </PrivateRoute>

    <PrivateRoute path="/tjenester/beregn-maanedsloen" let:location>
        <MonthlyPayment pageTitle="UngLøn | Beregn Månedsløn" />
    </PrivateRoute>

    <PrivateRoute path="/tjenester/beregn-koerselsfradrag" let:location>
        <DrivingDeduction pageTitle="UngLøn | Beregn Kørselsfradrag" />
    </PrivateRoute>

    <PrivateRoute path="/tjenester/beregn-feriepenge" let:location>
        <HolidayPayment pageTitle="UngLøn | Beregn Feriepenge" />
    </PrivateRoute>

    <PrivateRoute path="/tjenester/forum" let:location>
        <ForumControl pageTitle="UngLøn | Dine Indlæg" />
    </PrivateRoute>

    <PrivateRoute path="/tjenester/share-dollar" let:location>
        <ShareDollarTeams pageTitle="Ungløn | ShareDollar" />
    </PrivateRoute>

    <PrivateRoute path="/tjenester/share-dollar/:teamId" let:location>
        <ShareDollarSpecificTeam />
    </PrivateRoute>

    <PrivateRoute path="/accepter-invitation/:token/:teamId" let:location>
        <AcceptInvitation />
    </PrivateRoute>

    <ScrollToTop />

    <Footer />
</Router>
