/**
 * Prototype extensions.
 */

//source: https://stackoverflow.com/a/10142256/8691998
Array.prototype.shuffle = function () {
    var i = this.length, j, temp;

    if ( i == 0 ) 
        return this;

    while ( --i ) {
       j = Math.floor( Math.random() * ( i + 1 ) );
       temp = this[i];
       this[i] = this[j];
       this[j] = temp;
    }

    return this;
}

Array.prototype.containsSubArray = function (subArray) {
    for (let i of this) {
        if (areArraysEqual(i, subArray)) {
            return true;
        }
    }

    return false;
}

function areArraysEqual (arr1, arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }
    
    for (let i in arr1) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
}