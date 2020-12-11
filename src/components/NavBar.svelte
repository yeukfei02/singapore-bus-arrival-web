<script>
	import { currentPageStore } from '../store.js';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import Drawer from './Drawer.svelte';
	
	let prominent = false;
	let dense = false;
	let secondaryColor = false;

	let drawerOpen = false;

	const handleNavBarItemClick = (currentPage) => {
		currentPageStore.set(currentPage);
	}

	const handleDrawerOpen = () => {
		if (!drawerOpen) {
			drawerOpen = true;
		} else {
			drawerOpen = false;
		}
	}
</script>

<style>
	.flexy {
		display: flex;
		flex-wrap: wrap;
	}
	.top-app-bar-container {
		overflow: auto;
		display: inline-block;
	}
	.flexor {
		display: inline-flex;
		flex-direction: column;
	}
</style>

<div class="flexy">
	<div class="top-app-bar-container flexor">
		<TopAppBar variant="static" {prominent} {dense} color={secondaryColor ? 'secondary' : 'primary'}>
			<Row>
				<Section>
					<IconButton class="material-icons" on:click={handleDrawerOpen}>menu</IconButton>
					<Title>Singapore Bus Arrival</Title>
				</Section>
				<Section align="end" toolbar>
					<IconButton class="material-icons" aria-label="Room" on:click={() => handleNavBarItemClick('nearme')}>room</IconButton>
					<IconButton class="material-icons" aria-label="Search" on:click={() => handleNavBarItemClick('search')}>search</IconButton>
					<IconButton class="material-icons" aria-label="Favorite" on:click={() => handleNavBarItemClick('favourites')}>favorite</IconButton>
					<IconButton class="material-icons" aria-label="Settings" on:click={() => handleNavBarItemClick('settings')}>settings</IconButton>
				</Section>
			</Row>
		</TopAppBar>
	</div>

	<Drawer drawerOpen={drawerOpen}/>
</div>