<script>
	import NavBar from "./components/NavBar.svelte";
	import Nearme from './components/Nearme.svelte';
	import Search from './components/Search.svelte';
	import Favourites from './components/Favourites.svelte';
	import Settings from './components/Settings.svelte';

	import { currentPageStore } from './store.js';

	let currentPageValue = 'nearme';
	currentPageStore.subscribe((value) => {
		console.log('value = ', value);
		if (value) {
			currentPageValue = value;
		}
	});
</script>

<style>
	
</style>

<div>
	<NavBar />

	<div style="margin: 2.5em auto; max-width: 50em;">
		{#if currentPageValue === 'nearme'}
			<Nearme />
		{:else if currentPageValue === 'search'}
			<Search />
		{:else if currentPageValue === 'favourites'}
			<Favourites />
		{:else if currentPageValue === 'settings'}
			<Settings />
		{/if}
	</div>
</div>