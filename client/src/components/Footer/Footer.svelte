<script>
	import toastr from "toastr";
	import { Link } from "svelte-navigator";
	import { BASE_URL } from "../../stores/globalsStore.js";
	import { startLoading, stopLoading } from "../../util/loadingButton.js";

	let email = "";

	let footerContactButtonElement;

	async function handleContact() {
		startLoading(footerContactButtonElement);

		const response = await fetch(`${$BASE_URL}/api/contact/footer`, {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});
		const data = await response.json();
		if (response.status === 200) {
			toastr.success(data.message);
			email = "";
			stopLoading(footerContactButtonElement);
		} else {
			toastr.error(data.message);
			stopLoading(footerContactButtonElement);
		}
	}
</script>

<footer class="footer-top-m">
	<hr />
	<div class="grid">
		<div class="center">
			<a>
				<Link to="/"style="text-decoration: none;">
					<h2>
						<span>💰</span>
						<span>ungløn.dk</span>
					</h2>
				</Link>
			</a>
		</div>
		<div class="center">
			<ul class="footer-links">
				<li><a><Link to="/tjenester">Tjenester</Link></a></li>
				<li><a><Link to="/om-os">Om os</Link></a></li>
				<li><a><Link to="/kontakt">Kontakt</Link></a></li>
				<li><a><Link to="/log-ind">Log ind</Link></a></li>
			</ul>
		</div>
		<div class="center">
			<form on:submit|preventDefault={handleContact}>
				<input
					type="email"
					id="footerMail"
					name="footerMail"
					bind:value={email}
					placeholder="Din email.."
				/>
				<button
					type="submit"
					bind:this={footerContactButtonElement}>Kontakt os</button
				>
			</form>
		</div>
	</div>
	<hr />
	<div class="grid">
		<div class="center">
			<p class="copyright">
				&copy; 2023 Alle rettigheder forbeholdes af <a class="bold-a"
					><Link to="/">ungløn.dk</Link></a
				>
			</p>
		</div>
		<div />
		<div class="center">
			<a><i class="fa fa-facebook" /></a>
			<a><i class="fa fa-instagram" /></a>
			<a><i class="fa fa-twitter" /></a>
			<a
				href="https://github.com/Mojens/ungloen"
				target="_blank"><i class="fa fa-github" /></a
			>
		</div>
	</div>
</footer>

<style>
	.bold-a {
		margin-left: 0 !important;
		padding-left: 0 !important;
		font-weight: bold !important;
	}
	.footer-top-m {
		padding-top: 2rem;
	}
	.center a {
		margin: 0 10px;
	}
	.footer-links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.footer-links li {
		margin: 10px;
		text-align: center;
		flex-basis: 50%;
		list-style: none;
	}

	@media (min-width: 768px) {
		.grid {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
		}
		.footer-links li {
			flex-basis: auto;
			margin: 0;
		}
	}
</style>
