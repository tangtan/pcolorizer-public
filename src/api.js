const ipAddress = "127.0.0.1";
const port = "8080";
const baseUrl = "http://" + ipAddress + ":" + port + "/";

export const baseGetRequest = async (url) => {
    const res = await fetch(baseUrl + url, {
        method: "GET",
        mode: 'cors',
        headers: {
            'content-type': 'application/json'
        },
    });
    return res.json();
}

export const basePostRequest = async (url, data) => {
    const res = await fetch(baseUrl + url, {
        method: "POST",
        mode: 'cors',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return res.blob();
    // return res.json();
}

export const GetTestAPI = async () => {
    return await baseGetRequest("hello");
}

export const ExemplarBasedColorization = async (exampleIndex) => {
    // console.log("test-print-01", exampleIndex)
    return await basePostRequest("exemplar_based_colorization", exampleIndex)
}
