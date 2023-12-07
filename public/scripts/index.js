// Define global variables
let alertNoise = 70;
let alertAir = 100;

// Function to change the global variables based on input values
function changeVariables() {
  const noiseInputValue = parseInt(document.getElementById('noiseInput').value);
  const airInputValue = parseInt(document.getElementById('airInput').value);

  if (!isNaN(noiseInputValue) && !isNaN(airInputValue)) {
    alertNoise = noiseInputValue;
    alertAir = airInputValue;
    // Update the HTML to display the new values
    document.getElementById('noiseValue').textContent = alertNoise;
    document.getElementById('airValue').textContent = alertAir;
  } else {
    alert('Please enter valid numbers for both inputs!');
  }
}

// Add event listeners to input fields to detect "Enter" key press
document.getElementById('noiseInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    changeVariables();
  }
});

document.getElementById('airInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    changeVariables();
  }
});

function epochToJsDate(e) {
    return new Date(1e3 * e);
}
function epochToDateTime(e) {
    var t = new Date(epochToJsDate(e));
    return t.getFullYear() + "/" + ("00" + (t.getMonth() + 1)).slice(-2) + "/" + ("00" + t.getDate()).slice(-2) + " " + ("00" + t.getHours()).slice(-2) + ":" + ("00" + t.getMinutes()).slice(-2) + ":" + ("00" + t.getSeconds()).slice(-2);
}
function plotValues(e, t, n) {
    var l = epochToJsDate(t).getTime(),
        a = Number(n);
    e.series[0].data.length > 40 ? e.series[0].addPoint([l, a], !0, !0, !0) : e.series[0].addPoint([l, a], !0, !1, !0);
}
const loginElement = document.querySelector("#login-form"),
    nocontentElement = document.querySelector("#no-content-sign-in"),
    contentElement = document.querySelector("#content-sign-in"),
    userDetailsElement = document.querySelector("#user-details"),
    authBarElement = document.querySelector("#authentication-bar"),
    deleteButtonElement = document.getElementById("delete-button"),
    deleteModalElement = document.getElementById("delete-modal"),
    deleteDataFormElement = document.querySelector("#delete-data-form"),
    viewDataButtonElement = document.getElementById("view-data-button"),
    hideDataButtonElement = document.getElementById("hide-data-button"),
    tableContainerElement = document.querySelector("#table-container"),
    chartsRangeInputElement = document.getElementById("charts-range"),
    loadDataButtonElement = document.getElementById("load-data"),
    cardsCheckboxElement = document.querySelector("input[name=cards-checkbox]"),
    gaugesCheckboxElement = document.querySelector("input[name=gauges-checkbox]"),
    chartsCheckboxElement = document.querySelector("input[name=charts-checkbox]"),
    cardsReadingsElement = document.querySelector("#cards-div"),
    gaugesReadingsElement = document.querySelector("#gauges-div"),
    chartsDivElement = document.querySelector("#charts-div"),
    tempElement = document.getElementById("temp"),
    humElement = document.getElementById("hum"),
    updateElement = document.getElementById("lastUpdate"),
    setupUI = (e) => {
        if (e) {
            (loginElement.style.display = "none"), (nocontentElement.style.display = "block"), (contentElement.style.display = "block"), (authBarElement.style.display = "block"), (userDetailsElement.style.display = "block"), (userDetailsElement.innerHTML = e.email);
            var t,
                n = 'NKUd9IhX3kUaACh3HZZp9XROPN93';
            console.log(n);
            var l = "UsersData/" + n.toString() + "/readings",
                a = "UsersData/" + n.toString() + "/charts/range",
                o = firebase.database().ref(l),
                s = firebase.database().ref(a),
                d = 0;
            function i() {
                var e = !0;
                o.orderByKey()
                    .limitToLast(100)
                    .on("child_added", function (n) {
                        if (n.exists()) {
                            var l = n.toJSON();
                            console.log(l);
                            var a = l.range,
                                o = l.flush,
                                s = l.timestamp,
                                d = "";
                            (d += "<tr>"), (d += "<td>" + epochToDateTime(s) + "</td>"), (d += "<td>" + a + "</td>"), (d += "<td>" + o + "</td>"), (d += "</tr>"), $("#tbody").prepend(d), e && ((t = s), (e = !1), console.log(t));
                        }
                    });
            }
            function r() {
                var e = [],
                    n = [];
                console.log("APEND"),
                    o
                        .orderByKey()
                        .limitToLast(100)
                        .endAt(t)
                        .once("value", function (l) {
                            if (l.exists()) {
                                l.forEach((t) => {
                                    var n = t.toJSON();
                                    e.push(n);
                                }),
                                    (t = e[0].timestamp);
                                var a = !0;
                                (n = e.reverse()).forEach((e) => {
                                    if (a) a = !1;
                                    else {
                                        var t = e.temperature,
                                            n = e.humidity,
                                            l = e.timestamp,
                                            o = "";
                                        (o += "<tr>"), (o += "<td>" + epochToDateTime(l) + "</td>"), (o += "<td>" + t + "</td>"), (o += "<td>" + n + "</td>"), (o += "</tr>"), $("#tbody").append(o);
                                    }
                                });
                            }
                        });
            }
            s.on("value", (e) => {
                (d = Number(e.val())),
                    console.log(d),
                    chartT.destroy(),
                    chartH.destroy(),
                    (chartT = createTemperatureChart()),
                    (chartH = createHumidityChart()),
                    o
                        .orderByKey()
                        .limitToLast(d)
                        .on("child_added", (e) => {
                            var t = e.toJSON(),
                                n = t.range,
                                l = t.flush,
                                a = t.timestamp;
                            plotValues(chartT, a, n), plotValues(chartH, a, l);
                        });
            }),
                (chartsRangeInputElement.onchange = () => {
                    s.set(chartsRangeInputElement.value);
                }),
                cardsCheckboxElement.addEventListener("change", (e) => {
                    cardsCheckboxElement.checked ? (cardsReadingsElement.style.display = "block") : (cardsReadingsElement.style.display = "none");
                }),
                chartsCheckboxElement.addEventListener("change", (e) => {
                    chartsCheckboxElement.checked ? (chartsDivElement.style.display = "block") : (chartsDivElement.style.display = "none");
                }),
                o
                    .orderByKey()
                    .limitToLast(1)
                    .on("child_added", (e) => {
                        var t = e.toJSON(),
                            n = t.range,
                            l = t.flush,
                            a = t.timestamp;
                        if ((n > alertAir)){
                            window.alert("Warning! Air quality above " + alertAir + " PPM");
                        };
                        if (l > alertNoise){
                            window.alert("Warning! Noise above " + alertNoise + " dB");
                        };
                        (tempElement.innerHTML = n), (humElement.innerHTML = l), (updateElement.innerHTML = epochToDateTime(a));
                    }),
                deleteButtonElement.addEventListener("click", (e) => {
                    console.log("Remove data"), e.preventDefault, (deleteModalElement.style.display = "block");
                }),
                deleteDataFormElement.addEventListener("submit", (e) => {
                    o.remove();
                }),
                viewDataButtonElement.addEventListener("click", (e) => {
                    (tableContainerElement.style.display = "block"), (viewDataButtonElement.style.display = "none"), (hideDataButtonElement.style.display = "inline-block"), (loadDataButtonElement.style.display = "inline-block"), i();
                }),
                loadDataButtonElement.addEventListener("click", (e) => {
                    r();
                }),
                hideDataButtonElement.addEventListener("click", (e) => {
                    (tableContainerElement.style.display = "none"), (viewDataButtonElement.style.display = "inline-block"), (hideDataButtonElement.style.display = "none");
                });
        } else {
            (loginElement.style.display = "block"), (authBarElement.style.display = "none"), (userDetailsElement.style.display = "none"), (contentElement.style.display = "block"),  (nocontentElement.style.display = "none");
            var t,
                n = 'NKUd9IhX3kUaACh3HZZp9XROPN93';
            var l = "UsersData/" + n.toString() + "/readings",
                a = "UsersData/" + n.toString() + "/charts/range",
                o = firebase.database().ref(l),
                s = firebase.database().ref(a),
                d = 0;
            function i() {
                var e = !0;
                o.orderByKey()
                    .limitToLast(100)
                    .on("child_added", function (n) {
                        if (n.exists()) {
                            var l = n.toJSON();
                            var a = l.range,
                                o = l.flush,
                                s = l.timestamp,
                                d = "";
                            (d += "<tr>"), (d += "<td>" + epochToDateTime(s) + "</td>"), (d += "<td>" + a + "</td>"), (d += "<td>" + o + "</td>"), (d += "</tr>"), $("#tbody").prepend(d), e && ((t = s), (e = !1), console.log(t));
                        }
                    });
            }
            function r() {
                var e = [],
                    n = [];
                console.log("APEND"),
                    o
                        .orderByKey()
                        .limitToLast(100)
                        .endAt(t)
                        .once("value", function (l) {
                            if (l.exists()) {
                                l.forEach((t) => {
                                    var n = t.toJSON();
                                    e.push(n);
                                }),
                                    (t = e[0].timestamp);
                                var a = !0;
                                (n = e.reverse()).forEach((e) => {
                                    if (a) a = !1;
                                    else {
                                        var t = e.temperature,
                                            n = e.humidity,
                                            l = e.timestamp,
                                            o = "";
                                        (o += "<tr>"), (o += "<td>" + epochToDateTime(l) + "</td>"), (o += "<td>" + t + "</td>"), (o += "<td>" + n + "</td>"), (o += "</tr>"), $("#tbody").append(o);
                                    }
                                });
                            }
                        });
            }
            s.on("value", (e) => {
                (d = Number(e.val())),
                    console.log(d),
                    chartT.destroy(),
                    chartH.destroy(),
                    (chartT = createTemperatureChart()),
                    (chartH = createHumidityChart()),
                    o
                        .orderByKey()
                        .limitToLast(d)
                        .on("child_added", (e) => {
                            var t = e.toJSON(),
                                n = t.range,
                                l = t.flush,
                                a = t.timestamp;
                            plotValues(chartT, a, n), plotValues(chartH, a, l);
                        });
            }),
                (chartsRangeInputElement.onchange = () => {
                    s.set(chartsRangeInputElement.value);
                }),
                cardsCheckboxElement.addEventListener("change", (e) => {
                    cardsCheckboxElement.checked ? (cardsReadingsElement.style.display = "block") : (cardsReadingsElement.style.display = "none");
                }),
                chartsCheckboxElement.addEventListener("change", (e) => {
                    chartsCheckboxElement.checked ? (chartsDivElement.style.display = "block") : (chartsDivElement.style.display = "none");
                }),
                o
                    .orderByKey()
                    .limitToLast(1)
                    .on("child_added", (e) => {
                        var t = e.toJSON(),
                            n = t.range,
                            l = t.flush,
                            a = t.timestamp;
                        if ((n > 100)){
                            window.alert("Warning! Air quality above 100 PPM");
                        };
                        if (l > 70){
                            window.alert("Warning! Noise above 70 dB");
                        };
                        (tempElement.innerHTML = n), (humElement.innerHTML = l), (updateElement.innerHTML = epochToDateTime(a));
                    }),
                deleteButtonElement.addEventListener("click", (e) => {
                    console.log("Remove data"), e.preventDefault, (deleteModalElement.style.display = "block");
                }),
                deleteDataFormElement.addEventListener("submit", (e) => {
                    o.remove();
                }),
                viewDataButtonElement.addEventListener("click", (e) => {
                    (tableContainerElement.style.display = "block"), (viewDataButtonElement.style.display = "none"), (hideDataButtonElement.style.display = "inline-block"), (loadDataButtonElement.style.display = "inline-block"), i();
                }),
                loadDataButtonElement.addEventListener("click", (e) => {
                    r();
                }),
                hideDataButtonElement.addEventListener("click", (e) => {
                    (tableContainerElement.style.display = "none"), (viewDataButtonElement.style.display = "inline-block"), (hideDataButtonElement.style.display = "none");
                });
        }
    };
