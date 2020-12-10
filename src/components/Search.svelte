<script>
    import axios from 'axios';
    import { getRootUrl } from '../common/common.js';

    const ROOT_URL = getRootUrl();

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
</script>

<style>
    .viewContainer {
        max-width: 65em;
    }

    .descriptionText {
        font-size: 25;
        font-weight: bold;
    }

    .roadNameText {
        font-size: 20;
        font-weight: bold;
    }
    
    .busStopCodeText {
        font-size: 28;
    }

    .busStopCodeResultText {
        font-size: 28;
        color: red;
        text-decoration: underline;
    }

    .openInMapText {
        color: blue;
        text-decoration: underline;
    }
</style>

<div class="container viewContainer">
    <div class="card">
        <div class="card-body">
            <form>
                <div class="mb-3">
                    <label for="roadName" class="form-label">Roadname</label>
                    <input type="text" class="form-control" id="roadName" placeholder="Roadname" bind:value={roadName} on:change={handleRoadNameInputChange}>
                </div>
                <div class="mb-3">
                    <label for="place" class="form-label">Place</label>
                    <input type="text" class="form-control" id="place" placeholder="Place" bind:value={place} on:change={handlePlaceInputChange}>
                </div>
                <button type="button" class="btn btn-primary my-2" on:click={handleSumbitButtonClick}>Submit</button>
            </form>
        </div>
    </div>

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
                        <div class="card">
                            <div class="card-body">
                                <div class="descriptionText my-2">{item.description}</div>
                                <div class="roadNameText my-2">{item.roadName}</div>
                                <div class="busStopCodeText my-2">Bus Stop Code: <span class="busStopCodeResultText hoverItem" on:click={() => handleBusStopCodeClick(item.busStopCode)}>{item.busStopCode}</span></div>
                                <span class="openInMapText hoverItem my-2" on:click={() => handleOpenInMapClick(item.latitude, item.longitude)}>Open in map</span>
                            </div>
                        </div>
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
                        <div class="card">
                            <div class="card-body">
                                <div class="descriptionText my-2">{item.description}</div>
                                <div class="roadNameText my-2">{item.roadName}</div>
                                <div class="busStopCodeText my-2">Bus Stop Code: <span class="busStopCodeResultText hoverItem" on:click={() => handleBusStopCodeClick(item.busStopCode)}>{item.busStopCode}</span></div>
                                <span class="openInMapText hoverItem my-2" on:click={() => handleOpenInMapClick(item.latitude, item.longitude)}>Open in map</span>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        {/await}
    {/if}
</div>