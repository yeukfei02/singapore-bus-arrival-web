<script lang="ts">
    import { currentPageStore } from '../store';
    import Drawer, { Content, Header, Title, Subtitle } from '@smui/drawer';
	import List, { Item, Text } from '@smui/list';

	let current = 'nearme';
	let drawer: any;
    export let drawerOpen: any;
    
    const handleNavBarItemClick = (currentPage: string) => {
		currentPageStore.set(currentPage);
        current = currentPage;
        drawerOpen = false;
	}
</script>

<style>

</style>

<div>
    {#if drawerOpen}
        <Drawer variant="modal" bind:this={drawer} bind:open={drawerOpen}>
            <Header>
                <Title>Singapore Bus Arrival</Title>
                <Subtitle>Menu</Subtitle>
            </Header>
            <Content>
                <List>
                    <Item href="javascript:void(0)" on:click={() => handleNavBarItemClick('nearme')} activated={current === 'nearme'}>
                        <Text>NearMe</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => handleNavBarItemClick('search')} activated={current === 'search'}>
                        <Text>Search</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => handleNavBarItemClick('favourites')} activated={current === 'favourites'}>
                        <Text>Favourites</Text>
                    </Item>
                    <Item href="javascript:void(0)" on:click={() => handleNavBarItemClick('settings')} activated={current === 'settings'}>
                        <Text>Settings</Text>
                    </Item>
                </List>
            </Content>
        </Drawer>
    {/if}
</div>