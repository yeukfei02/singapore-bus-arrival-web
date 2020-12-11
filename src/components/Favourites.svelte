<script>
    import axios from 'axios';
    import { getRootUrl } from '../common/common.js';
    import { onMount } from "svelte";

    import Card, {Content, Actions } from '@smui/card';
    import IconButton from '@smui/icon-button';

    const ROOT_URL = getRootUrl();

    let getFavouritesByInstallationIdResult = null;

    onMount(async () => {
        const result = getFavouritesByInstallationId('');
        console.log('result = ', result);
        getFavouritesByInstallationIdResult = result;
    });

    const getFavouritesByInstallationId = async (installationId) => {
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

    const getBusArrival = async (busStopCode) => {
        let result = null;

        const response = await axios.post(`${ROOT_URL}`, 
            { 
                query: `
                    query busArrival ($busStopCode: String!) {
                        busArrival (busStopCode: $busStopCode) {
                            busStopCode
                            services {
                                busNumber
                                operator
                                nextBus {
                                    estimatedArrival
                                    latitude
                                    longitude
                                    load
                                    feature
                                    type
                                }
                            }
                        }
                    }
                `,
                variables: { busStopCode: busStopCode }
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

    const deleteFavouritesById = async (id, installationId) => {
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

    const handleBusStopCodeClick = (busStopCode) => {
        if (busStopCode) {
            const result = getBusArrival(busStopCode);
            console.log('result = ', result);
        }
    }

    const handleOpenInMapClick = (latitude, longitude) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    }

    const handleDeleteButtonClick = (id, installationId) => {
        const result = deleteFavouritesById(id, installationId);
        console.log('result = ', result);

        if (result) {
            const result = getFavouritesByInstallationId('');
            console.log('result = ', result);
            getFavouritesByInstallationIdResult = result;
        }
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
                {#each data.data.getFavouritesByInstallationId as item, i }
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
</div>