<script>
	export let teamMembers = [];
	export let onlineTeamMembers = [];
	export let teamName = "";
	export let teamId;

	import { Confirm } from "svelte-confirm";
	import { afterUpdate } from "svelte";

	let isOnline = [];
	afterUpdate(() => {
       isOnline = []; 
		onlineTeamMembers.forEach((onlineTeamMember) => {
			const memberInfo = onlineTeamMember[0];
			if (memberInfo.teamId == teamId) {
				isOnline.push(memberInfo.user);
			}
		});
	});
</script>

<div class="users-online">
	<Confirm
		confirmTitle={"færdig"}
		cancelTitle={"Luk"}
		let:confirm={confirmThis}
	>
		<button
			class="users-online-button"
			on:click={confirmThis}
		>
			<i class="fa fa-user team-icon" />Se Team medlemmer
		</button>
		<span slot="title">
			<h2 class="center">
				<span class="text-before-title">Medlemmer af: </span>{teamName}
			</h2>
		</span>
		<span slot="description">
			<ul class="user-list">
				{#each teamMembers as teamMember}
					<li class="user-item">
						{#if isOnline.some((user) => user.id == teamMember.id)}
							<span class="user-indicator">🟢</span>
						{:else if !isOnline.some((user) => user.id == teamMember.id)}
							<span class="user-indicator">🔴</span>
						{:else}
							<span class="user-indicator">⚪</span>
						{/if}
						<span class="user-name"
							>{teamMember.first_name + " " + teamMember.last_name}</span
						>
					</li>
				{/each}
			</ul>
		</span>
	</Confirm>
</div>

<style>
	.users-online {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		margin-right: 200px;
		margin-top: 2%;
	}

	.users-online-button {
		width: 15%;
	}

	.user-list {
		list-style-type: none;
		padding: 0;
		background-color: white;
	}

	.user-item {
		margin-bottom: 30px;
		display: flex;
		align-items: center;
		padding: 1%;
	}

	.user-indicator {
		display: inline-block;
		margin-right: 10px;
		font-size: 24px;
	}

	.user-name {
		font-size: 24px;
		text-align: center;
		width: 100%;
	}

	.user-item:hover {
		background-color: lightgray;
	}

	.team-icon {
		margin-right: 10px;
	}

	.text-before-title {
		font-size: small;
		display: contents;
	}
</style>
