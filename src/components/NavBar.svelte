<script>
    import { currentPageStore } from '../store.js';

	const handleNavBarItemClick = (currentPage) => {
        currentPageStore.set(currentPage);
    };
</script>

<style>
	.navBarCustomStyle {
		background-color: lightpink;
	}
</style>

<div>
    <nav class="navbar navbar-expand-lg navbar-light navBarCustomStyle">
		<div class="container-fluid">
			<span class="navbar-brand mb-0 h1">Singapore Bus Arrival</span>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav">
					<li class="nav-item">
						<div class="nav-link hoverItem" on:click={() => handleNavBarItemClick('nearme')}>NearMe</div>
					</li>
					<li class="nav-item">
						<div class="nav-link hoverItem" on:click={() => handleNavBarItemClick('search')}>Search</div>
					</li>
					<li class="nav-item">
						<div class="nav-link hoverItem" on:click={() => handleNavBarItemClick('favourites')}>Favourites</div>
					</li>
					<li class="nav-item">
						<div class="nav-link hoverItem" on:click={() => handleNavBarItemClick('settings')}>Settings</div>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</div>