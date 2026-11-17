import { test, expect } from "@playwright/test";
import { log } from "node:console";

test.describe("Api Testing Module", () => {

    const AuthData = {
        "username": "admin",
        "password": "password123"
    }

    const BokingData = {
        "firstname": "Jim",
        "lastname": "Brown",
        "totalprice": 111,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2018-01-01",
            "checkout": "2019-01-01"
        },
        "additionalneeds": "Breakfast"
    }

    const updateBookingData = {
        "firstname": "Anu",
        "lastname": "Prabha",
        "totalprice": 123,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2027-03-01",
            "checkout": "2027-04-01"
        },
        "additionalneeds": "Breakfast"
    }
    const partcialupdateData = {
        "firstname": "Anu",
        "lastname": "James"
    }

    test('get Api Testing', async ({ request }) => {

        const req = await request.get("https://jsonplaceholder.typicode.com/posts/1");
        console.log(req);

        const reqjson = await req.json();
        expect(reqjson).toHaveProperty("userId", 1);
        expect(reqjson).toHaveProperty("title", "sunt aut facere repellat provident occaecati excepturi optio reprehenderit");
        console.log("Data in Json", reqjson);

        const reqstatus = await req.status();
        expect(reqstatus).toBe(200);
        console.log("Api Status:", reqstatus);

        const reqText = await req.statusText();
        expect(reqText).toBe('OK');
        console.log("Api Status Text:", reqText);

        const reqheadderArray = await req.headersArray();
        console.log("API Header:", reqheadderArray);

        const reqsec = await req.securityDetails();
        console.log("Api Security:", reqsec);

    })

    test("Post Api call Example with Token and Booking id", async ({ request }) => {

        const postReq = await request.post("https://restful-booker.herokuapp.com/auth",
            {
                headers: { "Content-Type": "application/json" },
                data: AuthData
            });

        console.log("Post Req:", postReq.status());
        console.log("Post Req Text:", postReq.statusText());

        const responseBody = await postReq.json();
        expect(responseBody.token).not.toBeNull();
        const authToken = await responseBody.token;
        console.log("Token:", authToken);
        console.log("------------------------------------------------------");

        // Booking Id with post request
        const bookingpost = await request.post(" https://restful-booker.herokuapp.com/booking",
            {
                headers: { 'Content-Type': 'application/json' },
                data: BokingData
            });

        console.log("Post Req for booking:", bookingpost.status());
        await expect(bookingpost.status()).toBe(200);
        console.log("Post Req Text for booking:", bookingpost.statusText());
        expect(bookingpost.statusText()).toBe("OK");

        const responseBodyPost = await bookingpost.json();
        console.log("Response Body for Booking:", responseBodyPost);

        // validation for response body 
        expect(responseBodyPost.bookingid).not.toBeNull();
        expect(responseBodyPost.booking.firstname).not.toBeNull();
        const BookingId = await responseBodyPost.bookingid
        console.log("New Booking Id:", BookingId);

        await expect(responseBodyPost.booking.firstname).toBe(BokingData.firstname);
        // validating response data is euqal to bookingdata of firstname we passed should be same.
        await expect(responseBodyPost.booking.lastname).toBe(BokingData.lastname);
        // why we passed firstname, lastname insteed of name-value - in future may change so that.
        await expect(responseBodyPost.booking.totalprice).toBe(BokingData.totalprice);
        await expect(responseBodyPost.booking.depositpaid).toEqual(BokingData.depositpaid);
        await expect(responseBodyPost.booking.bookingdates.checkin).toEqual(BokingData.bookingdates.checkin);
        await expect(responseBodyPost.booking.bookingdates.checkout).toEqual(BokingData.bookingdates.checkout);
        await expect(responseBodyPost.booking.additionalneeds).toEqual(BokingData.additionalneeds);
        console.log("------------------------------------------------------");


        // put and patch BookingId is not reconized in new test so im continueing here itself 
        const updateBooking = await request.put(`https://restful-booker.herokuapp.com/booking/${BookingId}`,

            {
                headers: {
                    "Content-Type": "application/json", // header1 
                    "Accept": "application/json", // header2
                    "Cookie": `token=${authToken}` // header3
                },
                data: updateBookingData
            })
        console.log("Status for Update Booking:", updateBooking.status());
        const updatedBooking = await updateBooking.json();
        console.log("updated Booking:", updatedBooking);
        console.log("------------------------------------------------------");

        //  partial Update of the Booking 
        const partialUpdate = await request.patch(`https://restful-booker.herokuapp.com/booking/${BookingId}`,

            {
                headers: {
                    "Content-Type": "application/json", // header1 
                    "Accept": "application/json", // header2
                    "Cookie": `token=${authToken}` // header3
                },
                data: partcialupdateData,
            })
        console.log("Status for Update Booking:", updateBooking.status());
        const partialUpdateBooking = await partialUpdate.json();
        console.log("partialy updated Booking:", partialUpdateBooking);
        console.log("------------------------------------------------------");

        // Delete Booking 
        const deleteBooking = await request.delete(`https://restful-booker.herokuapp.com/booking/${BookingId}`,

            {
                headers: {
                    "Content-Type": "application/json", // header1 
                    "Accept": "application/json", // header2
                    "Cookie": `token=${authToken}` // header3
                },
                data: partcialupdateData,
            })
        console.log("Delete Status of Booking:", deleteBooking.status());
        console.log("------------------------------------------------------");


        // get Booking by id - check its avaiablile after Deleting.
        const getByID = await request.get(`https://restful-booker.herokuapp.com/booking/${BookingId}`);
        console.log("Get Boking By Id-Status:", getByID.status());
        console.log("Get Boking By Id-Status Text:", getByID.statusText());
        expect(getByID.status()).toBe(404);
        expect(getByID.statusText()).toBe("Not Found");



    })

})