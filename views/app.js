import { showLoader, hideLoader } from "./loader.js"
import { row } from "./templates/record.js"

showLoader();

function addRecords(records) {
    const table = document.querySelector("#records-table > tbody")
    table.innerHTML = ""
    let totalAmount = 0;
    records.forEach(record => {
        totalAmount += record.amount
        table.insertAdjacentHTML("beforeend", row(record))
    })
    document.querySelector("#total-amount").textContent = totalAmount
}

function addLogRecords(records) {
    const table = document.querySelector("#date-table > tbody")
    table.innerHTML = ""
    let totalAmount = 0;
    records.forEach(record => {
        totalAmount += record.amount
        table.insertAdjacentHTML("beforeend", row(record))
    })
    document.querySelector("#total-log-amount").textContent = totalAmount
}

function showModal(modal) {
    setTimeout(function(){}, 100)
    modal.classList.toggle("scale-0")
    modal.classList.toggle("scale-100")
}

function closeModal(modal) {
    modal.classList.toggle("scale-100")
    modal.classList.toggle("scale-0")
    setTimeout(function(){}, 100)
}

function millisToMinutesAndHours_string(millis) {
    let minutes = Math.floor(millis / 60000);
    let hours = (minutes > 60) ? Math.floor(minutes / 60) : 0;
    minutes = (hours > 0) ?  Math.floor(minutes % 60) : minutes
    let hoursString = (hours == 0) ? "00:" : ((hours > 9) ? `${hours}:` : `0${hours}:`)
    let minutesString = (minutes < 9) ? `0${minutes}` : `${minutes}`
    return hoursString + minutesString;
}

function millisToMinutes(millis) {
    return Math.floor(millis / 60000)
}

function roundUp(number) {
    return Math.ceil(number / 500) * 500;
}

function getDeviceNumber(deviceName) {
    switch (deviceName) {
        case 'الجهاز الأول':
            return 1;
        case 'الجهاز الثاني':
            return 2;
        case 'الجهاز الثالث':
            return 3;
        case 'الجهاز الرابع':
            return 4;
        case 'الجهاز الخامس':
            return 5;
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    const devices = document.querySelectorAll(".device-btn");
    const deviceModal = document.querySelector("#device-modal");
    const closeDeviceMoadlBtn = document.querySelector("#close-device-modal")
    const saveRecordBtn = document.querySelector("#save-record")
    const startTime = document.querySelector("#start-time")
    const endTime = document.querySelector("#end-time")
    const totalTime = document.querySelector("#total-time")
    const price = document.querySelector("#price")
    let currentDevice;
    
    const exitBtn = document.querySelector("#exit");

    const expenseBtn = document.querySelector("#expense");
    const expenseModal = document.querySelector("#expense-modal");
    const closeModalBtn = document.querySelector("#close-modal")
    const saveExpenseBtn = document.querySelector("#save-expense")

    const optionsBtn = document.querySelector("#settings");
    const saveOptionsBtn = document.querySelector("#save-options");
    const optionsModal = document.querySelector("#options-modal");
    const closeOptionsModalBtn = document.querySelector("#close-options-modal")
    // const exportBtn = document.querySelector("#export")
    // const importBtn = document.querySelector("#import")

    const logBtn = document.querySelector("#log")
    const logModal = document.querySelector("#log-modal")
    const closeLogModalBtn = document.querySelector("#close-log-modal")
    const dateSelector = document.querySelector("#date")
    const dateTable = document.querySelector("#date-table")

    // exportBtn.addEventListener("click", function() {
    //     electronAPI.exportDB()
    // })

    // importBtn.addEventListener("click", function() {
    //     const input = document.createElement('input');
    //     input.type = 'file';
    //     input.addEventListener("change", function(e) {
    //         electronAPI.importDB(URL.createObjectURL(e.target.files[0]))
    //     })
    //     input.click();
    // })

    document.querySelector("#records-table").addEventListener("click", async function(e) {
        if(e.target.classList.contains("delete-btn")) {
            await electronAPI.deleteRecord(e.target.parentNode.parentNode.id)
            const totalAmount = document.querySelector("#total-amount");
            let newTotalAmount = (+totalAmount.textContent) - (+e.target.parentNode.parentNode.querySelector(".numerical-amount").textContent)
            totalAmount.textContent = newTotalAmount;
            e.target.parentNode.parentNode.remove()
        }
    })

    dateTable.addEventListener("click", async function(e) {
        if(e.target.classList.contains("delete-btn")) {
            await electronAPI.deleteRecord(e.target.parentNode.parentNode.id)
            const totalAmount = document.querySelector("#total-log-amount");
            let newTotalAmount = (+totalAmount.textContent) - (+e.target.parentNode.parentNode.querySelector(".numerical-amount").textContent)
            totalAmount.textContent = newTotalAmount;
            e.target.parentNode.parentNode.remove()
        }
    })

    logBtn.addEventListener("click", function() {
        showModal(logModal)
    })

    closeLogModalBtn.addEventListener("click", async function() {
        if(!dateTable.classList.contains("hidden")) {
            dateTable.classList.toggle("hidden")
        }
        dateSelector.value = ""
        document.querySelector("#total-log-amount").textContent = 0
        const newRecords = await electronAPI.getTodayRecords()
        addRecords(newRecords)
        closeModal(logModal)
    })

    dateSelector.addEventListener("change", async function() {
        if(this.value.trim() == "") {
            if(!dateTable.classList.contains("hidden")) {
                dateTable.classList.toggle("hidden")
            }
            return;
        }
        const newRecords = await electronAPI.getSpecificDayRecords((new Date(this.value)).toISOString())
        addLogRecords(newRecords)
        if(dateTable.classList.contains("hidden")) {
            dateTable.classList.toggle("hidden")
        }
    })

    const records = await electronAPI.getTodayRecords()
    addRecords(records)

    exitBtn.addEventListener("click",function() {
        electronAPI.quit();
    });

    expenseBtn.addEventListener("click", function() {
        showModal(expenseModal)
    })

    closeModalBtn.addEventListener("click", async function() {
        const newRecords = await electronAPI.getTodayRecords()
        addRecords(newRecords)
        closeModal(expenseModal)
    })

    optionsBtn.addEventListener("click", function() {
        showModal(optionsModal)
    })

    saveOptionsBtn.addEventListener("click", function() {
        let hour = document.querySelector("#hour").value
        let ceil = document.querySelector("#ceil").selectedIndex == 0 ? true : false;
        let options = {hour, ceil};
        closeModal(optionsModal)
        electronAPI.editOptions(options);
    })

    document.querySelector("#hour").addEventListener("input", function() {
        if(this.value.trim() == "") {
            saveOptionsBtn.disabled = true;
            saveOptionsBtn.classList = "save-btn-disabled"
        } else {
            saveOptionsBtn.disabled = false;
            saveOptionsBtn.classList = "save-btn"
        }
    })

    closeOptionsModalBtn.addEventListener("click", function() {
        closeModal(optionsModal)
    })

    const options = await electronAPI.getOptions();
    document.querySelector("#hour").value = options.hour
    document.querySelector("#ceil").selectedIndex = (options.ceil == 1) ? 0 : 1;

    devices.forEach(function(device) {
        device.deviceName = device.textContent
        device.addEventListener("click", function(e) {
            if(device.classList.contains("btn-active")) {
                device.textContent = device.deviceName
                currentDevice = getDeviceNumber(device.deviceName)
                const hour = document.querySelector("#hour").value;
                const ceil = document.querySelector("#hour").selectedIndex == 0 ? true : false;

                const milliSeconds = Math.abs(new Date() - device.startTime)
                const numericalPrice = (ceil) ? roundUp(millisToMinutes(milliSeconds) * (Math.ceil(+hour/60))) : millisToMinutes(milliSeconds) * (Math.ceil(+hour/60))

                startTime.textContent = device.startTime.toLocaleTimeString()
                endTime.textContent = (new Date()).toLocaleTimeString()
                totalTime.textContent =  millisToMinutesAndHours_string(milliSeconds)
                price.textContent = numericalPrice
                if(numericalPrice < 100) {
                    saveRecordBtn.disabled = true;
                    saveRecordBtn.classList = 'save-btn-disabled'
                } else {
                    saveRecordBtn.disabled = false;
                    saveRecordBtn.classList = 'save-btn'
                }
                showModal(deviceModal)
            } else {
                device.textContent = "إيقاف"
                device.startTime = new Date()
            }
            device.classList.toggle("btn")
            device.classList.toggle("btn-active")
        })
    })

    closeDeviceMoadlBtn.addEventListener("click", function() {
        closeModal(deviceModal)
    })

    saveRecordBtn.addEventListener("click", async function() {
        let title = currentDevice;
        let amount = parseInt(price.textContent);
        amount = isNaN(amount) ? 0 : amount;
        // let date_added = (new Date()).toISOString();
        let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        let record = {title, amount, "date_added": localISOTime};
        await electronAPI.addRecord(record)
        const newRecords = await electronAPI.getTodayRecords()
        addRecords(newRecords)
        closeModal(deviceModal)
    })

    saveExpenseBtn.addEventListener("click", async function() {
        let title = document.querySelector("#name").value;
        let amount = parseInt(document.querySelector("#amount").value);
        amount = isNaN(amount) ? 0 : -amount;
        // let date_added = (new Date()).toISOString();
        let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        let record = {title, amount, "date_added": localISOTime};
        await electronAPI.addRecord(record)
        const newRecords = await electronAPI.getTodayRecords()
        addRecords(newRecords)
        closeModal(expenseModal)
        document.querySelector("#name").value = ""
        document.querySelector("#amount").value = ""
        saveExpenseBtn.disabled = true;
        saveExpenseBtn.classList = "save-btn-disabled"
    })

    document.querySelector("#name").addEventListener("input", function() {
        if(this.value.trim() == "" || document.querySelector("#amount").value.trim() == "") {
            saveExpenseBtn.disabled = true;
            saveExpenseBtn.classList = "save-btn-disabled"
        } else {
            saveExpenseBtn.disabled = false;
            saveExpenseBtn.classList = "save-btn"
        }
    })

    document.querySelector("#amount").addEventListener("input", function() {
        if(this.value.trim() == "" || document.querySelector("#name").value.trim() == "") {
            saveExpenseBtn.disabled = true;
            saveExpenseBtn.classList = "save-btn-disabled"
        } else {
            saveExpenseBtn.disabled = false;
            saveExpenseBtn.classList = "save-btn"
        }
    })

    hideLoader();
})
