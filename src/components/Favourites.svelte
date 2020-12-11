<script lang="ts">
    import axios from 'axios';
    import { getRootUrl, getUniqueId } from '../common/common';
    import { onMount } from "svelte";
    import { currentPageStore, busStopCodeStore } from '../store';

    import Card, {Content, Actions } from '@smui/card';
    import IconButton from '@smui/icon-button';
    import Snackbar from '@smui/snackbar';
    import Button, { Label } from '@smui/button';

    const ROOT_URL = getRootUrl();

    let getFavouritesByInstallationIdResult = null;

    let snackbar: any;
    let snackbarTitle = '';

    const installationId = getUniqueId();

    onMount(async () => {
        const result = getFavouritesByInstallationId(installationId);
        console.log('result = ', result);
        getFavouritesByInstallationIdResult = result;
    });

    const getFavouritesByInstallationId = async (installationId: string) => {
        let result = null;

        const response = await axios.post(`${ROOT_URL}`, 
            { 
                query: `
                    query getFavouritesByInstallationId ($installationId: String!) {
                        getFavouritesByInstallationId (installationId: $installationId) {
                            id
                            installation_id
                            item {
                                bus_stop_code
                                description
                                latitude
                                longitude
                                road_name
                            }
                            createdAt
                            updatedAt
                        }
                    }
                `,
                variables: { installationId: installationId }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        if (response) {
            result = response.data;
        }

        return result;
    }

    const deleteFavouritesById = async (id: string, installationId: string) => {
        let result = null;

        const response = await axios.post(`${ROOT_URL}`, 
            { 
                query: `
                    mutation deleteFavouritesById ($data: DeleteFavourites!) {
                        deleteFavouritesById (data: $data) {
                            status
                        }
                    }
                `,
                variables: { 
                    data: {
                        id: id, 
                        installationId: installationId
                    }
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        if (response) {
            result = response.data;
        }

        return result;
    }

    const handleBusStopCodeClick = (busStopCode: string) => {
        currentPageStore.set('busArrivalDetails');
        busStopCodeStore.set(busStopCode);
    }

    const handleOpenInMapClick = (latitude: number, longitude: number) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    }

    const handleDeleteButtonClick = (id: string, installationId: string) => {
        const result = deleteFavouritesById(id, installationId);
        console.log('result = ', result);

        if (result) {
            snackbarTitle = 'Delete favourite success!';
            snackbar.open();

            setTimeout(() => {
                const result = getFavouritesByInstallationId(installationId);
                console.log('result = ', result);
                getFavouritesByInstallationIdResult = result;
            }, 1000);
        }
    }

    const handleCloseButtonClick = () => {
        snackbar.close();
    }
</script>

<style>
    
</style>

<div class="container">
    {#if getFavouritesByInstallationIdResult}
        {#await getFavouritesByInstallationIdResult}
            <div class="container my-4">
                <div class="alert alert-warning" role="alert">
                    Loading...
                </div>
            </div>
        {:then data}
            {#if data.data.getFavouritesByInstallationId}
                {#each data.data.getFavouritesByInstallationId as item }
                    <div class="container my-4">
                        <Card>
                            <Content>
                                <div class="d-flex justify-content-end">
                                    <IconButton class="material-icons" title="Delete" on:click={() => handleDeleteButtonClick(item.id, item.installation_id)}>delete</IconButton>
                                </div>
                                <div class="my-2" style="font-size: 1.5em; font-weight: bold;">{item.item.description}</div>
                                <div class="my-2" style="font-size: 1.2em; font-weight: bold;">{item.item.road_name}</div>
                                <div class="my-2" style="font-size: 1.2em;">Bus Stop Code: <span class="hoverItem" style="font-size: 1.2em; color: red; text-decoration: underline;" on:click={() => handleBusStopCodeClick(item.item.bus_stop_code)}>{item.item.bus_stop_code}</span></div>
                                <span class="hoverItem my-2" style="color: blue; text-decoration: underline;" on:click={() => handleOpenInMapClick(item.item.latitude, item.item.longitude)}>Open in map</span>
                            </Content>
                            <Actions>
                                <IconButton class="material-icons" title="Favorite">favorite</IconButton>
                            </Actions>
                        </Card>
                    </div>
                {/each}
            {/if}
        {/await}
    {:else}
        <div class="container">
            <div class="alert alert-secondary" role="alert">
                There is no data
            </div>
        </div>           
    {/if}

    <Snackbar bind:this={snackbar}>
        <Label>{snackbarTitle}</Label>
        <Actions>
            <Button on:click={handleCloseButtonClick}>Close</Button>
        </Actions>
    </Snackbar>
</div>