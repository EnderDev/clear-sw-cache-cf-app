const run = async () => {
    if(document.getElementById("___gatsby")) {
        const retries = localStorage.getItem("sw-cache-cf-app-retries") 
            ? parseInt(localStorage.getItem("sw-cache-cf-app-retries"))
            : 0;

        const exempt = parseInt(localStorage.getItem("sw-cache-cf-app-exempt"));
        
        // If we fail more than 4 times exempt the app from trying again for 1 week
        // This is to avoid a refresh loop.
        if(retries >= 1) {
            localStorage.setItem("sw-cache-cf-app-exempt", Date.now()+604800000) // 1 week
        }

        // Remove exempt status after 1 week fail time is up
        if(exempt && Date.now() >= exempt) {
            localStorage.removeItem("sw-cache-cf-app-exempt");
            localStorage.removeItem("sw-cache-cf-app-retries");
        }

        localStorage.setItem(
            "sw-cache-cf-app-retries", 
            retries+1
        )

        if(exempt && Date.now() <= exempt) return;

        caches.keys().then(async function(names) {
            for await (let name of names) {
                await caches.delete(name);
            }
        
            window.location.reload();

            console.log("done")
        });
    } else {
        // Clean up any remaining keys
        localStorage.removeItem("sw-cache-cf-app-exempt");
        localStorage.removeItem("sw-cache-cf-app-retries");
    }
};

run();
