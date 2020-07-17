function completeCREPayment(param) {
    var code = decodeURIComponent(param.code);
    var message = param.message;
    var uID = param.uID;

    function removeElement(element) {
        element && element.parentNode && element.parentNode.removeChild(element);
    }

    removeElement(document.getElementById("secureFrame"));
    document.getElementById("secureFrameWrapper").innerHTML = "<p>Your transaction was successful!</p>" +
        "<p>Code: " + code + "</p>" +
        "<p>Message: " + message + "</p>" +
        "<p>uID: " + uID + "</p>" +
        "<p><a target=_blank href=XMLread.php>CLICK HERE TO VIEW XML RESPONSE</a></p>"
};


function cancelCREPayment() {
    alert("Payment Cancelled");
}

function whatCVV2() {
    alert("The 3 numbers on the back of your card");
}

function creHandleDetailErrors(errorCode, gatewayCode, gatewayMessage) {
    alert("Detailed Error Handler\nError Code: " + errorCode + ", " + gatewayCode + ", " + gatewayMessage + ".");

}
