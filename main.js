const config = {
    url: "https://api.recursionist.io/builder/computers"
}

let cpuArr =[];
let gpuArr = [];
let ramArr = [];
let storageArr = [];
let selectedItems = {
    cpu: null,
    gpu: null,
    ram: null,
    storage: null
}
let selectedPCNum = 0;

// functions for cpu
fetch(config.url+"?type=cpu").then(response=>response.json()).then(function(data){
    cpuArr = data;
    createCpuBrandSelect(cpuArr);
});

function createCpuBrandSelect(cpuArr){
    let cpuBrandMap = {};
    for(let i=0; i<cpuArr.length; i++){
        cpuBrandMap[cpuArr[i]["Brand"]] = true;
    }
    let cpuBrandSelect = document.getElementById("cpu-brand-select");
    cpuBrandSelect.innerHTML = `<option selected>Open this select menu</option>`;
    for(let brand of Object.keys(cpuBrandMap)){
        cpuBrandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
    }
    cpuBrandSelect.addEventListener('change', function(event){
        selectedItems.cpu = null;
        createCpuModelSelect(cpuArr, event.target.value);
    });
}

function createCpuModelSelect(cpuArr, brand){
    let cpuModelSelect = document.getElementById("cpu-model-select");
    cpuModelSelect.innerHTML = `<option selected>Open this select menu</option>`;
    for(let cpu of cpuArr){
        if(cpu["Brand"]===brand){
            cpuModelSelect.innerHTML += `<option value="${cpu["Model"]}">${cpu["Model"]}</option>`;
        }
    }
    cpuModelSelect.addEventListener('change', function(event){
        selectedItems.cpu = cpuArr.find(cpu => cpu["Model"] === event.target.value);
        console.log(selectedItems);
    })
}

//functions for GPU
fetch(config.url+"?type=gpu").then(response=>response.json()).then(function(data){
    gpuArr = data;
    createGpuBrandSelect(gpuArr);
});

function createGpuBrandSelect(gpuArr){
    let gpuBrandMap = {};
    for(let gpu of gpuArr){
        gpuBrandMap[gpu["Brand"]] = true;
    }
    let gpuBrandSelect = document.getElementById("gpu-brand-select");
    gpuBrandSelect.innerHTML = `<option selected>Open this select menu</option>`;
    for(let brand of Object.keys(gpuBrandMap)){
        gpuBrandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
    }
    gpuBrandSelect.addEventListener('change', function(event){
        selectedItems.gpu = null;
        createGpuModelSelect(gpuArr, event.target.value);
    });
}

function createGpuModelSelect(gpuArr, brand){
    let gpuModelSelect = document.getElementById("gpu-model-select");
    gpuModelSelect.innerHTML = `<option selected>Open this select menu</option>`;
    for(let gpu of gpuArr){
        if(gpu["Brand"]===brand){
            gpuModelSelect.innerHTML += `<option value="${gpu["Model"]}">${gpu["Model"]}</option>`;
        }
    }
    gpuModelSelect.addEventListener('change', function(event){
        selectedItems.gpu = gpuArr.find(gpu => gpu["Model"] === event.target.value);
        console.log(selectedItems);
    })
}

// functions for RAM
fetch(config.url+"?type=ram").then(response=>response.json()).then(function(data){
    ramArr = data;
    addRamAmount(ramArr);
    createRamAmountSelect(ramArr);
});

function addRamAmount(arr){
    for(let i=0; i<arr.length; i++){
        arr[i]["Amount"] = getAmountOfRam(arr[i]);
    }
}

function getAmountOfRam(ramJsonData){
    let str = ramJsonData.Model;
    let strArr = str.split(" ");
    let amount = Number.parseInt(strArr[strArr.length-1].split("x")[0]);
    return amount;
}

function createRamAmountSelect(ramArr){
    let amountMap = {};
    for(let ram of ramArr){
        amountMap[ram["Amount"]] = true;
    }
    let ramAmountSelect = document.getElementById("memory-amount-select");
    ramAmountSelect.innerHTML = `<option selected>Open this select menu</option>`;
    for(let amount of Object.keys(amountMap)){
        ramAmountSelect.innerHTML += `<option value="${amount}">${amount}</option>`;
    }
    ramAmountSelect.addEventListener("change", function(event){
        selectedItems.ram = null;
        createRamBrandSelect(ramArr, Number.parseInt(event.target.value));
        createRamModelSelect(ramArr, NaN, null);
    });
}

function createRamBrandSelect(ramArr, amountOfRam){
    let ramBrandMap = {};
    for(let ram of ramArr){
        if(ram["Amount"]===amountOfRam){
            ramBrandMap[ram["Brand"]] = true;
        }
    }
    let ramBrandSelect = document.getElementById("memory-brand-select");
    ramBrandSelect.innerHTML = `<option selected>Open this select menu</option>`;
    for(let brand of Object.keys(ramBrandMap)){
        ramBrandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
    }
    ramBrandSelect.addEventListener('change', function(event){
        selectedItems.ram = null;
        createRamModelSelect(ramArr, amountOfRam, event.target.value);
    })
}

function createRamModelSelect(ramArr, amountOfRam, brand){
    let ramModelArr = ramArr.filter(ram => ram["Amount"]===amountOfRam && ram["Brand"]===brand);
    let ramModelSelect = document.getElementById("memory-model-select");
    ramModelSelect.innerHTML = `<option selected>Open this select menu</option>`;
    for(let ram of ramModelArr){
        ramModelSelect.innerHTML += `<option value="${ram["Model"]}">${ram["Model"]}</option>`;
    }
    ramModelSelect.addEventListener('change', function(event){
        selectedItems.ram = ramArr.find(ram => ram["Model"]===event.target.value);
        console.log(selectedItems);
    });
}

// functions for storage
let storageTypeSelect = document.getElementById("storage-type-select");
storageTypeSelect.innerHTML = `
    <option selected>Open this select menu</option>
    <option value="hdd">HDD</option>
    <option value="ssd">SSD</option>`;
storageTypeSelect.addEventListener('change', function(event){
    fetch(config.url+"?type="+event.target.value).then(response=>response.json()).then(function(data){
        storageArr = data;
        addStorageAmount(storageArr);
        createStorageAmountSelect(storageArr);
    });
})

function addStorageAmount(arr){
    for(let i=0; i<arr.length; i++){
        arr[i]["Amount"] = getAmountOfStorage(arr[i]);
    }
}

function getAmountOfStorage(ramJsonData){
    let str = ramJsonData.Model;
    let amount = str.match(/[0-9]+(TB|GB|MB)/g)[0];
    return amount;
}

function createStorageAmountSelect(storageArr){
    let amountMap = {};
    for(let storage of storageArr){
        amountMap[storage["Amount"]] = true;
    }
    let storageAmountSelect = document.getElementById("storage-amount-select");
    storageAmountSelect.innerHTML = `<option selected>Open this select menu</option>`;
    for(let amount of Object.keys(amountMap)){
        storageAmountSelect.innerHTML += `<option value="${amount}">${amount}</option>`;
    }
    storageAmountSelect.addEventListener("change", function(event){
        selectedItems.storage = null;
        createStorageBrandSelect(storageArr, event.target.value);
        createStorageModelSelect(storageArr, null, null);
    });
}

function createStorageBrandSelect(storageArr, amountOfStorage){
    let storageBrandMap = {};
    for(let storage of storageArr){
        if(storage["Amount"]===amountOfStorage){
            storageBrandMap[storage["Brand"]] = true;
        }
    }
    let storageBrandSelect = document.getElementById("storage-brand-select");
    storageBrandSelect.innerHTML = `<option selected>Open this select menu</option>`;
    for(let brand of Object.keys(storageBrandMap)){
        storageBrandSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
    }
    storageBrandSelect.addEventListener('change', function(event){
        selectedItems.storage = null;
        createStorageModelSelect(storageArr, amountOfStorage, event.target.value);
    })
}

function createStorageModelSelect(storageArr, amountOfStorage, brand){
    let storageModelArr = storageArr.filter(storage => storage["Amount"]===amountOfStorage && storage["Brand"]===brand);
    let storageModelSelect = document.getElementById("storage-model-select");
    storageModelSelect.innerHTML = `<option selected>Open this select menu</option>`;
    for(let storage of storageModelArr){
        storageModelSelect.innerHTML += `<option value='${storage["Model"]}'>${storage["Model"]}</option>`;
    }
    storageModelSelect.addEventListener('change', function(event){
        selectedItems.storage = storageArr.find(storage => storage["Model"]===event.target.value);
        console.log(selectedItems);
    });
}

//function for add PC buttom and bench mark test
let addBtn = document.getElementById("add-button");
addBtn.addEventListener('click', function(){
    if(Object.values(selectedItems).includes(null)){
        alert("Please select all items.");
    }
    else{
        selectedPCNum++;
        let gamingScore = testGameScore(selectedItems);
        let woringScore = testWorkScore(selectedItems);
        let resultSection = document.getElementById("test-results");
        resultSection.innerHTML += `
        <div class="bg-primary mb-1">
            <h1>Your PC${selectedPCNum}</h1>
            <div class="d-flex flex-row flex-wrap text-start p-3">
                <div class="col-12 col-md-6">
                    <h3>CPU</h3>
                    <p>Brand: ${selectedItems.cpu["Brand"]} </p>
                    <p>Model: ${selectedItems.cpu["Model"]} </p>
                </div>
                <div class="col-12 col-md-6">
                    <h3>GPU</h3>
                    <p>Brand: ${selectedItems.gpu["Brand"]} </p>
                    <p>Model: ${selectedItems.gpu["Model"]} </p>
                </div>
                <div class="col-12 col-md-6">
                    <h3>RAM</h3>
                    <p>Brand: ${selectedItems.ram["Brand"]} </p>
                    <p>Model: ${selectedItems.ram["Model"]} </p>
                </div>
                <div class="col-12 col-md-6">
                    <h3>Storage</h3>
                    <p>Brand: ${selectedItems.storage["Brand"]} </p>
                    <p>Model: ${selectedItems.storage["Model"]} </p>
                </div>
                <div class="col-6 text-end"><h3><u>Gamig: ${gamingScore}%</u></h3></div>
                <div class="col-6 text-end"><h3><u>Working: ${woringScore}%</u></h3></div>
            </div>
        </div>
        `;
    }
});

function testGameScore(item){
    let score = 0;
    score += Number.parseInt(item.gpu["Benchmark"])*0.6;
    score += Number.parseInt(item.cpu["Benchmark"])*0.25;
    score += Number.parseInt(item.ram["Benchmark"])*0.125;
    score += Number.parseInt(item.storage["Benchmark"])*0.025;
    return Math.floor(score);
}

function testWorkScore(item){
    let score = 0;
    score += Number.parseInt(item.cpu["Benchmark"])*0.6;
    score += Number.parseInt(item.gpu["Benchmark"])*0.25;
    score += Number.parseInt(item.ram["Benchmark"])*0.10;
    score += Number.parseInt(item.storage["Benchmark"])*0.05;
    return Math.floor(score);
}