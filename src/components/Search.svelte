<script>
    import axios from 'axios';
    import { getRootUrl, getUniqueId } from '../common/common.js';

    import Card, {Content, Actions } from '@smui/card';
    import IconButton, { Icon } from '@smui/icon-button';
    import Button, { Label } from '@smui/button';
    import Textfield from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text/index';

    const ROOT_URL = getRootUrl();
    const installationId = getUniqueId();

    let roadName = '';
    let place = '';

    let getBusStopByRoadNameResult = null;
    let getBusStopByDescriptionResult = null;

    const getBusStopByRoadName = async (roadName) => {
        let result = null;

        const response = await axios.post(`${ROOT_URL}`, 
            { 
                query: `
                    query busStopByRoadName ($roadName: String!) {
                        busStopByRoadName (roadName: $roadName) {
                            busStopCode
                            roadName
                            description
                            latitude
                            longitude
                        }
                    }
                `,
                variables: { roadName: roadName }
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

    const getBusStopByDescription = async (place) => {
        let result = null;

        const response = await axios.post(`${ROOT_URL}`, 
            { 
                query: `
                    query busStopByDescription ($description: String!) {
                        busStopByDescription (description: $description) {
                            busStopCode
                            roadName
                            description
                            latitude
                            longitude
                        }
                    }
                `,
                variables: { description: place }
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

    const addFavourites = async (installationId, item) => {
        let result = null;

        const response = await axios.post(`${ROOT_URL}`, 
            { 
                query: `
                    mutation addFavourites ($data: AddFavourites!) {
                        addFavourites (data: $data) {
                            status
                        }
                    }
                `,
                variables: {
                    data: {
                        installationId: installationId,
                        item: item
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

    const handleRoadNameInputChange = (e) => {
        if (e.target.value) {
            roadName = e.target.value;
            place = '';
        }
    }

    const handlePlaceInputChange = (e) => {
        if (e.target.value) {
            place = e.target.value;
            roadName = '';
        }
    }

    const handleSumbitButtonClick = () => {
        getBusStopByRoadNameResult = null;
        getBusStopByDescriptionResult = null;        

        console.log('roadName = ', roadName);
        if (roadName && roadName.length > 3) {
            const result = getBusStopByRoadName(roadName);
            console.log('result = ', result);
            getBusStopByRoadNameResult = result;
        }

        console.log('place = ', place);
        if (place && place.length > 3) {
            const result = getBusStopByDescription(place);
            console.log('result = ', result);
            getBusStopByDescriptionResult = result;
        }
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

    const handleAddFavourites = (installationId, item) => {
        const result = addFavourites(installationId, item);
        console.log('result = ', result);
    }
</script>

<style>

</style>

<div class="container">
    <Card>
        <Content>
            <div>
                <Textfield class="w-100" variant="outlined" bind:value={roadName} on:change={handleRoadNameInputChange} label="Roadname" input$aria-controls="helper-text-outlined-a" input$aria-describedby="helper-text-outlined-a" />
                <HelperText id="helper-text-outlined-a">Roadname</HelperText>
            </div>
            <div>
                <Textfield class="w-100" variant="outlined" bind:value={place} on:change={handlePlaceInputChange} label="Place" input$aria-controls="helper-text-outlined-a" input$aria-describedby="helper-text-outlined-a" />
                <HelperText id="helper-text-outlined-a">Place</HelperText>
            </div>
            <Actions>
                <Button class="w-100" on:click={handleSumbitButtonClick} variant="raised"><Label>Submit</Label></Button>
            </Actions>
        </Content>
    </Card>

    {#if getBusStopByRoadNameResult}
        {#await getBusStopByRoadNameResult}
            <div class="container my-4">
                <div class="alert alert-warning" role="alert">
                    Loading...
                </div>
            </div>
        {:then data}
            {#if data.data.busStopByRoadName}
                {#each data.data.busStopByRoadName as item, i }
                    <div class="container my-4">
                        <Card>
                            <Content>
                                <div class="my-2" style="font-size: 1.5em; font-weight: bold;">{item.description}</div>
                                <div class="my-2" style="font-size: 1.2em; font-weight: bold;">{item.roadName}</div>
                                <div class="my-2" style="font-size: 1.2em;">Bus Stop Code: <span class="hoverItem" style="font-size: 1.2em; color: red; text-decoration: underline;" on:click={() => handleBusStopCodeClick(item.busStopCode)}>{item.busStopCode}</span></div>
                                <span class="hoverItem my-2" style="color: blue; text-decoration: underline;" on:click={() => handleOpenInMapClick(item.latitude, item.longitude)}>Open in map</span>
                            </Content>
                            <Actions>
                                <IconButton on:click={() => handleAddFavourites(installationId, item)} toggle aria-label="Add to favorites" title="Add to favorites">
                                    <Icon class="material-icons" on>favorite</Icon>
                                    <Icon class="material-icons">favorite_border</Icon>
                                </IconButton>
                            </Actions>
                        </Card>
                    </div>
                {/each}
            {/if}
        {/await}
    {/if}

    {#if getBusStopByDescriptionResult}
        {#await getBusStopByDescriptionResult}
            <div class="container my-4">
                <div class="alert alert-warning" role="alert">
                    Loading...
                </div>
            </div>
        {:then data}
            {#if data.data.busStopByDescription}
                {#each data.data.busStopByDescription as item, i }
                    <div class="container my-4">
                        <Card>
                            <Content>
                                <div class="my-2" style="font-size: 1.5em; font-weight: bold;">{item.description}</div>
                                <div class="my-2" style="font-size: 1.2em; font-weight: bold;">{item.roadName}</div>
                                <div class="my-2" style="font-size: 1.2em;">Bus Stop Code: <span class="hoverItem" style="font-size: 1.2em; color: red; text-decoration: underline;" on:click={() => handleBusStopCodeClick(item.busStopCode)}>{item.busStopCode}</span></div>
                                <span class="hoverItem my-2" style="color: blue; text-decoration: underline;" on:click={() => handleOpenInMapClick(item.latitude, item.longitude)}>Open in map</span>
                            </Content>
                            <Actions>
                                <IconButton on:click={() => handleAddFavourites(installationId, item)} toggle aria-label="Add to favorites" title="Add to favorites">
                                    <Icon class="material-icons" on>favorite</Icon>
                                    <Icon class="material-icons">favorite_border</Icon>
                                </IconButton>
                            </Actions>
                        </Card>
                    </div>
                {/each}
            {/if}
        {/await}
    {/if}
</div>