<script>
    export let pageTitle = "UngLøn | Accepter invitation";
    document.title = pageTitle;

    import { onMount } from "svelte";
    import { BASE_URL, user } from "../../../../stores/globalsStore.js";
    import { useNavigate, useParams } from "svelte-navigator";
    import toastr from "toastr";

    const navigate = useNavigate();
    const params = useParams();
    let token = $params.token;
    let teamId = $params.teamId;

    onMount(async () => {
        const response = await fetch(
            $BASE_URL + "/api/private/sharedollar/teams/join",
            {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    teamId: teamId,
                    email: $user.email,
                    userId: $user.id,
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            navigate(`/tjenester/share-dollar/${teamId}`, { replace: true });
            toastr.success(data.message);
        } else {
            navigate("/tjenester/share-dollar", { replace: true });
            toastr.error(data.message);
        }
    });
</script>
