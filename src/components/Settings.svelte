<script lang="ts">
  import Card, { Content } from "@smui/card";
  import IconButton from "@smui/icon-button";
  import Button, { Label } from "@smui/button";

  const handleIosButtonClick = () => {
    window.open(
      `https://apps.apple.com/us/app/singapore-bus-arrival/id1539326353`
    );
  };

  const handleAndroidButtonClick = () => {
    window.open(
      `https://play.google.com/store/apps/details?id=com.donaldwu.singaporebusarrivalapp`
    );
  };

  const handleCurrentMapButtonClick = () => {
    window.open(
      `https://drive.google.com/uc?export=download&id=1hrIwwbgah0FKvWwRdXpvcGEG-AsYr3Yp`
    );
  };

  const handleFutureMapButtonClick = () => {
    window.open(
      `https://drive.google.com/uc?export=download&id=1vZGHSW_5pj5fMOEAhL42f0yCHLS4KaRb`
    );
  };

  const handleEmailButtonClick = () => {
    window.open(`mailto:yeukfei02@gmail.com`);
  };

  const handleGithubButtonClick = () => {
    window.open(`https://github.com/yeukfei02`);
  };
</script>

<div class="container">
  <Card>
    <Content>
      <!-- <h3>Settings</h3> -->

      <div class="my-3">
        <h3>Singapore Bus Arrival App</h3>
        <div class="d-flex flex-row justify-content-around my-4">
          <div>
            <Button
              class="w-100"
              on:click={handleIosButtonClick}
              variant="raised"><Label>IOS</Label></Button
            >
          </div>
          <div>
            <Button
              class="w-100"
              color="secondary"
              on:click={handleAndroidButtonClick}
              variant="raised"><Label>Android</Label></Button
            >
          </div>
        </div>
      </div>

      <div class="my-3">
        <h3>Singapore Mrt Map</h3>
        <div class="d-flex flex-row justify-content-around my-4">
          <div>
            <Button
              class="w-100"
              on:click={handleCurrentMapButtonClick}
              variant="raised"><Label>Current Map</Label></Button
            >
          </div>
          <div>
            <Button
              class="w-100"
              color="secondary"
              on:click={handleFutureMapButtonClick}
              variant="raised"><Label>Future Map</Label></Button
            >
          </div>
        </div>
      </div>

      <div class="my-3">
        <h3>Report a bug</h3>
        <div class="d-flex flex-row justify-content-around my-4">
          <div>
            <IconButton
              class="material-icons"
              title="Email"
              on:click={handleEmailButtonClick}>email</IconButton
            >
          </div>
          <div>
            <IconButton
              class="material-icons"
              title="Folder"
              on:click={handleGithubButtonClick}>folder</IconButton
            >
          </div>
        </div>
      </div>
    </Content>
  </Card>
</div>

<style>
</style>
