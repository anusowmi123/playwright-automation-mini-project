import{test,expect} from "@playwright/test";
import fs from "fs" ; //read the file 
import path from "path";

test.describe("Api Testing eith json Data File",()=>{

test("Create Booking with Json Data",async({request})=>{

  // read the json file   
const jsonPath = path.join(__dirname, "../testDatas/Booking.json");//__dirname (Works from any folder)
const filepath = fs.readFileSync(jsonPath, "utf-8");
const NewBooking = JSON.parse(filepath);


 const CreateBooking = await request.post("https://restful-booker.herokuapp.com/booking",
    {

        headers:{
                   "Content-Type":"application/json",
                },
       data:NewBooking
    });

expect(CreateBooking.status()).toBe(200);
const ResponseBody = await CreateBooking.json();

console.log("New Booking is Created:",ResponseBody);

console.log("Booking ID:",ResponseBody.bookingid);
expect(ResponseBody.booking.firstname).toBe(NewBooking.firstname);
expect(ResponseBody.booking.bookingdates.checkin).toEqual(NewBooking.bookingdates.checkin);

})
})