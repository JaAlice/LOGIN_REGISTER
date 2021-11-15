all_data = JSON.parse(document.getElementById("message").innerHTML)
try {let col_names = Object.keys(all_data[0])
let table = document.createElement("table");
let tr = table.insertRow(-1);                   // TABLE ROW.
    for (let i = 0; i < col_names.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col_names[i];
        tr.appendChild(th);
    }
    for (let i = 0; i < all_data.length; i++) {
        tr = table.insertRow(-1);
            for (var j = 0; j < col_names.length; j++) {
                let tabCell = tr.insertCell(-1);
                tabCell.innerHTML = all_data[i][col_names[j]];
            }
    }
document.getElementById("message").innerHTML = "";
document.getElementById("message").appendChild(table);}

catch(e) {document.getElementById("message").innerHTML = "Nothing found";}
