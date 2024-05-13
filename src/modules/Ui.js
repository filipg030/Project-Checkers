import { allNetFunctions } from "./Net";

const allEvents = {

    init() {



        document.getElementById("loginBt").onclick = function () {
            let username = document.getElementById("loginInput").value
            console.log("loginBt");
            allNetFunctions.loginUser(username)
        }

        document.getElementById("resetBt").onclick = function () {

            console.log("resetBt");

            allNetFunctions.resetUsers()
        }



    },


}

export { allEvents }